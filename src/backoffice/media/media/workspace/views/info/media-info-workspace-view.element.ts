import { css, html } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement } from 'lit/decorators.js';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

@customElement('umb-media-info-workspace-view')
export class UmbMediaInfoWorkspaceViewElement extends UmbLitElement {
	

	render() {
		return html`<div>Media info</div>`;
	}
	
	static styles = [UUITextStyles, css``];
}

export default UmbMediaInfoWorkspaceViewElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-media-info-workspace-view': UmbMediaInfoWorkspaceViewElement;
	}
}
