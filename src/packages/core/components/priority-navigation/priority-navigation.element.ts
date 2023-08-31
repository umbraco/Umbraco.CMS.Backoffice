import { UUITextStyles } from '@umbraco-cms/backoffice/external/uui';
import {
	css,
	html,
	LitElement,
	ifDefined,
	when,
	customElement,
	property,
	state,
	repeat,
} from '@umbraco-cms/backoffice/external/lit';

@customElement('umb-priority-navigation')
export class UmbPriorityNavigationElement extends LitElement {
	@property()
	orientation = 'horizontal';

	@property()
	openMode: 'click' | 'hover' = 'click';

	render() {
		return html`Priority Navigation`;
	}

	static styles = [UUITextStyles, css``];
}

export default UmbPriorityNavigationElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-priority': UmbPriorityNavigationElement;
	}
}
