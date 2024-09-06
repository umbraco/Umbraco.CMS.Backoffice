import type { UmbUploadableFolderModel, UmbUploadableFileModel } from './dropzone-manager.class.js';
import { UmbDropzoneManager } from './dropzone-manager.class.js';
import { UmbProgressEvent } from '@umbraco-cms/backoffice/event';
import { css, html, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import type { UUIFileDropzoneElement, UUIFileDropzoneEvent, UUIFileFolder } from '@umbraco-cms/backoffice/external/uui';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UMB_NOTIFICATION_CONTEXT, type UmbNotificationContext } from '@umbraco-cms/backoffice/notification';

@customElement('umb-dropzone')
export class UmbDropzoneElement extends UmbLitElement {
	@property({ attribute: false })
	parentUnique: string | null = null;

	@property({ type: Boolean })
	multiple: boolean = true;

	@property({ type: Boolean })
	createAsTemporary: boolean = false;

	@property({ type: Array, attribute: false })
	accept: Array<string> = [];

	//TODO: logic to disable the dropzone?

	#init: Promise<unknown>;

	#notificationContext?: UmbNotificationContext;

	#files: Array<UmbUploadableFileModel | UmbUploadableFolderModel> = [];

	public getFiles() {
		return this.#files;
	}

	public browse() {
		const element = this.shadowRoot?.querySelector('#dropzone') as UUIFileDropzoneElement;
		return element.browse();
	}

	constructor() {
		super();
		document.addEventListener('dragenter', this.#handleDragEnter.bind(this));
		document.addEventListener('dragleave', this.#handleDragLeave.bind(this));
		document.addEventListener('drop', this.#handleDrop.bind(this));

		this.#init = Promise.all([
			this.consumeContext(UMB_NOTIFICATION_CONTEXT, (instance) => {
				this.#notificationContext = instance;
			}).asPromise(),
		]);
	}

	override disconnectedCallback(): void {
		super.disconnectedCallback();
		document.removeEventListener('dragenter', this.#handleDragEnter.bind(this));
		document.removeEventListener('dragleave', this.#handleDragLeave.bind(this));
		document.removeEventListener('drop', this.#handleDrop.bind(this));
	}

	#handleDragEnter(e: DragEvent) {
		// Avoid collision with UmbSorterController
		const types = e.dataTransfer?.types;
		if (!types?.length || !types?.includes('Files')) return;
		this.toggleAttribute('dragging', true);
	}

	#handleDragLeave() {
		this.toggleAttribute('dragging', false);
	}

	#handleDrop(event: DragEvent) {
		event.preventDefault();
		this.toggleAttribute('dragging', false);
	}

	async #onDropFiles(event: UUIFileDropzoneEvent) {
		if (!event.detail.folders && !event.detail.files) return;

		await this.#init;

		const folderFileCount = this.#countFilesInFolders(event.detail.folders);
		const fileCount = folderFileCount + (event.detail.files?.length ?? 0);

		const dropzoneManager = new UmbDropzoneManager(this);
		this.observe(
			dropzoneManager.completed,
			(completed) => {
				if (!completed.length) return;
				this.#displayProgress(dropzoneManager, completed.length, fileCount);

				const progress = Math.floor(completed.length / fileCount);
				this.dispatchEvent(new UmbProgressEvent(progress));

				this.#files = completed;
				this.dispatchEvent(new CustomEvent('change', { detail: { completed } }));

				if (completed.length === fileCount) {
					this.dispatchEvent(new UmbProgressEvent(-1));
					dropzoneManager.destroy();
				}
			},
			'_observeCompleted',
		);

		if (event.detail.folders) {
			await dropzoneManager.createFoldersAsMedia(event.detail.folders, this.parentUnique);
		}

		if (event.detail.files) {
			if (this.createAsTemporary) {
				await dropzoneManager.createFilesAsTemporary(event.detail.files);
			} else {
				await dropzoneManager.createFilesAsMedia(event.detail.files, this.parentUnique);
			}
		}
	}

	#displayProgress(dropzoneManager: UmbDropzoneManager, progress: number, total: number) {
		if (dropzoneManager.notificationHandler) {
			this.#notificationContext?.update(dropzoneManager.notificationHandler, {
				data: {
					message: `${progress}/${total} items uploaded.`,
				},
				color: progress == total ? 'positive' : 'default',
				duration: progress == total ? 6000 : null,
			});
			return;
		}

		dropzoneManager.notificationHandler = this.#notificationContext?.stay('default', {
			data: {
				headline: 'Uploading files',
				message: `${progress}/${total} items uploaded.`,
			},
			color: progress == total ? 'positive' : 'default',
			duration: progress == total ? 6000 : null,
		});
	}

	#countFilesInFolders(folders: UUIFileFolder[] | null): number {
		if (!folders) return 0;

		return (
			folders.reduce((count, folder) => count + folder.files.length + this.#countFilesInFolders(folder.folders), 0) +
			folders.length
		);
	}

	override render() {
		return html`<uui-file-dropzone
			id="dropzone"
			.accept=${this.accept?.join(',')}
			?multiple=${this.multiple}
			@change=${this.#onDropFiles}
			label="${this.localize.term('media_dragAndDropYourFilesIntoTheArea')}"></uui-file-dropzone>`;
	}

	static override styles = [
		css`
			:host([dragging]) #dropzone {
				opacity: 1;
				pointer-events: all;
			}

			[dropzone] {
				opacity: 0;
			}

			#dropzone {
				opacity: 0;
				pointer-events: none;
				display: flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				inset: 0px;
				z-index: 100;
				backdrop-filter: opacity(1); /* Removes the built in blur effect */
				border-radius: var(--uui-border-radius);
				overflow: clip;
				border: 1px solid var(--uui-color-focus);
			}
			#dropzone:after {
				content: '';
				display: block;
				position: absolute;
				inset: 0;
				border-radius: var(--uui-border-radius);
				background-color: var(--uui-color-focus);
				opacity: 0.2;
			}
		`,
	];
}

export default UmbDropzoneElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-dropzone': UmbDropzoneElement;
	}
}
