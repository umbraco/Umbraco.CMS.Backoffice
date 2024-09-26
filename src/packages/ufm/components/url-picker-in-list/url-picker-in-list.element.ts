import { UmbUfmElementBase } from '../ufm-element-base.js';
import { customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UMB_BLOCK_ENTRY_CONTEXT } from '@umbraco-cms/backoffice/block';

const elementName = 'ufm-url-picker-in-list';
@customElement(elementName)
export class UmbUfmUrlPickerInListElement extends UmbUfmElementBase {
	@property()
	alias?: string;

	constructor() {
		super();
		this.consumeContext(UMB_BLOCK_ENTRY_CONTEXT, (context) => {
			this.observe(
				context.content,
				(value) => {
					this.value = this.getValueFromExpression(value, this.alias!);
				},
				'observeValue',
			);
		});
	}
}
export { UmbUfmUrlPickerInListElement as element };
declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbUfmUrlPickerInListElement;
	}
}
