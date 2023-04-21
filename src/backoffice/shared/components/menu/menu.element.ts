import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ManifestMenu, ManifestMenuItem } from '@umbraco-cms/backoffice/extensions-registry';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

import './menu-item/menu-item.element';

@customElement('umb-menu')
export class UmbMenuElement extends UmbLitElement {
	

	@property()
	manifest?: ManifestMenu;

	render() {
		return html` <umb-extension-slot
			type="menuItem"
			.filter=${(items: ManifestMenuItem) => items.conditions.menus.includes(this.manifest!.alias)}
			default-element="umb-menu-item"></umb-extension-slot>`;
	}
	
	static styles = [UUITextStyles];
}

export default UmbMenuElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-menu': UmbMenuElement;
	}
}
