import { html, ifDefined, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { ManifestMenuItem, UmbMenuItemElement } from '@umbraco-cms/backoffice/extension-registry';

@customElement('umb-menu-item-default')
export class UmbMenuItemDefaultElement extends UmbLitElement implements UmbMenuItemElement {
	@property({ type: Object, attribute: false })
	manifest!: ManifestMenuItem;

	render() {
		return html`<umb-menu-item-layout
			label=${this.manifest.meta.label || this.manifest.name}
			icon-name=${this.manifest.meta.icon}
			entity-type=${ifDefined(this.manifest.meta.entityType)}></umb-menu-item-layout>`;
	}

	static styles = [UmbTextStyles];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-menu-item-default': UmbMenuItemDefaultElement;
	}
}
