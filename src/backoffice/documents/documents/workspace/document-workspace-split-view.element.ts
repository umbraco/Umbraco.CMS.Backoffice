import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ActiveVariant, UmbDocumentWorkspaceContext } from './document-workspace.context';
import { UmbLitElement } from '@umbraco-cms/element';
import '../../../shared/components/workspace/workspace-variant/workspace-variant.element';

@customElement('umb-document-workspace-split-view')
export class UmbDocumentWorkspaceSplitViewElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: flex;
				width: 100%;
				height: 100%;
			}
		`,
	];

	@property()
	public get index(): number {
		return this._index;
	}
	public set index(value: number) {
		this._index = value;
		this._observeActiveVariantInfo();
	}
	private _index = 0;

	private _workspaceContext?: UmbDocumentWorkspaceContext;

	@state()
	_variant?: ActiveVariant;

	constructor() {
		super();

		this.consumeContext<UmbDocumentWorkspaceContext>('umbWorkspaceContext', (context) => {
			this._workspaceContext = context;
			this._observeActiveVariantInfo();
		});
	}

	private _observeActiveVariantInfo() {
		if (!this._workspaceContext) return;
		if (this._index) {
			this.observe(
				this._workspaceContext.activeVariantsInfoByIndex(this._index),
				(variant) => {
					this._variant = variant;
				},
				'_observeActiveVariantsInfo'
			);
		} else {
			//this.removeControllerByAlias('_observeActiveVariantsInfo');
		}
	}

	render() {
		return html`
			<umb-workspace-variant alias="Umb.Workspace.Document" .splitViewIndex=${this._index}>
				<!--<umb-workspace-action-menu
					slot="action-menu"
					entity-type="document"
					unique="${this.unique}"></umb-workspace-action-menu>-->
			</umb-workspace-variant>
		`;
	}
}

export default UmbDocumentWorkspaceSplitViewElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-document-workspace-split-view': UmbDocumentWorkspaceSplitViewElement;
	}
}
