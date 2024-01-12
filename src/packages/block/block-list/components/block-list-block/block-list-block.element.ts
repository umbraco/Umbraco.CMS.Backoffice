import { html, css, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { type UmbBlockLayoutBaseModel } from '@umbraco-cms/backoffice/block';
import '../ref-list-block/index.js';
import { UmbBlockContext } from '@umbraco-cms/backoffice/block';
import { UMB_CONFIRM_MODAL, UMB_MODAL_MANAGER_CONTEXT_TOKEN } from '@umbraco-cms/backoffice/modal';

/**
 * @element umb-property-editor-ui-block-list-block
 */
@customElement('umb-property-editor-ui-block-list-block')
export class UmbPropertyEditorUIBlockListBlockElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	//
	@property({ attribute: false })
	public get layout(): UmbBlockLayoutBaseModel | undefined {
		return this._layout;
	}
	public set layout(value: UmbBlockLayoutBaseModel | undefined) {
		this._layout = value;
		this.#context.setLayout(value);
	}
	private _layout?: UmbBlockLayoutBaseModel | undefined;

	#context = new UmbBlockContext(this);

	@state()
	_label = '';

	constructor() {
		super();

		this.observe(this.#context.label, (label) => {
			this._label = label;
		});
		this.observe(this.#context.layout, (layout) => {
			console.log('layout', layout);
		});
	}

	#requestDelete() {
		this.consumeContext(UMB_MODAL_MANAGER_CONTEXT_TOKEN, async (modalManager) => {
			const modalContext = modalManager.open(UMB_CONFIRM_MODAL, {
				data: {
					headline: `Delete ${this._label}`,
					content: 'Are you sure you want to delete this block?',
					confirmLabel: 'Delete',
					color: 'danger',
				},
			});
			await modalContext.onSubmit();
			this.#context.delete();
		});
	}

	#renderRefBlock() {
		return html`<umb-ref-list-block .name=${this._label}> </umb-ref-list-block>`;
	}

	/*#renderInlineBlock() {
		return html`<umb-inline-list-block name="block" }}></umb-inline-list-block>`;
	}*/

	#renderBlock() {
		return html`
			${this.#renderRefBlock()}
			<uui-action-bar>
				<uui-button label="delete" compact @click=${this.#requestDelete}>
					<uui-icon name="icon-remove"></uui-icon>
				</uui-button>
			</uui-action-bar>
		`;
	}

	render() {
		return this.layout ? this.#renderBlock() : '';
	}

	static styles = [
		css`
			:host {
				position: relative;
				display: block;
			}
			uui-action-bar {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: var(--uui-size-2);
			}
		`,
	];
}

export default UmbPropertyEditorUIBlockListBlockElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-block-list-block': UmbPropertyEditorUIBlockListBlockElement;
	}
}
