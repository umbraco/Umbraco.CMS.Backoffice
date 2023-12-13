import { UMB_DICTIONARY_TREE_ALIAS } from '../../tree/manifests.js';
import { UmbDictionaryRepository } from '../../repository/dictionary.repository.js';
import { css, html, customElement, query, state, when } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import {
	UmbImportDictionaryModalData,
	UmbImportDictionaryModalValue,
	UmbModalBaseElement,
} from '@umbraco-cms/backoffice/modal';
import { UmbId } from '@umbraco-cms/backoffice/id';
import { UmbEntityTreeItemModel, UmbTreeElement } from '@umbraco-cms/backoffice/tree';

interface DictionaryItemPreview {
	name: string;
	id: string;
	children: Array<DictionaryItemPreview>;
}

@customElement('umb-import-dictionary-modal')
export class UmbImportDictionaryModalLayout extends UmbModalBaseElement<
	UmbImportDictionaryModalData,
	UmbImportDictionaryModalValue
> {
	@state()
	private _parentId?: string;

	@state()
	private _temporaryFileId = '';

	@query('#form')
	private _form!: HTMLFormElement;

	@query('umb-tree')
	private _treeElement?: UmbTreeElement;

	#fileReader;

	#fileNodes!: NodeListOf<ChildNode>;

	#fileContent: Array<DictionaryItemPreview> = [];

	#dictionaryRepository: UmbDictionaryRepository;

	#handleClose() {
		this.modalContext?.reject();
	}

	#createTreeEntitiesFromTempFile(): Array<UmbEntityTreeItemModel> {
		const data: Array<UmbEntityTreeItemModel> = [];

		const list = this.#dictionaryPreviewItemBuilder(this.#fileNodes);
		const scaffold = (items: Array<DictionaryItemPreview>, parentId?: string) => {
			items.forEach((item) => {
				data.push({
					id: item.id,
					name: item.name,
					entityType: 'dictionary-item',
					hasChildren: item.children.length ? true : false,
					parentId: parentId || null,
					isContainer: false,
					isFolder: false,
				});
				scaffold(item.children, item.id);
			});
		};

		scaffold(list, this._parentId);
		return data;
	}

	async #submit() {
		const { error } = await this.#dictionaryRepository.import(this._temporaryFileId, this._parentId);
		if (error) return;

		this.value = { entityItems: this.#createTreeEntitiesFromTempFile(), parentId: this._parentId };
		this.modalContext?.submit();
	}

	constructor() {
		super();
		this.#dictionaryRepository = new UmbDictionaryRepository(this);

		this.#fileReader = new FileReader();

		this.#fileReader.onload = (e) => {
			if (typeof e.target?.result === 'string') {
				const fileContent = e.target.result;
				this.#dictionaryPreviewBuilder(fileContent);
			}
		};
	}

	connectedCallback(): void {
		super.connectedCallback();
		this._parentId = this.data?.unique ?? undefined;
	}

	#dictionaryPreviewBuilder(htmlString: string) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlString, 'text/xml');
		const elements = doc.childNodes;
		this.#fileNodes = elements;

		this.#fileContent = this.#dictionaryPreviewItemBuilder(elements);
		this.requestUpdate();
	}

	#dictionaryPreviewItemBuilder(nodeList: NodeListOf<ChildNode>): Array<DictionaryItemPreview> {
		const items: Array<DictionaryItemPreview> = [];
		const list: Array<Element> = [];
		nodeList.forEach((node) => {
			if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'DictionaryItem') {
				list.push(node as Element);
			}
		});

		list.forEach((item) => {
			items.push({
				name: item.getAttribute('Name') ?? '',
				id: item.getAttribute('Key') ?? '',
				children: this.#dictionaryPreviewItemBuilder(item.childNodes) ?? undefined,
			});
		});

		return items;
	}

	async #onUpload(e: Event) {
		e.preventDefault();
		const formData = new FormData(this._form);
		const file = formData.get('file') as File;

		if (!file) throw new Error('File is missing');

		this.#fileReader.readAsText(file);
		this._temporaryFileId = UmbId.new();

		this.#dictionaryRepository.upload(this._temporaryFileId, file);
	}

	#onParentChange() {
		this._parentId = this._treeElement?.selection[0] ?? undefined;
	}

	async #onFileInput() {
		requestAnimationFrame(() => {
			this._form.requestSubmit();
		});
	}

	#onClear() {
		this._temporaryFileId = '';
	}

	render() {
		return html` <umb-body-layout headline=${this.localize.term('general_import')}>
			<uui-box>
				${when(
					this._temporaryFileId,
					() => this.#renderImportDestination(),
					() => this.#renderUploadZone(),
				)}
			</uui-box>
			<uui-button
				slot="actions"
				type="button"
				label=${this.localize.term('general_cancel')}
				@click=${this.#handleClose}></uui-button>
		</umb-body-layout>`;
	}

	#renderFileContents(items: Array<DictionaryItemPreview>): any {
		return html`${items.map((item: DictionaryItemPreview) => {
			return html`${item.name}
				<div>${this.#renderFileContents(item.children)}</div>`;
		})}`;
	}

	#renderImportDestination() {
		return html`
			<div id="wrapper">
				<div>
					<strong><umb-localize key="visuallyHiddenTexts_dictionaryItems">Dictionary items</umb-localize>:</strong>
					<div id="item-list">${this.#renderFileContents(this.#fileContent)}</div>
				</div>
				<div>
					<strong><umb-localize key="actions_chooseWhereToImport">Choose where to import</umb-localize>:</strong>
					<br />parentId:

					<umb-tree
						?hide-tree-root=${true}
						?multiple=${false}
						alias=${UMB_DICTIONARY_TREE_ALIAS}
						@selection-change=${this.#onParentChange}
						.selection=${[this._parentId ?? '']}
						selectable></umb-tree>
				</div>

				${this.#renderNavigate()}
			</div>
		`;
	}

	#renderNavigate() {
		return html`<div id="nav">
			<uui-button label=${this.localize.term('general_import')} look="secondary" @click=${this.#onClear}>
				<uui-icon name="icon-arrow-left"></uui-icon>
				${this.localize.term('general_back')}
			</uui-button>
			<uui-button
				type="button"
				label=${this.localize.term('general_import')}
				look="primary"
				@click=${this.#submit}></uui-button>
		</div>`;
	}

	#renderUploadZone() {
		return html`<umb-localize key="dictionary_importDictionaryItemHelp"></umb-localize>
			<uui-form>
				<form id="form" name="form" @submit=${this.#onUpload}>
					<uui-form-layout-item>
						<uui-label for="file" slot="label" required>${this.localize.term('formFileUpload_pickFile')}</uui-label>
						<uui-input-file
							accept=".udt"
							name="file"
							id="file"
							@input=${this.#onFileInput}
							required
							required-message=${this.localize.term('formFileUpload_pickFile')}></uui-input-file>
					</uui-form-layout-item>
				</form>
			</uui-form>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			uui-input {
				width: 100%;
			}
			#item-list {
				padding: var(--uui-size-3) var(--uui-size-4);
				border: 1px solid var(--uui-color-border);
				border-radius: var(--uui-border-radius);
			}
			#item-list div {
				padding-left: 20px;
			}

			#wrapper {
				display: flex;
				flex-direction: column;
				gap: var(--uui-size-3);
			}
		`,
	];
}

export default UmbImportDictionaryModalLayout;

declare global {
	interface HTMLElementTagNameMap {
		'umb-import-dictionary-modal': UmbImportDictionaryModalLayout;
	}
}
