import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { CSSResultGroup } from '@umbraco-cms/backoffice/external/lit';
import { css, html, LitElement, customElement, ifDefined } from '@umbraco-cms/backoffice/external/lit';
import type {
	ManifestHeaderAppButtonKind,
	UmbBackofficeManifestKind,
} from '@umbraco-cms/backoffice/extension-registry';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';

const manifest: UmbBackofficeManifestKind = {
	type: 'kind',
	alias: 'Umb.Kind.Button',
	matchKind: 'button',
	matchType: 'headerApp',
	manifest: {
		type: 'headerApp',
		kind: 'button',
		elementName: 'umb-header-app-button',
	},
};
umbExtensionsRegistry.register(manifest);

@customElement('umb-header-app-button')
export class UmbHeaderAppButtonElement extends LitElement {
	public manifest?: ManifestHeaderAppButtonKind;

	render() {
		return html`
			<uui-button
				look="primary"
				label="${ifDefined(this.manifest?.meta.label)}"
				href="${ifDefined(this.manifest?.meta.href)}"
				compact>
				<umb-icon name="${ifDefined(this.manifest?.meta.icon)}"></umb-icon>
			</uui-button>
		`;
	}

	static styles: CSSResultGroup = [
		UmbTextStyles,
		css`
			uui-button {
				font-size: 18px;
				--uui-button-background-color: transparent;
			}
		`,
	];
}

export default UmbHeaderAppButtonElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-header-app-button': UmbHeaderAppButtonElement;
	}
}
