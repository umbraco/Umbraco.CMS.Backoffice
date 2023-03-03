import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
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

	private _workspaceContext?: UmbDocumentWorkspaceContext;

	@state()
	_variants?: Array<ActiveVariant>;

	constructor() {
		super();

		this.consumeContext<UmbDocumentWorkspaceContext>('umbWorkspaceContext', (context) => {
			this._workspaceContext = context;
			this._observeActiveVariantInfo();
		});
	}

	private _observeActiveVariantInfo() {
		if (!this._workspaceContext) return;
		this.observe(
			this._workspaceContext.activeVariantsInfo,
			(variants) => {
				this._variants = variants;
			},
			'_observeActiveVariantsInfo'
		);
	}

	render() {
		return this._variants
			? repeat(
					this._variants,
					(view) => view.index,
					(view) => html`
						<umb-workspace-variant alias="Umb.Workspace.Document">
							<!--<umb-workspace-action-menu
								slot="action-menu"
								entity-type="document"
								unique="${this._unique!}"></umb-workspace-action-menu>-->
						</umb-workspace-variant>
					`
			  )
			: nothing;
	}
}

export default UmbDocumentWorkspaceSplitViewElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-document-workspace-split-view': UmbDocumentWorkspaceSplitViewElement;
	}
}
