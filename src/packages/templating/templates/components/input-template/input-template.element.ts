import type { UmbTemplateCardElement } from '../template-card/template-card.element.js';
import '../template-card/template-card.element.js';

import { UmbTemplateRepository } from '../../repository/template.repository.js';
import { css, html, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UUITextStyles, FormControlMixin } from '@umbraco-cms/backoffice/external/uui';
import {
	UMB_TEMPLATE_PICKER_MODAL,
	UMB_TEMPLATE_MODAL,
	UmbModalManagerContext,
	UMB_MODAL_MANAGER_CONTEXT_TOKEN,
} from '@umbraco-cms/backoffice/modal';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { ItemResponseModelBaseModel, TemplateResponseModel } from '@umbraco-cms/backoffice/backend-api';

@customElement('umb-input-template')
export class UmbInputTemplateElement extends FormControlMixin(UmbLitElement) {
	/**
	 * This is a minimum amount of selected items in this input.
	 * @type {number}
	 * @attr
	 * @default undefined
	 */
	@property({ type: Number })
	min?: number;

	/**
	 * Min validation message.
	 * @type {boolean}
	 * @attr
	 * @default
	 */
	@property({ type: String, attribute: 'min-message' })
	minMessage = 'This field need more items';

	/**
	 * This is a maximum amount of selected items in this input.
	 * @type {number}
	 * @attr
	 * @default undefined
	 */
	@property({ type: Number })
	max?: number;

	/**
	 * Max validation message.
	 * @type {boolean}
	 * @attr
	 * @default
	 */
	@property({ type: String, attribute: 'min-message' })
	maxMessage = 'This field exceeds the allowed amount of items';

	_selectedIds: Array<string> = [];
	@property({ type: Array })
	public get selectedIds() {
		return this._selectedIds;
	}
	public set selectedIds(newKeys: Array<string> | undefined) {
		this._selectedIds = newKeys ?? [];
		this.#observePickedTemplates();
	}

	_defaultId = '';
	@property({ type: String })
	public get defaultId(): string {
		return this._defaultId;
	}
	public set defaultId(newId: string) {
		this._defaultId = newId;
		super.value = newId;
		this.#observePickedTemplates();
	}

	private _modalContext?: UmbModalManagerContext;
	private _templateRepository: UmbTemplateRepository = new UmbTemplateRepository(this);

	@state()
	_pickedTemplates: ItemResponseModelBaseModel[] = [];

	constructor() {
		super();

		this.consumeContext(UMB_MODAL_MANAGER_CONTEXT_TOKEN, (instance) => {
			this._modalContext = instance;
		});
	}

	async #observePickedTemplates() {
		this.observe(
			(await this._templateRepository.requestItems(this._selectedIds)).asObservable(),
			(data) => {
				const oldValue = this._pickedTemplates;
				this._pickedTemplates = data;
				this.requestUpdate('_pickedTemplates', oldValue);
			},
			'_observeTemplates'
		);
	}

	protected getFormElement() {
		return this;
	}

	#onCardChange(e: CustomEvent) {
		e.stopPropagation();
		const newKey = (e.target as UmbTemplateCardElement).value as string;
		this.defaultId = newKey;
		this.dispatchEvent(new CustomEvent('change'));
	}

	#openPicker() {
		// TODO: Change experience, so its not multi selectable. But instead already picked templates should be unpickable. (awaiting general picker features for such)
		const modalContext = this._modalContext?.open(UMB_TEMPLATE_PICKER_MODAL, {
			multiple: true,
			selection: [...this._selectedIds],
			pickableFilter: (template: TemplateResponseModel) => template.id !== null,
		});

		modalContext?.onSubmit().then((data) => {
			if (!data.selection) return;
			this.selectedIds = data.selection.filter((x) => x !== null) as Array<string>;
			this.dispatchEvent(new CustomEvent('change'));
		});
	}

	#removeTemplate(id: string) {
		/*
		TODO: We need to follow up on this experience.
		Could we test if this document type is in use, if so we should have a dialog notifying the user(Dialog, are you sure...) about that we might will break something?
		If thats the case, Im not why if a template will be removed from an actual document.
		If if its just the option that will go away.
		(Comment by Niels)
		In current backoffice we just prevent deleting a default when there are other templates. But if its the only one its okay. This is a weird experience, so we should make something that makes more sense.
		BTW. its weird cause the damage of removing the default template is equally bad when there is one or more templates.
		*/
		this.selectedIds = this._selectedIds.filter((x) => x !== id);
	}

	#openTemplate(e: CustomEvent) {
		const id = (e.target as UmbTemplateCardElement).value;

		this._modalContext?.open(UMB_TEMPLATE_MODAL, {
			id: id as string,
			language: 'razor',
		});
	}

	render() {
		return html`
			${this._pickedTemplates.map(
				(template) => html`
					<umb-template-card
						.name="${template.name ?? ''}"
						.id="${template.id ?? ''}"
						@change=${this.#onCardChange}
						@open="${this.#openTemplate}"
						?default="${template.id === this.defaultId}">
						<uui-button
							slot="actions"
							label="Remove document ${template.name}"
							@click="${() => this.#removeTemplate(template.id ?? '')}"
							compact>
							<uui-icon name="umb:trash"></uui-icon>
						</uui-button>
					</umb-template-card>
				`
			)}
			<uui-button id="add-button" look="placeholder" label="open" @click="${this.#openPicker}">Add</uui-button>
		`;
	}

	static styles = [
		UUITextStyles,
		css`
			#add-button {
				width: 100%;
			}
			:host {
				box-sizing: border-box;
				display: flex;
				gap: var(--uui-size-space-4);
				flex-wrap: wrap;
			}

			:host > * {
				max-width: 180px;
				min-width: 180px;
				min-height: 150px;
			}
		`,
	];
}

export default UmbInputTemplateElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-template': UmbInputTemplateElement;
	}
}
