import { UmbPropertyActionMenuContext } from './property-action-menu.context.js';
import { css, CSSResultGroup, html, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { map } from '@umbraco-cms/backoffice/external/rxjs';
import { UUITextStyles } from '@umbraco-cms/backoffice/external/uui';
import { ManifestPropertyAction, umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UmbObserverController } from '@umbraco-cms/backoffice/observable-api';

import '../property-action/property-action.element.js';

@customElement('umb-property-action-menu')
export class UmbPropertyActionMenuElement extends UmbLitElement {
	@property({ attribute: false })
	public value?: unknown;

	@property()
	set propertyEditorUiAlias(alias: string) {
		this._observeActions(alias);
	}

	private _actionsObserver?: UmbObserverController<ManifestPropertyAction[]>;

	@state()
	private _actions: Array<ManifestPropertyAction> = [];

	@state()
	private _open = false;

	private _propertyActionMenuContext = new UmbPropertyActionMenuContext(this);

	constructor() {
		super();

		this.observe(this._propertyActionMenuContext.isOpen, (value) => {
			this._open = value;
		});

		this.addEventListener('close', (e) => {
			this._propertyActionMenuContext.close();
			e.stopPropagation();
		});
	}

	private _observeActions(alias: string) {
		this._actionsObserver?.destroy();
		// TODO: Align property actions with entity actions.
		this._actionsObserver = this.observe(
			umbExtensionsRegistry.extensionsOfType('propertyAction').pipe(
				map((propertyActions) => {
					return propertyActions.filter((propertyAction) => propertyAction.meta.propertyEditors.includes(alias));
				})
			),
			(manifests) => {
				this._actions = manifests;
			}
		);
	}

	private _toggleMenu() {
		this._propertyActionMenuContext.toggle();
	}

	private _handleClose(event: CustomEvent) {
		this._propertyActionMenuContext.close();
		event.stopPropagation();
	}

	// TODO: Implement extension-slot on change event. And use the extension slot instead of custom implementation.
	render() {
		return this._actions.length > 0
			? html`
					<uui-popover id="popover" placement="bottom-start" .open=${this._open} @close="${this._handleClose}">
						<uui-button
							id="popover-trigger"
							slot="trigger"
							look="secondary"
							label="More"
							@click="${this._toggleMenu}"
							compact>
							<uui-symbol-more id="more-symbol"></uui-symbol-more>
						</uui-button>

						<div slot="popover" id="dropdown">
							${this._actions.map(
								(action) => html`
									<umb-property-action .propertyAction=${action} .value="${this.value}"></umb-property-action>
								`
							)}
						</div>
					</uui-popover>
			  `
			: '';
	}

	static styles: CSSResultGroup = [
		UUITextStyles,
		css`
			#popover {
				width: auto;
			}

			#more-symbol {
				font-size: 0.6em;
			}

			#popover-trigger {
				--uui-button-padding-top-factor: 0.5;
				--uui-button-padding-bottom-factor: 0.1;
				--uui-button-height: 18px;
				--uui-button-border-radius: 6px;
			}

			#dropdown {
				background-color: var(--uui-color-surface);
				border-radius: var(--uui-border-radius);
				width: 100%;
				height: 100%;
				box-sizing: border-box;
				box-shadow: var(--uui-shadow-depth-3);
				min-width: 200px;
				color: var(--uui-color-text);
			}
		`,
	];
}
