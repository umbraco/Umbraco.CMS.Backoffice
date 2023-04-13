import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { UmbTableItem } from '../../../../shared/components/table';

@customElement('umb-user-group-table-name-column-layout')
export class UmbUserGroupTableNameColumnLayoutElement extends LitElement {
	@property({ type: Object, attribute: false })
	item!: UmbTableItem;

	@property({ attribute: false })
	value!: any;

	render() {
		return html` <a style="font-weight: bold;" href="section/users/view/users/user-group/${this.item.id}">
			${this.value.name}
		</a>`;
	}
}

export default UmbUserGroupTableNameColumnLayoutElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-user-group-table-name-column-layout': UmbUserGroupTableNameColumnLayoutElement;
	}
}
