import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('umb-packages-created-item')
export class UmbPackagesCreatedItem extends LitElement {
	static styles = css`
		:host {
			display: block;
		}
	`;
	@property({ type: Object })
	package!: any;

	render() {
		return html`
			<uui-ref-node-package name=${this.package.name} version=${this.package.version} @open=${this._onClick}>
				<uui-action-bar slot="actions">
					<uui-button label="Delete package"><uui-icon name="delete"></uui-icon></uui-button>
				</uui-action-bar>
			</uui-ref-node-package>
		`;
	}

	private _onClick() {
		window.history.pushState({}, '', `/section/packages/view/created/package-builder/${this.package.key}`);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-packages-created-item': UmbPackagesCreatedItem;
	}
}
