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

	@property({ type: Boolean, reflect: true })
	public open = false;

	@state()
	private _formatter?: JSONFormatter;

	render() {
		// console.log(this.item.name, this._formatter);
		if (!this.item) return nothing;

		this.open = this._formatter?.isOpen ? true : false;

		this._formatter = new JSONFormatter(this.item, this.open ? 1 : 0, {}, this.item.name || 'name');

		return html`${this._formatter.render()}`;
	}
}
