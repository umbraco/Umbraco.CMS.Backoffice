import { UmbPropertyContext, UMB_PROPERTY_CONTEXT } from '@umbraco-cms/backoffice/property';
import type { UmbPropertyAction } from '../../shared/property-action/property-action.interface.js';
import { html, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

@customElement('umb-property-action-clear')
export class UmbPropertyActionClearElement extends UmbLitElement implements UmbPropertyAction {
	@property()
	value = '';

	// THESE OUT COMMENTED CODE IS USED FOR THE EXAMPLE BELOW, TODO: Should be transferred to some documentation.
	//private _propertyActionMenuContext?: UmbPropertyActionMenuContext;
	private _propertyContext?: UmbPropertyContext;

	constructor() {
		super();

		/*
		this.consumeContext('umbPropertyActionMenu', (propertyActionsContext: UmbPropertyActionMenuContext) => {
			this._propertyActionMenuContext = propertyActionsContext;
		});
		*/
		this.consumeContext(UMB_PROPERTY_CONTEXT, (propertyContext: UmbPropertyContext) => {
			this._propertyContext = propertyContext;
		});
	}

	private _handleLabelClick() {
		this._clearValue();
		this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
		// Or you can do this:
		//this._propertyActionMenuContext?.close();
	}

	private _clearValue() {
		// TODO: how do we want to update the value? Testing an event based approach. We need to test an api based approach too.
		//this.value = '';// This is though bad as it assumes we are dealing with a string. So wouldn't work as a generalized element.
		//this.dispatchEvent(new CustomEvent('property-value-change'));
		// Or you can do this:
		this._propertyContext?.resetValue(); // This resets value to what the property wants.
	}

	render() {
		return html` <uui-menu-item label="Clear" @click-label="${this._handleLabelClick}">
			<uui-icon slot="icon" name="delete"></uui-icon>
		</uui-menu-item>`;
	}
}

export default UmbPropertyActionClearElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-action-clear': UmbPropertyActionClearElement;
	}
}
