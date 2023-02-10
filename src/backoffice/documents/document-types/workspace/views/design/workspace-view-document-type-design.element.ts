import { css, html } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, state } from 'lit/decorators.js';
import { distinctUntilChanged } from 'rxjs';
import { UmbWorkspaceDocumentTypeContext } from '../../document-type-workspace.context';
import { UmbLitElement } from '@umbraco-cms/element';
import type { DocumentType } from '@umbraco-cms/backend-api';

@customElement('umb-workspace-view-document-type-design')
export class UmbWorkspaceViewDocumentTypeDesignElement extends UmbLitElement {
	static styles = [UUITextStyles, css``];

	@state()
	_documentType?: DocumentType | null;

	private _workspaceContext?: UmbWorkspaceDocumentTypeContext;

	constructor() {
		super();

		// TODO: Figure out if this is the best way to consume the context or if it can be strongly typed with an UmbContextToken
		this.consumeContext<UmbWorkspaceDocumentTypeContext>('umbWorkspaceContext', (documentTypeContext) => {
			this._workspaceContext = documentTypeContext;
			this._observeDocumentType();
		});
	}

	private _observeDocumentType() {
		if (!this._workspaceContext) return;

		this.observe(this._workspaceContext.data, (documentType) => {
			this._documentType = documentType;
		});
	}

	render() {
		return html`<div>Design of ${this._documentType?.name}</div>`;
	}
}

export default UmbWorkspaceViewDocumentTypeDesignElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-workspace-view-document-type-design': UmbWorkspaceViewDocumentTypeDesignElement;
	}
}
