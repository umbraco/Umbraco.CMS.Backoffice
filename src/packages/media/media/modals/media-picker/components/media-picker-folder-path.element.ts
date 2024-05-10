import type { UmbMediaPathModel } from '../types.js';
import type { UmbMediaDetailModel } from '../../../types.js';
import { UmbMediaDetailRepository } from '../../../repository/index.js';
import { UmbMediaTreeRepository } from '../../../tree/media-tree.repository.js';
import { css, html, customElement, state, repeat, property, query } from '@umbraco-cms/backoffice/external/lit';
import type { UUIInputElement, UUIInputEvent } from '@umbraco-cms/backoffice/external/uui';
import { UmbId } from '@umbraco-cms/backoffice/id';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import { getUmbracoFolderUnique } from '@umbraco-cms/backoffice/media-type';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

const root = { name: 'Media', unique: null };

@customElement('umb-media-picker-folder-path')
export class UmbMediaPickerFolderPathElement extends UmbLitElement {
	#mediaTreeRepository = new UmbMediaTreeRepository(this); // used to get file structure
	#mediaDetailRepository = new UmbMediaDetailRepository(this); // used to create folders

	@property()
	public set currentPath(value: string | null) {
		if (value !== this._currentPath) {
			this._currentPath = value;
			this.#loadPath();
			this.dispatchEvent(new UmbChangeEvent());
		}
	}
	public get currentPath() {
		return this._currentPath;
	}

	@state()
	private _currentPath: string | null = null;

	@state()
	private _paths: Array<UmbMediaPathModel> = [root];

	@state()
	private _typingNewFolder = false;

	@query('#path')
	private _pathContainer?: HTMLElement;

	connectedCallback(): void {
		super.connectedCallback();
		this.#loadPath();
	}

	#scroll() {
		requestAnimationFrame(() => {
			if (this._pathContainer) this._pathContainer.scrollLeft = this._pathContainer.scrollWidth;
		});
	}

	async #loadPath() {
		if (this.currentPath) {
			const { data } = await this.#mediaTreeRepository.requestTreeItemAncestors({
				descendantUnique: this.currentPath,
			});
			if (data) {
				this._paths = [
					root,
					...data.map((item) => {
						const name = item.name.length > 15 ? item.name.slice(0, 12) + '...' : item.name;
						return { name, unique: item.unique };
					}),
				];
			} else {
				this._paths = [root];
			}
		}
		this.#scroll();
	}

	#goToFolder(unique: string | null) {
		this._paths = [...this._paths].slice(0, this._paths.findIndex((path) => path.unique === unique) + 1);
		this.currentPath = unique;
	}

	#focusFolderInput() {
		this._typingNewFolder = true;
		requestAnimationFrame(() => {
			const element = this.getHostElement().shadowRoot!.querySelector('#new-folder') as UUIInputElement;
			element.focus();
			element.select();
		});
	}

	async #addFolder(e: UUIInputEvent) {
		e.stopPropagation();
		const newName = e.target.value as string;
		this._typingNewFolder = false;
		if (!newName) return;

		const newUnique = UmbId.new();
		const parentUnique = this._paths[this._paths.length - 1].unique;

		const preset: Partial<UmbMediaDetailModel> = {
			unique: newUnique,
			mediaType: {
				unique: getUmbracoFolderUnique(),
				collection: null,
			},
			variants: [
				{
					culture: null,
					segment: null,
					name: newName,
					createDate: null,
					updateDate: null,
				},
			],
		};
		const { data: scaffold } = await this.#mediaDetailRepository.createScaffold(preset);
		if (!scaffold) return;

		const { data } = await this.#mediaDetailRepository.create(scaffold, parentUnique);
		if (!data) return;

		const name = data.variants[0].name;
		const unique = data.unique;

		this._paths = [...this._paths, { name, unique }];
		this.currentPath = unique;
	}

	render() {
		return html`<uui-scroll-container id="path">
			${repeat(
				this._paths,
				(path) => path.unique,
				(path) =>
					html`<uui-button
							compact
							.label=${path.name}
							?disabled=${this.currentPath == path.unique}
							@click=${() => this.#goToFolder(path.unique)}></uui-button
						>/`,
			)}${this._typingNewFolder
				? html`<uui-input
						id="new-folder"
						label="enter a name"
						value="new folder name"
						@blur=${this.#addFolder}
						auto-width></uui-input>`
				: html`<uui-button label="add folder" compact @click=${this.#focusFolderInput}>+</uui-button>`}
		</uui-scroll-container>`;
	}

	static styles = [
		css`
			:host {
				display: flex;
			}
			#path {
				display: flex;
				overflow: auto;
				align-items: center;
				margin: 0 var(--uui-size-3);
			}
			#path uui-button {
				font-weight: bold;
				flex: 0 0 auto;
			}
			#path uui-input {
				height: max-content;
				overflow: hidden;
			}
		`,
	];
}

export default UmbMediaPickerFolderPathElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-media-picker-folder-path': UmbMediaPickerFolderPathElement;
	}
}
