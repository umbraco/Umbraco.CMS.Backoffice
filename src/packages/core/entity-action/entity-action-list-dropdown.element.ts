import { UmbEntityActionListElement } from './entity-action-list.element.js';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import { html, customElement, css, state } from '@umbraco-cms/backoffice/external/lit';
import { Subscription } from '@umbraco-cms/backoffice/external/rxjs';

@customElement('umb-entity-action-list-dropdown')
export class UmbEntityActionListDropdownElement extends UmbEntityActionListElement {
	#extensionSubscription?: Subscription;

	@state()
	actionCount = 0;

	connectedCallback(): void {
		super.connectedCallback();
		this.#extensionSubscription = umbExtensionsRegistry.extensionsOfType('entityAction').subscribe((extensions) => {
			this.actionCount = extensions.filter((ext) => this._filter?.(ext) ?? false).length;
			console.log('123asd', this.actionCount);
		});
	}

	disconnectedCallback(): void {
		super.disconnectedCallback();
		this.#extensionSubscription?.unsubscribe();
	}

	render() {
		return this._filter
			? html`
					<div>
						Lol plasd lasdkj k
						<umb-extension-slot
							type="entityAction"
							default-element="umb-entity-action"
							.filter=${this._filter}
							.props=${{ unique: this.unique }}></umb-extension-slot>
					</div>
			  `
			: '';
	}

	static styles = [
		css`
			:host {
				--uui-menu-item-flat-structure: 1;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-entity-action-list-dropdown': UmbEntityActionListDropdownElement;
	}
}
