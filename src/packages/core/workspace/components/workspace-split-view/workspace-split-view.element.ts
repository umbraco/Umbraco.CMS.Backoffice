import { UmbWorkspaceSplitViewContext } from './workspace-split-view.context.js';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import '../variant-selector/index.js';
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

	@property({ type: Number })
	public set splitViewIndex(index: number) {
		this.splitViewContext.setSplitViewIndex(index);
	}
	public get splitViewIndex(): number {
		return this.splitViewContext.getSplitViewIndex()!;
	}

	splitViewContext = new UmbWorkspaceSplitViewContext(this);

	render() {
		return html`
			<umb-workspace-editor alias=${this.alias} .hideNavigation=${!this.displayNavigation} .enforceNoFooter=${true}>
				<div id="header" slot="header">
					<umb-variant-selector></umb-variant-selector>
				</div>
				${this.displayNavigation
					? html`<umb-workspace-entity-action-menu slot="action-menu"></umb-workspace-entity-action-menu>`
					: ''}
				<slot name="action-menu" slot="action-menu"></slot>
			</umb-workspace-editor>
		`;
	}

	static styles = [
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
