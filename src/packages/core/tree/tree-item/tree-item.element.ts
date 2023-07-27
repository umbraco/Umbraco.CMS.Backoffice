import { css, html, nothing, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UUITextStyles } from '@umbraco-cms/backoffice/external/uui';
import { TreeItemPresentationModel } from '@umbraco-cms/backoffice/backend-api';
import { ManifestTreeItem } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

@customElement('umb-tree-item')
export class UmbTreeItemElement extends UmbLitElement {
	@property({ type: Object, attribute: false })
	item?: TreeItemPresentationModel;

	render() {
		if (!this.item) return nothing;
		return html`<umb-extension-slot
			type="treeItem"
			.filter=${(manifests: ManifestTreeItem) => manifests.conditions.entityTypes.includes(this.item!.type!)}
			.props=${{
				item: this.item,
			}}></umb-extension-slot>`;
	}

	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-item': UmbTreeItemElement;
	}
}
