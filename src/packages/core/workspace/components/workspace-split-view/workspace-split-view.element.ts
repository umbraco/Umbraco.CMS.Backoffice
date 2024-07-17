import { UmbWorkspaceSplitViewContext } from './workspace-split-view.context.js';
import { css, html, customElement, property, ifDefined } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

// import local components
import './workspace-split-view-variant-selector.element.js';

/**
 *
 * Example. Document Workspace would use a Variant-component(variant component would talk directly to the workspace-context)
 * As well breadcrumbs etc.
 *
 */
@customElement('umb-workspace-split-view')
export class UmbWorkspaceSplitViewElement extends UmbLitElement {
	@property()
	alias!: string;

	@property({ type: Boolean })
	displayNavigation = false;

	@property({ attribute: 'back-path' })
	public backPath?: string;

	@property({ type: Number })
	public set splitViewIndex(index: number) {
		this.splitViewContext.setSplitViewIndex(index);
	}
	public get splitViewIndex(): number {
		return this.splitViewContext.getSplitViewIndex()!;
	}

	splitViewContext = new UmbWorkspaceSplitViewContext(this);

	override render() {
		return html`
			<umb-workspace-editor
				alias=${this.alias}
				back-path=${ifDefined(this.backPath)}
				.hideNavigation=${!this.displayNavigation}
				.enforceNoFooter=${true}>
				<div id="header" slot="header">
					<umb-workspace-split-view-variant-selector></umb-workspace-split-view-variant-selector>
				</div>
				${this.displayNavigation
					? html`<umb-workspace-entity-action-menu slot="action-menu"></umb-workspace-entity-action-menu>`
					: ''}
				<slot name="action-menu" slot="action-menu"></slot>
			</umb-workspace-editor>
		`;
	}

	static override styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
				min-width: 0;
			}

			:host(:not(:last-child)) {
				border-right: 1px solid var(--uui-color-border);
			}

			#header {
				flex: 1 1 auto;
			}
		`,
	];
}

export default UmbWorkspaceSplitViewElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-workspace-split-view': UmbWorkspaceSplitViewElement;
	}
}
