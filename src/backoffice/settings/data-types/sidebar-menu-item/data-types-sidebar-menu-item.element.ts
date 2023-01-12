import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { UmbLitElement } from '@umbraco-cms/element';

@customElement('umb-data-types-sidebar-menu-item')
export class UmbDataTypesSidebarMenuItemElement extends UmbLitElement {
	@state()
	private _renderTree = false;

	private _onShowChildren() {
		this._renderTree = true;
	}

	private _onHideChildren() {
		this._renderTree = false;
	}

	// TODO: check if root has children before settings the has-children attribute
	// TODO: how do we want to cache the tree? (do we want to rerender every time the user opens the tree)?
	// TODO: can we make this reusable?
	render() {
		return html`<umb-tree-item
			label="Data Types"
			icon="umb:folder"
			entity-type="data-type"
			@show-children=${this._onShowChildren}
			@hide-children=${this._onHideChildren}
			has-children>
			${this._renderTree ? html`<umb-tree alias="Umb.Tree.DataTypes"></umb-tree>` : nothing}
		</umb-tree-item> `;
	}
}

export default UmbDataTypesSidebarMenuItemElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-data-types-sidebar-menu-item': UmbDataTypesSidebarMenuItemElement;
	}
}
