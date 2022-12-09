import { css, html, LitElement } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, state } from 'lit/decorators.js';
import { distinctUntilChanged } from 'rxjs';
import { UmbNodeContext } from '../../node.context';
import type { NodeEntity } from '../../../../../../core/mocks/data/node.data';
import { UmbObserverMixin } from '@umbraco-cms/observable-api';
import { UmbContextConsumerMixin } from '@umbraco-cms/context-api';

@customElement('umb-editor-view-node-info')
export class UmbEditorViewNodeInfoElement extends UmbContextConsumerMixin(UmbObserverMixin(LitElement)) {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display:block;
				margin: var(--uui-size-layout-1);
			}
		`
	];
	
	private _nodeContext?: UmbNodeContext;

	@state()
	private _nodeName = '';

	constructor() {
		super();

		this.consumeContext('umbNodeContext', (nodeContext) => {
			this._nodeContext = nodeContext;
			this._observeNode();
		});
	}

	private _observeNode() {
		if (!this._nodeContext) return;

		this.observe<NodeEntity>(this._nodeContext.data.pipe(distinctUntilChanged()), (node) => {
			this._nodeName = node.name;
		});
	}

	render() {
		return html`<div>Info Editor View for ${this._nodeName}</div>`;
	}
}

export default UmbEditorViewNodeInfoElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-editor-view-node-info': UmbEditorViewNodeInfoElement;
	}
}
