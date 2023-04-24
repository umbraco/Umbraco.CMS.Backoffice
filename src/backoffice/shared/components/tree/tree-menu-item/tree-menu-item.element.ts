import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extensions-api';
import { ManifestKind, ManifestMenuItemTreeKind } from '@umbraco-cms/backoffice/extensions-registry';

// TODO: Move to separate file:
const manifest: ManifestKind = {
	type: 'kind',
	alias: 'Umb.Kind.Tree',
	matchKind: 'tree',
	matchType: 'menuItem',
	manifest: {
		type: 'menuItem',
		elementName: 'umb-menu-item-tree',
	},
};
umbExtensionsRegistry.register(manifest);

@customElement('umb-menu-item-tree')
export class UmbMenuItemTreeElement extends UmbLitElement {
	@property({ type: Object })
	manifest?: ManifestMenuItemTreeKind;

	// TODO: check if root has children before settings the has-children attribute
	// TODO: how do we want to cache the tree? (do we want to rerender every time the user opens the tree)?
	render() {
		return this.manifest ? html` <umb-tree alias=${this.manifest?.meta.treeAlias}></umb-tree> ` : nothing;
	}
}

export default UmbMenuItemTreeElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-menu-item-tree': UmbMenuItemTreeElement;
	}
}
