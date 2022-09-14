import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import JSONFormatter from 'json-formatter-js';
import { styles } from './context-debugger-style';

@customElement('umb-context-debugger-json')
export class UmbContextDebuggerJsonElement extends LitElement {
	static styles = [
		UUITextStyles,
		styles,
		css`
			:host {
				display: flex;
				flex-direction: column;
			}

			:host > .json-formatter-row .json-formatter-toggler-link .json-formatter-key {
				font-weight: bold;
			}
			:host > .json-formatter-row {
				white-space: nowrap;
			}
		`,
	];

	@property()
	public item: any;

	render() {
		if (!this.item) return nothing;

		const formatter = new JSONFormatter(
			this.item,
			0,
			{
				// hoverPreviewEnabled: true,
				// hoverPreviewArrayCount: 1,
				// hoverPreviewFieldCount: 1,
			},
			this.item.name || 'name'
		);

		return html`${formatter.render()}`;
	}
}
