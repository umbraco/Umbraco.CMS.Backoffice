import { UmbMediaDetailRepository } from '../repository/index.js';
import type { UmbMediaDetailModel } from '../types.js';
import {
	UmbFileDropzoneItemStatus,
	type UmbAllowedMediaByFileExtension,
	type UmbUploadableFile,
	type UmbUploadableFolder,
	type UmbFileDropzoneDroppedItems,
	type UmbFileDropzoneProgress,
	type UmbUploadableItem,
	type UmbAllowedChildrenByMediaType,
} from './types.js';
import { getExtensionFromMime } from './utils.js';
import { UMB_DROPZONE_MEDIA_TYPE_PICKER_MODAL } from './modals/index.js';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbControllerBase } from '@umbraco-cms/backoffice/class-api';
import {
	TemporaryFileStatus,
	UmbTemporaryFileManager,
	type UmbTemporaryFileModel,
} from '@umbraco-cms/backoffice/temporary-file';
import { UmbArrayState, UmbObjectState } from '@umbraco-cms/backoffice/observable-api';
import { UmbId } from '@umbraco-cms/backoffice/id';
import { type UmbAllowedMediaTypeModel, UmbMediaTypeStructureRepository } from '@umbraco-cms/backoffice/media-type';
import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';

/**
 * Manages the dropzone and uploads folders and files to the server.
 * @function createMediaItems - Upload files and folders to the server and creates the items using corresponding media type.
 * @function createTemporaryFiles - Upload the files as temporary files and returns the data.
 * @observable progress - Emits the number of completed items and total items.
 * @observable progressItems - Emits the items with their current status.
 */
export class UmbDropzoneManager extends UmbControllerBase {
	#host: UmbControllerHost;
	#isFoldersAllowed = true;

	#mediaTypeStructure = new UmbMediaTypeStructureRepository(this);
	#mediaDetailRepository = new UmbMediaDetailRepository(this);

	#tempFileManager = new UmbTemporaryFileManager(this);

	#optionsByExt = new UmbArrayState<UmbAllowedMediaByFileExtension>([], (x) => x.fileExtension);
	#allowedMediaTypes = new UmbArrayState<UmbAllowedChildrenByMediaType>([], (x) => x.mediaTypeUnique);
	#parentMediaTypes = new UmbArrayState<{ unique: string; mediaType: string }>([], (x) => x.unique);

	#progress = new UmbObjectState<UmbFileDropzoneProgress>({ total: 0, completed: 0 });
	public readonly progress = this.#progress.asObservable();

	#progressItems = new UmbArrayState<UmbUploadableItem>([], (x) => x.unique);
	public readonly progressItems = this.#progressItems.asObservable();

	constructor(host: UmbControllerHost) {
		super(host);
		this.#host = host;
	}

	public setIsFoldersAllowed(isAllowed: boolean) {
		this.#isFoldersAllowed = isAllowed;
	}

	public getIsFoldersAllowed(): boolean {
		return this.#isFoldersAllowed;
	}

	/**
	 * Uploads files and folders to the server and creates the media items with corresponding media type.\
	 * Allows the user to pick a media type option if multiple types are allowed.
	 * @param {UmbFileDropzoneDroppedItems} items - The files and folders to upload
	 * @param {string | null} parentUnique - Where the items should be uploaded
	 */
	public async createMediaItems(items: UmbFileDropzoneDroppedItems, parentUnique: string | null = null) {
		const uploadableItems = await this.#setupProgress(items, parentUnique);
		if (uploadableItems.length === 1) {
			// When there is only one item being uploaded, allow the user to pick the media type, if more than one is allowed.
			await this.#createOneMediaItem(uploadableItems[0]);
		} else {
			// When there are multiple items being uploaded, automatically pick the media types for each item.
			await this.#createMediaItems(uploadableItems);
		}
	}

	/**
	 * Uploads the files as temporary files and returns the data.
	 * @param { File[] } files - The files to upload.
	 * @returns {Promise<Array<UmbUploadableFileModel>>} - Files as temporary files.
	 */
	public async createTemporaryFiles(files: Array<File>) {
		const uploadableItems = (await this.#setupProgress({ files, folders: [] }, null)) as Array<UmbUploadableFile>;

		const uploadedItems: Array<UmbTemporaryFileModel> = [];

		for (const item of uploadableItems) {
			// Upload as temp file
			const uploaded = await this.#tempFileManager.uploadOne({
				temporaryUnique: item.temporaryFile.temporaryUnique,
				file: item.temporaryFile.file,
			});

			// Update progress
			const progress = this.#progress.getValue();
			this.#progress.update({ completed: progress.completed + 1 });

			if (uploaded.status === TemporaryFileStatus.SUCCESS) {
				this.#progressItems.updateOne(item.unique, { status: UmbFileDropzoneItemStatus.UPLOADED });
			} else {
				this.#progressItems.updateOne(item.unique, { status: UmbFileDropzoneItemStatus.ERROR });
			}

			// Add to return value
			uploadedItems.push(uploaded);
		}

		return uploadedItems;
	}

	async #showDialogMediaTypePicker(options: Array<UmbAllowedMediaTypeModel>) {
		const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
		const modalContext = modalManager.open(this.#host, UMB_DROPZONE_MEDIA_TYPE_PICKER_MODAL, { data: { options } });
		const value = await modalContext.onSubmit().catch(() => undefined);
		return value?.mediaTypeUnique;
	}

	async #createOneMediaItem(item: UmbUploadableItem) {
		const allowed = await this.#getAllowedMediaTypes(item);
		if (!allowed.length) {
			return this.#updateProgress(item, UmbFileDropzoneItemStatus.NOT_ALLOWED);
		}

		const mediaTypeUnique = allowed.length > 1 ? await this.#showDialogMediaTypePicker(allowed) : allowed[0].unique;

		if (!mediaTypeUnique) {
			return this.#updateProgress(item, UmbFileDropzoneItemStatus.CANCELLED);
		}

		if (item.temporaryFile) {
			this.#handleFile(item as UmbUploadableFile, mediaTypeUnique);
		} else if (item.folder) {
			this.#handleFolder(item as UmbUploadableFolder, mediaTypeUnique);
		}
	}

	async #createMediaItems(uploadableItems: Array<UmbUploadableItem>) {
		for (const item of uploadableItems) {
			const allowed = await this.#getAllowedMediaTypes(item);
			if (!allowed.length) continue;

			const mediaTypeUnique = allowed[0].unique;

			// Handle files and folders differently: a file is uploaded as temp then created as a media item, and a folder is created as a media item directly
			if (item.temporaryFile) {
				await this.#handleFile(item as UmbUploadableFile, mediaTypeUnique);
			} else if (item.folder) {
				await this.#handleFolder(item as UmbUploadableFolder, mediaTypeUnique);
			}
		}
	}

	async #handleFile(item: UmbUploadableFile, mediaTypeUnique: string) {
		// Upload the file as a temporary file and update progress.
		const temporaryFile = await this.#uploadAsTemporaryFile(item);
		if (temporaryFile.status !== TemporaryFileStatus.SUCCESS) {
			this.#updateProgress(item, UmbFileDropzoneItemStatus.ERROR);
			return;
		}

		this.#updateProgress(item, UmbFileDropzoneItemStatus.UPLOADED, true);

		// Create the media item.
		const scaffold = await this.#getItemScaffold(item, mediaTypeUnique);
		const { data } = await this.#mediaDetailRepository.create(scaffold!, item.parentUnique);

		if (data) {
			this.#updateProgress(item, UmbFileDropzoneItemStatus.CREATED);
		} else {
			this.#updateProgress(item, UmbFileDropzoneItemStatus.ERROR);
		}
	}

	async #handleFolder(item: UmbUploadableFolder, mediaTypeUnique: string) {
		const scaffold = await this.#getItemScaffold(item, mediaTypeUnique);
		const { data } = await this.#mediaDetailRepository.create(scaffold!, item.parentUnique);
		if (data) {
			this.#updateProgress(item, UmbFileDropzoneItemStatus.CREATED);
		} else {
			this.#updateProgress(item, UmbFileDropzoneItemStatus.ERROR);
		}
	}

	async #uploadAsTemporaryFile(item: UmbUploadableFile) {
		const uploaded = await this.#tempFileManager.uploadOne({
			temporaryUnique: item.temporaryFile.temporaryUnique,
			file: item.temporaryFile.file,
		});
		return uploaded;
	}

	// Media types

	async #prepareMediaTypeOptions() {
		// Look up possible media types for all the different file types based on the progress items.
		const progressItems = this.#progressItems.getValue();

		const allTypes = progressItems.map((item) => item.temporaryFile?.file.type || null);
		const mimetypes = [...new Set(allTypes)]; // Duplicate types removed
		const extensions = mimetypes.map((mime) => getExtensionFromMime(mime ?? '') || null);

		for (const fileExtension of extensions) {
			// Check if we already have media types for this extension, otherwise request it.
			const stored = this.#optionsByExt.getValue().find((x) => x.fileExtension === fileExtension);
			if (stored) continue;

			// TODO Add skip and take logic, but the repository doesn't return the data as paged.
			if (fileExtension) {
				const mediaTypes = await this.#mediaTypeStructure.requestMediaTypesOf({ fileExtension });
				this.#optionsByExt.appendOne({ fileExtension, mediaTypes });
			} else {
				const mediaTypes = await this.#mediaTypeStructure.requestMediaTypesOfFolders();
				this.#optionsByExt.appendOne({ fileExtension: null, mediaTypes: mediaTypes });
			}
		}
	}

	async #getAllowedMediaTypes(item: UmbUploadableItem): Promise<Array<UmbAllowedMediaTypeModel>> {
		const extension = getExtensionFromMime(item.temporaryFile?.file.type ?? '') || null;
		const optionsByExt = this.#optionsByExt.getValue().find((x) => x.fileExtension === extension)?.mediaTypes ?? [];

		const parentMediaType = await this.#getParentMediaType(item.parentUnique);

		const stored = this.#allowedMediaTypes.getValue().find((x) => x.mediaTypeUnique === parentMediaType);
		if (stored) {
			return stored.allowedChildren.filter((x) => optionsByExt.find((option) => option.unique === x.unique));
		}

		const { data: mediaTypes } = await this.#mediaTypeStructure.requestAllowedChildrenOf(parentMediaType);
		if (mediaTypes) {
			this.#allowedMediaTypes.appendOne({ mediaTypeUnique: parentMediaType, allowedChildren: mediaTypes.items });
			const filtered = optionsByExt.filter((x) => mediaTypes.items.find((option) => option.unique === x.unique));
			return filtered;
		} else {
			this.#allowedMediaTypes.appendOne({ mediaTypeUnique: parentMediaType, allowedChildren: [] });
			this.#updateProgress(item, UmbFileDropzoneItemStatus.NOT_ALLOWED);
			return [];
		}
	}

	async #getParentMediaType(unique: string | null) {
		if (!unique) return null;

		const mediaType = this.#parentMediaTypes.getValue().find((x) => x.unique === unique)?.mediaType;
		if (mediaType) return mediaType;

		const { data: parent } = await this.#mediaDetailRepository.requestByUnique(unique);
		if (!parent) return null;

		this.#parentMediaTypes.appendOne({ unique, mediaType: parent.mediaType.unique });
		return parent.mediaType.unique;
	}

	// Scaffold
	async #getItemScaffold(item: UmbUploadableItem, mediaTypeUnique: string) {
		const name = item.temporaryFile ? item.temporaryFile.file.name : (item.folder?.name ?? '');
		const umbracoFile = {
			alias: 'umbracoFile',
			value: { temporaryFileId: item.temporaryFile?.temporaryUnique },
			culture: null,
			segment: null,
		};

		const preset: Partial<UmbMediaDetailModel> = {
			unique: item.unique,
			mediaType: { unique: mediaTypeUnique, collection: null },
			variants: [{ culture: null, segment: null, createDate: null, updateDate: null, name }],
			values: item.temporaryFile ? [umbracoFile] : undefined,
		};
		const { data } = await this.#mediaDetailRepository.createScaffold(preset);
		return data;
	}

	// Progress handling

	async #setupProgress(items: UmbFileDropzoneDroppedItems, parent: string | null) {
		const current = this.#progress.getValue();
		const currentItems = this.#progressItems.getValue();

		const uploadableItems = this.#prepareItemsAsUploadable({ folders: items.folders, files: items.files }, parent);

		this.#progressItems.setValue([...currentItems, ...uploadableItems]);
		this.#progress.setValue({ total: current.total + uploadableItems.length, completed: current.completed });

		// Prepare media type options based on the items' different file types. We need this later when checking which media types are allowed by the parent.
		await this.#prepareMediaTypeOptions();

		return uploadableItems;
	}

	#updateProgress(item: UmbUploadableItem, status: UmbFileDropzoneItemStatus, updateItemOnly = false) {
		this.#progressItems.updateOne(item.unique, { status });
		const progress = this.#progress.getValue();
		if (!updateItemOnly) {
			this.#progress.update({ completed: progress.completed + 1 });
		}
	}

	#prepareItemsAsUploadable = (
		{ folders, files }: UmbFileDropzoneDroppedItems,
		parentUnique: string | null,
	): Array<UmbUploadableItem> => {
		const items: Array<UmbUploadableItem> = [];

		for (const file of files) {
			const unique = UmbId.new();
			if (file.type) {
				items.push({
					unique,
					parentUnique,
					status: UmbFileDropzoneItemStatus.WAITING,
					temporaryFile: { file, temporaryUnique: UmbId.new() },
				});
			}
		}

		for (const subfolder of folders) {
			const unique = UmbId.new();
			items.push({
				unique,
				parentUnique,
				status: UmbFileDropzoneItemStatus.WAITING,
				folder: { name: subfolder.folderName },
			});

			items.push(...this.#prepareItemsAsUploadable({ folders: subfolder.folders, files: subfolder.files }, unique));
		}
		return items;
	};

	public override destroy() {
		this.#tempFileManager.destroy();
		super.destroy();
	}
}
