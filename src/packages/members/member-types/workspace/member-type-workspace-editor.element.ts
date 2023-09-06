import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { css, html, customElement } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

@customElement('umb-member-type-workspace-editor')
export class UmbMemberTypeWorkspaceEditorElement extends UmbLitElement {
	render() {
		return html`
			<umb-workspace-editor alias="Umb.Workspace.MemberType"> Member Type Workspace </umb-workspace-editor>
		`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
			}

			#header {
				/* TODO: can this be applied from layout slot CSS? */
				margin: 0 var(--uui-size-layout-1);
				flex: 1 1 auto;
			}
		`,
	];
}

export default UmbMemberTypeWorkspaceEditorElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-member-type-workspace-editor': UmbMemberTypeWorkspaceEditorElement;
	}
}
