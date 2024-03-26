import { css, html, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { FormControlMixin } from '@umbraco-cms/backoffice/external/uui';
import type { UUIModalSidebarSize } from '@umbraco-cms/backoffice/external/uui';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbVariantId } from '@umbraco-cms/backoffice/variant';
import { UMB_LINK_PICKER_MODAL, UmbModalRouteRegistrationController } from '@umbraco-cms/backoffice/modal';
import type { UmbModalRouteBuilder, UmbLinkPickerLink } from '@umbraco-cms/backoffice/modal';

/**
 * @element umb-input-multi-url
 * @fires change - when the value of the input changes
 * @fires blur - when the input loses focus
 * @fires focus - when the input gains focus
 */
@customElement('umb-input-multi-url')
export class UmbInputMultiUrlElement extends FormControlMixin(UmbLitElement) {
	protected getFormElement() {
		return undefined;
	}

	@property()
	public set alias(value: string | undefined) {
		this.myModalRegistration.setUniquePathValue('propertyAlias', value);
	}
	public get alias(): string | undefined {
		return this.myModalRegistration.getUniquePathValue('propertyAlias');
	}

	@property()
	public set variantId(value: string | UmbVariantId | undefined) {
		this.myModalRegistration.setUniquePathValue('variantId', value?.toString());
	}
	public get variantId(): string | undefined {
		return this.myModalRegistration.getUniquePathValue('variantId');
	}

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
	minMessage = 'This field needs more items';

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

	/**
	 @attr 'hide-anchor'
	 */
	@property({ type: Boolean, attribute: 'hide-anchor' })
	hideAnchor?: boolean;

	@property({ type: Boolean, attribute: 'ignore-user-start-nodes' })
	ignoreUserStartNodes?: boolean;

	/**
	 * @type {UUIModalSidebarSize}
	 * @attr
	 * @default "small"
	 */
	@property()
	overlaySize?: UUIModalSidebarSize;

	/**
	 * @type {Array<UmbLinkPickerLink>}
	 * @default []
	 */
	@property({ attribute: false })
	set urls(data: Array<UmbLinkPickerLink>) {
		data ??= [];
		this._urls = [...data]; // Unfreeze data coming from State, so we can manipulate it.
		super.value = this._urls.map((x) => x.url).join(',');
	}
	get urls(): Array<UmbLinkPickerLink> {
		return this._urls;
	}

	private _urls: Array<UmbLinkPickerLink> = [];

	@state()
	private _modalRoute?: UmbModalRouteBuilder;

	private myModalRegistration;

	constructor() {
		super();

		this.addValidator(
			'rangeUnderflow',
			() => this.minMessage,
			() => !!this.min && this.urls.length < this.min,
		);
		this.addValidator(
			'rangeOverflow',
			() => this.maxMessage,
			() => !!this.max && this.urls.length > this.max,
		);

		this.myModalRegistration = new UmbModalRouteRegistrationController(this, UMB_LINK_PICKER_MODAL)
			.addAdditionalPath(`:index`)
			.addUniquePaths(['propertyAlias', 'variantId'])
			.onSetup((params) => {
				// Get index:
				const indexParam = params.index;
				if (!indexParam) return false;
				let index: number | null = parseInt(params.index);
				if (Number.isNaN(index)) return false;

				// Use the index to find data:
				let data: UmbLinkPickerLink | null = null;
				if (index >= 0 && index < this.urls.length) {
					data = this._getItemByIndex(index);
				} else {
					// If not then make a new pick:
					index = null;
				}

				return {
					data: {
						index: index,
						config: {
							hideAnchor: this.hideAnchor,
							ignoreUserStartNodes: this.ignoreUserStartNodes,
							overlaySize: this.overlaySize || 'small',
						},
					},
					value: {
						link: {
							name: data?.name,
							published: data?.published,
							queryString: data?.queryString,
							target: data?.target,
							trashed: data?.trashed,
							type: data?.type,
							unique: data?.unique,
							url: data?.url,
						},
					},
				};
			})
			.onSubmit((value) => {
				if (!value) return;
				this._setSelection(value.link, this.myModalRegistration.modalContext?.data.index ?? null);
			})
			.observeRouteBuilder((routeBuilder) => {
				this._modalRoute = routeBuilder;
			});
	}

	private _removeItem(index: number) {
		this.urls.splice(index, 1);
		this._dispatchChangeEvent();
	}

	private _getItemByIndex(index: number) {
		return this.urls[index];
	}

	private _setSelection(selection: UmbLinkPickerLink, index: number | null) {
		if (index !== null && index >= 0) {
			this.urls[index] = selection;
		} else {
			this.urls.push(selection);
		}

		this._dispatchChangeEvent();
	}

	private _dispatchChangeEvent() {
		this.requestUpdate();
		this.dispatchEvent(new CustomEvent('change', { composed: true, bubbles: true }));
	}

	// TODO: We should get a href property on uui-ref-node, and not use this method:
	private _temporary_onClick_editItem(index: number) {
		this.myModalRegistration.open({ index });
	}

	render() {
		return html`${this.urls?.map((link, index) => this._renderItem(link, index))}
			<uui-button look="placeholder" label="Add" .href=${this._modalRoute?.({ index: -1 })}>Add</uui-button>`;
	}

	private _renderItem(link: UmbLinkPickerLink, index: number) {
		return html`<uui-ref-node
			.name="${link.name || ''}"
			.detail="${(link.url || '') + (link.queryString || '')}"
			@open="${() => this._temporary_onClick_editItem(index)}">
			<umb-icon slot="icon" name="${link.icon || 'icon-link'}"></umb-icon>
			<uui-action-bar slot="actions">
				<uui-button .href=${this._modalRoute?.({ index })} label="Edit link">Edit</uui-button>
				<uui-button @click="${() => this._removeItem(index)}" label="Remove link">Remove</uui-button>
			</uui-action-bar>
		</uui-ref-node>`;
	}

	static styles = [
		css`
			uui-button {
				width: 100%;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-multi-url': UmbInputMultiUrlElement;
	}
}
