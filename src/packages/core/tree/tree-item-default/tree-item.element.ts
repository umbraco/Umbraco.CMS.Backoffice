import { css, html, nothing, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { TreeItemPresentationModel } from '@umbraco-cms/backoffice/backend-api';
import { ManifestTreeItem } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

@customElement('umb-tree-item-default')
export class UmbTreeItemDefaultElement extends UmbLitElement {
	@property({ type: Object, attribute: false })
	item?: TreeItemPresentationModel;

	render() {
		if (!this.item) return nothing;
		return html`<umb-extension-slot
			type="treeItem"
			.filter=${(manifests: ManifestTreeItem) => manifests.meta.entityTypes.includes(this.item!.type!)}
			.props=${{
				item: this.item,
			}}></umb-extension-slot>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-item-default': UmbTreeItemDefaultElement;
	}
}
