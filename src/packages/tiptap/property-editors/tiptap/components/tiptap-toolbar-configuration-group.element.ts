import { UMB_TIPTAP_TOOLBAR_CONFIGURATION_CONTEXT } from '../contexts/tiptap-toolbar-configuration.context.js';
import type { UmbTiptapToolbarGroupViewModel } from '../types.js';
import { css, customElement, html, nothing, property, when } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

const elementName = 'umb-tiptap-toolbar-configuration-group';

@customElement(elementName)
export class UmbTiptapToolbarConfigurationGroupElementElement extends UmbLitElement {
	#context?: typeof UMB_TIPTAP_TOOLBAR_CONFIGURATION_CONTEXT.TYPE;

	@property({ type: Boolean })
	hideActionBar = false;

	@property({ type: Number })
	index: number = 0;

	@property({ type: Number })
	rowIndex: number = 0;

	@property({ type: Object })
	group?: UmbTiptapToolbarGroupViewModel;

	constructor() {
		super();

		this.consumeContext(UMB_TIPTAP_TOOLBAR_CONFIGURATION_CONTEXT, (context) => {
			this.#context = context;

			this.observe(this.#context.reload, (reload) => {
				if (reload) {
					this.requestUpdate();
				}
			});
		});
	}

	override render() {
		if (!this.group) return nothing;
		return html`
			<div
				class="group"
				@dragover=${(e: DragEvent) => this.#context?.onDragOver(e)}
				@drop=${(e: DragEvent) => this.#context?.onDrop(e, [this.rowIndex, this.index, this.group!.data.length])}>
				${when(!this.hideActionBar, () => html`<uui-icon class="handle" name="icon-navigation"></uui-icon>`)}
				<div class="items">
					${when(
						this.group.data.length === 0,
						() => html`<em>Add items</em>`,
						() => html`${this.group!.data.map((alias, idx) => this.#renderItem(alias, idx))}`,
					)}
				</div>
				${when(
					!this.hideActionBar,
					() => html`
						<uui-action-bar>
							<uui-button
								color="danger"
								look="secondary"
								label=${this.localize.term('tiptap_toolbar_removeGroup')}
								@click=${() => this.#context?.removeToolbarGroup(this.rowIndex, this.index)}>
								<uui-icon name="icon-trash"></uui-icon>
							</uui-button>
						</uui-action-bar>
					`,
				)}
			</div>
			<uui-button-inline-create
				vertical
				label=${this.localize.term('tiptap_toolbar_addGroup')}
				@click=${() => this.#context?.insertToolbarGroup(this.rowIndex, this.index + 1)}></uui-button-inline-create>
		`;
	}

	#renderItem(alias: string, itemIndex = 0) {
		const item = this.#context?.getExtensionByAlias(alias);
		if (!item) return nothing;
		const forbidden = !this.#context?.isExtensionEnabled(item.alias);
		return html`
			<uui-button
				compact
				class=${forbidden ? 'forbidden' : ''}
				draggable="true"
				look=${forbidden ? 'placeholder' : 'outline'}
				title=${this.localize.string(item.label)}
				?disabled=${forbidden}
				@click=${() => this.#context?.removeToolbarItem([this.rowIndex, this.index, itemIndex])}
				@dragend=${(e: DragEvent) => this.#context?.onDragEnd(e)}
				@dragstart=${(e: DragEvent) => this.#context?.onDragStart(e, alias, [this.rowIndex, this.index, itemIndex])}>
				<div class="inner">
					${when(
						item.icon,
						() => html`<umb-icon .name=${item.icon}></umb-icon>`,
						() => html`<span>${this.localize.string(item.label)}</span>`,
					)}
				</div>
			</uui-button>
		`;
	}

	static override styles = [
		css`
			:host {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				align-items: center;
				justify-content: flex-start;
				gap: var(--uui-size-1);
			}

			.group {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				gap: var(--uui-size-3);

				border: 1px dashed var(--uui-color-border-standalone);
				border-radius: var(--uui-border-radius);
				padding: var(--uui-size-3);

				.handle {
					cursor: move;
				}

				&:hover {
					border-color: rebeccapurple;
				}

				.items {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					gap: var(--uui-size-1);

					uui-button {
						--uui-button-font-weight: normal;

						&[draggable='true'],
						&[draggable='true'] > .inner {
							cursor: move;
						}

						&[disabled],
						&[disabled] > .inner {
							cursor: not-allowed;
						}

						&.forbidden {
							--color: var(--uui-color-danger);
							--color-standalone: var(--uui-color-danger-standalone);
							--color-emphasis: var(--uui-color-danger-emphasis);
							--color-contrast: var(--uui-color-danger);
							--uui-button-contrast-disabled: var(--uui-color-danger);
							--uui-button-border-color-disabled: var(--uui-color-danger);
							opacity: 0.5;
						}

						div {
							display: flex;
							gap: var(--uui-size-1);
						}
					}
				}
			}

			uui-button-inline-create {
				height: 40px;
			}
		`,
	];
}

export { UmbTiptapToolbarConfigurationGroupElementElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbTiptapToolbarConfigurationGroupElementElement;
	}
}
