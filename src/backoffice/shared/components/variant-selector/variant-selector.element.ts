import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { UUIInputElement, UUIInputEvent } from '@umbraco-ui/uui';
import type { UmbWorkspaceEntityContextInterface } from '../workspace/workspace-context/workspace-entity-context.interface';
import { UmbLitElement } from '@umbraco-cms/element';
import type { ContentTreeItemModel } from '@umbraco-cms/backend-api';

@customElement('umb-variant-selector')
export class UmbVariantSelectorElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			#name-input {
				width: 100%;
				height: 100%; /** I really don't know why this fixes the border colliding with variant-selector-toggle, but lets this solution for now */
			}

			#variant-selector-toggle {
				white-space: nowrap;
			}
			#variant-selector-popover {
				display: block;
			}
			#variant-selector-dropdown {
				overflow: hidden;
				z-index: -1;
				background-color: var(--uui-combobox-popover-background-color, var(--uui-color-surface));
				border: 1px solid var(--uui-color-border);
				border-radius: var(--uui-border-radius);
				width: 100%;
				height: 100%;
				box-sizing: border-box;
				box-shadow: var(--uui-shadow-depth-3);
			}
		`,
	];

	// TODO: not jet used:
	@property()
	alias!: string;

	// TODO: use a more specific type here, something with variants.
	@state()
	_content?: ContentTreeItemModel;

	private _workspaceContext?: UmbWorkspaceEntityContextInterface<ContentTreeItemModel>;

	constructor() {
		super();

		// TODO: Figure out how to get the magic string for the workspace context.
		this.consumeContext<UmbWorkspaceEntityContextInterface<ContentTreeItemModel>>('umbWorkspaceContext', (instance) => {
			this._workspaceContext = instance;
			this._observeWorkspace();
		});
	}

	private async _observeWorkspace() {
		if (!this._workspaceContext) return;

		/*
		// TODO: update this with nre repository and document types.
		this.observe(this._workspaceContext.data, (data) => {
			if(data) {
				this._content = data;
			}
		});
		*/
	}

	// TODO. find a way where we don't have to do this for all workspaces.
	private _handleInput(event: UUIInputEvent) {
		if (event instanceof UUIInputEvent) {
			const target = event.composedPath()[0] as UUIInputElement;

			if (typeof target?.value === 'string') {
				// TODO: create a setName method on EntityWorkspace:
				//this._workspaceContext?.update({ name: target.value });
			}
		}
	}

	private _toggleVariantSelector() {
		this._variantSelectorIsOpen = !this._variantSelectorIsOpen;
	}

	@state()
	private _variantSelectorIsOpen = false;

	private _close() {
		this._variantSelectorIsOpen = false;
	}

	render() {
		return html`
			<uui-input id="name-input" .value=${this._content?.name} @input="${this._handleInput}">
				<!-- Implement Variant Selector -->
				${
					this._content && (this._content as any).variants?.length > 0
						? html`
								<div slot="append">
									<uui-button id="variant-selector-toggle" @click=${this._toggleVariantSelector}>
										English (United States)
										<uui-caret></uui-caret>
									</uui-button>
								</div>
						  `
						: nothing
				}
			</uui-input>

			${
				this._content && (this._content as any).variants?.length > 0
					? html`
							<uui-popover id="variant-selector-popover" .open=${this._variantSelectorIsOpen} @close=${this._close}>
								<div id="variant-selector-dropdown" slot="popover">
									<uui-scroll-container>
										<ul>
											<li>Implement variants</li>
										</ul>
									</uui-scroll-container>
								</div>
							</uui-popover>
					  `
					: nothing
			}
		</div>
		`;
	}
}

export default UmbVariantSelectorElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-variant-selector': UmbVariantSelectorElement;
	}
}
