import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { customElement, css, html, property, ifDefined } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

@customElement('umb-block-workspace-editor')
export class UmbBlockWorkspaceEditorElement extends UmbLitElement {

  @property({ type: String, attribute: false })
  workspaceAlias?: string;

  @property({ type: String, attribute: false })
  label?: string;

  render() {
    return this.workspaceAlias
      ? html` <umb-workspace-editor alias=${this.workspaceAlias} headline=${ifDefined(this.label)}> </umb-workspace-editor> `
      : '';
  }

  static styles = [
    UmbTextStyles,
    css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
			}
		`,
  ];
}

export default UmbBlockWorkspaceEditorElement;

declare global {
  interface HTMLElementTagNameMap {
    'umb-block-workspace-editor': UmbBlockWorkspaceEditorElement;
  }
}
