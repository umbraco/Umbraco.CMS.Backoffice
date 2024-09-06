import type { UmbMediaDetailModel } from '../types.js';
import { UmbMediaDetailRepository } from '../repository/index.js';
import { UmbSortChildrenOfMediaServerDataSource } from '../entity-actions/sort-children-of/repository/sort-children-of.server.data.js';
import { UMB_DROPZONE_MEDIA_TYPE_PICKER_MODAL } from './modals/dropzone-media-type-picker/dropzone-media-type-picker-modal.token.js';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbControllerBase } from '@umbraco-cms/backoffice/class-api';
import { type UmbAllowedMediaTypeModel, UmbMediaTypeStructureRepository } from '@umbraco-cms/backoffice/media-type';
import {
	TemporaryFileStatus,
	UmbTemporaryFileManager,
	type UmbTemporaryFileModel,
} from '@umbraco-cms/backoffice/temporary-file';
import { UmbId } from '@umbraco-cms/backoffice/id';
import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';
import { UmbArrayState } from '@umbraco-cms/backoffice/observable-api';
import type { UmbNotificationHandler, UmbNotificationContext } from '@umbraco-cms/backoffice/notification';
import { UMB_NOTIFICATION_CONTEXT } from '@umbraco-cms/backoffice/notification';
import type { UUIFileFolder } from '@umbraco-cms/backoffice/external/uui';

export interface UmbUploadableFileModel extends UmbTemporaryFileModel {
	unique: string;
	mediaTypeUnique: string;
}

export interface UmbUploadableFolderModel {
	folderName: string;
	mediaTypeUnique: string;
	unique: string;
}

export interface UmbUploadableExtensionModel {
	fileExtension: string;
	mediaTypes: Array<UmbAllowedMediaTypeModel>;
}

/**
 * Manages the dropzone and uploads files to the server.
 * @function createFilesAsMedia - Upload files to the server and creates the items using corresponding media type.
 * @function createFilesAsTemporary - Upload the files as temporary files and returns the data.
 * @observable completed - Emits an array of completed uploads.
 */
export class UmbDropzoneManager extends UmbControllerBase {
	#host;

	#init: Promise<unknown>;

	#tempFileManager = new UmbTemporaryFileManager<UmbUploadableFileModel>(this);

	#notificationContext?: UmbNotificationContext;

	#mediaTypeStructure = new UmbMediaTypeStructureRepository(this);
	#mediaDetailRepository = new UmbMediaDetailRepository(this);
	#sortMediaDataSource = new UmbSortChildrenOfMediaServerDataSource(this);

	#completed = new UmbArrayState<UmbUploadableFileModel | UmbUploadableFolderModel>([], (upload) => upload.unique);
	public readonly completed = this.#completed.asObservable();

	public notificationHandler?: UmbNotificationHandler;

	constructor(host: UmbControllerHost) {
		super(host);
		this.#host = host;

		this.#init = Promise.all([
			this.consumeContext(UMB_NOTIFICATION_CONTEXT, (instance) => {
				this.#notificationContext = instance;
			}).asPromise(),
		]);
	}

	/**
	 * Uploads the files as temporary files and returns the data.
	 * @param files
	 * @returns Promise<Array<UmbUploadableFileModel>>
	 */
	public async createFilesAsTemporary(files: Array<File>): Promise<Array<UmbTemporaryFileModel>> {
		const temporaryFiles: Array<UmbTemporaryFileModel> = [];

		for (const file of files) {
			const uploaded = await this.#tempFileManager.uploadOne({
				temporaryUnique: UmbId.new(),
				file,
				mediaTypeUnique: 'TEMPORARY',
				unique: UmbId.new(),
			});
			this.#completed.setValue([...this.#completed.getValue(), uploaded]);
			temporaryFiles.push(uploaded);
		}

		return temporaryFiles;
	}

	public async createFoldersAsMedia(folders: Array<UUIFileFolder>, parentUnique: string | null): Promise<void> {
		if (!folders.length) return;
		await this.#init;

		await this.#createFoldersAsMedia(folders, parentUnique);
	}

	async #createFoldersAsMedia(
		folders: Array<UUIFileFolder>,
		parentUnique: string | null,
		mediaTypeUnique?: string | null,
	): Promise<void> {
		const folderOptions = await this.#buildAllowedFolderTypes(parentUnique);
		if (!folderOptions?.length) {
			this.#notifyInvalidFolders(folders);
			return;
		}

		const pickedMediaTypeUnique = mediaTypeUnique ?? (await this.#pickFolderMediaType(folderOptions, folders));
		const uploadableFolders = folders.map((folder) => ({ folder, mediaTypeUnique: pickedMediaTypeUnique }));

		for (const uploadableFolder of uploadableFolders) {
			const folderUnique = UmbId.new();
			await this.#createFolderItem(
				{
					folderName: uploadableFolder.folder.folderName,
					mediaTypeUnique: uploadableFolder.mediaTypeUnique,
					unique: folderUnique,
				},
				parentUnique,
			);

			if (uploadableFolder.folder.files.length) {
				await this.#createFilesAsMedia(uploadableFolder.folder.files, folderUnique);
			}

			if (uploadableFolder.folder.folders.length) {
				await this.#createFoldersAsMedia(
					uploadableFolder.folder.folders,
					folderUnique,
					uploadableFolder.mediaTypeUnique,
				);
			}

			this.#completed.setValue([
				...this.#completed.getValue(),
				{
					folderName: uploadableFolder.folder.folderName,
					mediaTypeUnique: uploadableFolder.mediaTypeUnique,
					unique: folderUnique,
				} satisfies UmbUploadableFolderModel,
			]);
		}
	}

	#notifyInvalidFolders(folders: UUIFileFolder[]) {
		folders.forEach((folder) => {
			this.#notificationContext?.peek('danger', {
				data: {
					headline: 'Upload failed',
					message: `Folder ${folder.folderName} is not allowed here.`,
				},
			});
		});
	}

	/**
	 * Uploads files to the server and creates the items with corresponding media type.
	 * Allows the user to pick a media type option if multiple types are allowed.
	 * @param {Array<File>} files - Files to upload
	 * @param {string | null} parentUnique - Unique of the parent media item
	 * @returns {Promise<void>}
	 */
	public async createFilesAsMedia(files: Array<File>, parentUnique: string | null): Promise<void> {
		if (!files.length) return;
		await this.#init;

		await this.#createFilesAsMedia(files, parentUnique);
	}

	async #createFilesAsMedia(files: Array<File>, parentUnique: string | null): Promise<void> {
		const uploadableFiles: Array<UmbUploadableFileModel> = [];
		const notAllowedFiles: Array<File> = [];

		const filesByExtension: Record<string, Array<File>> = {};
		for (const file of files) {
			const fileNameParts = file.name.split('.');
			if (fileNameParts.length < 2) {
				// File has no extension
				notAllowedFiles.push(file);
				continue;
			}

			const extension = fileNameParts[fileNameParts.length - 1];
			filesByExtension[extension] = filesByExtension[extension] || [];
			filesByExtension[extension].push(file);
		}

		const optionsArray = await this.#buildOptionsArrayFrom(Object.keys(filesByExtension), parentUnique);
		if (!optionsArray.length) return; // None of the files are allowed in current dropzone.

		for (const extension of Object.keys(filesByExtension)) {
			const options = optionsArray.find((option) => option.fileExtension === extension)?.mediaTypes;

			if (!options?.length) {
				// TODO Current dropped file not allowed in this area. Find a good way to show this to the user after we finish uploading the rest of the files.
				notAllowedFiles.push(...filesByExtension[extension]);
				continue;
			}

			const files = filesByExtension[extension];

			const mediaTypeUnique = await this.#pickFolderMediaType(options, files);

			for (const file of files) {
				uploadableFiles.push({
					temporaryUnique: UmbId.new(),
					file,
					mediaTypeUnique,
					unique: UmbId.new(),
				});
			}
		}

		notAllowedFiles.forEach((file) => {
			this.#notificationContext?.peek('danger', {
				data: {
					headline: 'Upload failed',
					message: `File ${file.name} of type ${file.type ?? 'Unknown'} is not allowed here.`,
				},
			});
		});

		if (!uploadableFiles.length) return;

		await this.#handleUpload(uploadableFiles, parentUnique);

		await this.#sortUploadedFiles(uploadableFiles, parentUnique);
	}

	async #sortUploadedFiles(uploadableFiles: UmbUploadableFileModel[], parentUnique: string | null) {
		let sortOrder = uploadableFiles.length - 1;
		await this.#sortMediaDataSource.sortChildrenOf({
			unique: parentUnique,
			sorting: uploadableFiles.map((file) => {
				return {
					unique: file.unique,
					sortOrder: sortOrder--,
				};
			}),
		});
	}

	async #buildOptionsArrayFrom(
		fileExtensions: Array<string>,
		parentUnique: string | null,
	): Promise<Array<UmbUploadableExtensionModel>> {
		const parentMediaType = await this.#getParentMediaType(parentUnique);

		// Getting all media types allowed in our current position based on parent's media type.

		const { data: allAllowedMediaTypes } = await this.#mediaTypeStructure.requestAllowedChildrenOf(parentMediaType);
		if (!allAllowedMediaTypes?.items.length) return [];
		const allowedByParent = allAllowedMediaTypes.items;

		// Building an array of options the files can be uploaded as.
		const options: Array<UmbUploadableExtensionModel> = [];

		for (const fileExtension of fileExtensions) {
			const extensionOptions = await this.#mediaTypeStructure.requestMediaTypesOf({ fileExtension });
			const mediaTypes = extensionOptions.filter((option) => {
				return allowedByParent.find((allowed) => option.unique === allowed.unique);
			});
			options.push({ fileExtension, mediaTypes });
		}
		return options;
	}

	async #buildAllowedFolderTypes(parentUnique: string | null) {
		const allFolderTypes = await this.#mediaTypeStructure.requestFolderMediaTypes({});

		const parentMediaType = await this.#getParentMediaType(parentUnique);

		const { data: allAllowedMediaTypes } = await this.#mediaTypeStructure.requestAllowedChildrenOf(parentMediaType);
		if (!allAllowedMediaTypes?.items.length) return [];
		const allowedByParent = allAllowedMediaTypes.items;

		return allFolderTypes.filter((folderType) => {
			return allowedByParent.find((allowed) => folderType.unique === allowed.unique);
		});
	}

	async #getParentMediaType(parentUnique: string | null): Promise<string | null> {
		let parentMediaType: string | null = null;
		if (parentUnique) {
			const { data } = await this.#mediaDetailRepository.requestByUnique(parentUnique);
			parentMediaType = data?.mediaType.unique ?? null;
		}
		return parentMediaType;
	}

	async #pickFolderMediaType(options: Array<UmbAllowedMediaTypeModel>, elements: Array<UUIFileFolder | File>) {
		if (options.length === 1) return options[0].unique;
		const selectedMediaType = await this.#showDialogMediaTypePicker(
			elements.map((e) => ({ name: 'folderName' in e ? e.folderName : e.name })),
			options,
		);
		return selectedMediaType?.unique ?? options[0].unique;
	}

	async #showDialogMediaTypePicker(files: { name: string }[], options: Array<UmbAllowedMediaTypeModel>) {
		const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
		const modalContext = modalManager.open(this.#host, UMB_DROPZONE_MEDIA_TYPE_PICKER_MODAL, {
			data: { options, files },
		});
		const value = await modalContext.onSubmit().catch(() => undefined);
		return value ? { unique: value.mediaTypeUnique ?? options[0].unique } : null;
	}

	async #handleUpload(files: Array<UmbUploadableFileModel>, parentUnique: string | null) {
		await this.#tempFileManager.upload(files, {
			callback: async (upload) => {
				switch (upload.status) {
					case TemporaryFileStatus.SUCCESS:
						await this.#createMediaItem(upload, parentUnique);
						break;
					case TemporaryFileStatus.ERROR:
						// TODO Find a good way to show files that ended up as TemporaryFileStatus.ERROR. Notice that they were allowed in current area
						break;
				}

				this.#completed.setValue([...this.#completed.getValue(), upload]);
			},
		});
	}

	async #createMediaItem(upload: UmbUploadableFileModel, parentUnique: string | null) {
		const preset: Partial<UmbMediaDetailModel> = {
			unique: upload.unique,
			mediaType: {
				unique: upload.mediaTypeUnique,
				collection: null,
			},
			variants: [
				{
					culture: null,
					segment: null,
					name: upload.file.name,
					createDate: null,
					updateDate: null,
				},
			],
			values: [
				{
					alias: 'umbracoFile',
					value: { temporaryFileId: upload.temporaryUnique },
					culture: null,
					segment: null,
				},
			],
		};

		const { data } = await this.#mediaDetailRepository.createScaffold(preset);
		await this.#mediaDetailRepository.create(data!, parentUnique);
	}

	async #createFolderItem(
		upload: {
			folderName: string;
			mediaTypeUnique: string;
			unique: string;
		},
		parentUnique: string | null,
	) {
		const preset: Partial<UmbMediaDetailModel> = {
			unique: upload.unique,
			mediaType: {
				unique: upload.mediaTypeUnique,
				collection: null,
			},
			variants: [
				{
					culture: null,
					segment: null,
					name: upload.folderName,
					createDate: null,
					updateDate: null,
				},
			],
		};

		const { data } = await this.#mediaDetailRepository.createScaffold(preset);
		await this.#mediaDetailRepository.create(data!, parentUnique);
	}

	private _reset() {
		//
	}

	public override destroy() {
		this.#tempFileManager.destroy();
		this.#completed.destroy();
		super.destroy();
	}
}
