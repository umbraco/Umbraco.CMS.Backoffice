import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { UmbLitElement } from '@umbraco-cms/element';
import { ManifestWorkspace } from '@umbraco-cms/extensions-registry';

@customElement('umb-workspace')
export class UmbWorkspaceElement extends UmbLitElement {
	static styles = [UUITextStyles, css``];

	@property({ type: String, attribute: 'entity-type' })
	entityType = '';

	render() {
		if (!this.entityType) nothing;
		return html`<umb-extension-slot
			type="workspace"
			.filter=${(manifest: ManifestWorkspace) => manifest.meta.entityType === this.entityType}></umb-extension-slot>`;
	}
}

export default UmbWorkspaceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-workspace': UmbWorkspaceElement;
	}
}
