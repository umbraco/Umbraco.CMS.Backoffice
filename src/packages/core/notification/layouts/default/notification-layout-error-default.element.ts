import { css, customElement, html, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

export interface UmbErrorModel {
	property: string;
	descriptions: Array<string>;
}

@customElement('umb-notification-layout-error')
export class UmbNotificationLayoutErrorElement extends UmbLitElement {
	@property({ type: Array })
	model?: Array<UmbErrorModel> = [];

	/** Render */
	override render() {
		return html`Test${this.model?.map((error) => {
			if (error.descriptions.length > 1) {
				return html`<div>${error.property}</div>
					<ul>
						${error.descriptions.map((description) => {
							return html`<li>${description}</li>`;
						})}
					</ul>`;
			} else {
				return html`<ul>
					<li>${error.descriptions[0]}</li>
				</ul>`;
			}
		})}`;
	}

	static override styles = [css``];
}

export default UmbNotificationLayoutErrorElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-notification-layout-error': UmbNotificationLayoutErrorElement;
	}
}
