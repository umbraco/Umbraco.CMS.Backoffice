import { html, customElement } from '@umbraco-cms/backoffice/external/lit';
import { UmbHeaderAppButtonElement } from '@umbraco-cms/backoffice/components';

@customElement('umb-active-users-header-app')
export class UmbActiveUsersHeaderAppElement extends UmbHeaderAppButtonElement {
	override render() {
		return html`
			<uui-avatar-group style="font-size: 0.75em; --uui-avatar-border-color: white;">
				<uui-avatar name="Mads Rasmussen"></uui-avatar>
				<uui-avatar name="Niels Lyngsø"></uui-avatar>
				<uui-avatar name="Jacob Overgaard"></uui-avatar>
				<uui-avatar name="Jesper Møller Jensen"></uui-avatar>
			</uui-avatar-group>
		`;
	}
}

export { UmbActiveUsersHeaderAppElement as element };

declare global {
	interface HTMLElementTagNameMap {
		'umb-active-users-header-app': UmbActiveUsersHeaderAppElement;
	}
}
