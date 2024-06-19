import { getUmbracoFieldSnippet } from '../../utils/index.js';
import type {
	UmbTemplatingPageFieldBuilderModalData,
	UmbTemplatingPageFieldBuilderModalValue,
} from './templating-page-field-builder-modal.token.js';
import type { UmbTemplateFieldDropdownListElement } from './components/template-field-dropdown-list/index.js';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import type { UUIBooleanInputEvent, UUIInputEvent } from '@umbraco-cms/backoffice/external/uui';

// import of local components
import './components/template-field-dropdown-list/index.js';

@customElement('umb-templating-page-field-builder-modal')
export class UmbTemplatingPageFieldBuilderModalElement extends UmbModalBaseElement<
	UmbTemplatingPageFieldBuilderModalData,
	UmbTemplatingPageFieldBuilderModalValue
> {
	private _close() {
		this.modalContext?.reject();
	}

	private _submit() {
		if (!this._field) return;
		this.value = { output: getUmbracoFieldSnippet(this._field, this._default, this._recursive) };
		this.modalContext?.submit();
	}

	@state()
	private _field?: string;

	@state()
	private _haveDefault: boolean = false;

	@state()
	private _default?: string;

	@state()
	private _recursive: boolean = false;

	/** TODO: Implement "Choose field" */

	#onChangeFieldValue(e: Event) {
		this._field = (e.target as UmbTemplateFieldDropdownListElement).value?.alias;
	}

	render() {
		return html`
			<umb-body-layout headline=${this.localize.term('template_insert')}>
				<uui-box>
					<div>
						<uui-label for="page-field-value">
							<umb-localize key="templateEditor_chooseField">Choose field</umb-localize>
						</uui-label>
						<umb-template-field-dropdown-list
							@change=${this.#onChangeFieldValue}
							exclude-media-type></umb-template-field-dropdown-list>

						<uui-label for="page-field-default-value">
							<umb-localize key="templateEditor_defaultValue">Default value</umb-localize>
						</uui-label>
						${!this._haveDefault
							? html`<uui-button
									label=${this.localize.term('templateEditor_addDefaultValue')}
									look="placeholder"
									@click=${() => (this._haveDefault = true)}></uui-button>`
							: html`<uui-input
									id="page-field-default-value"
									@change=${(e: UUIInputEvent) => (this._default = e.target.value as string)}
									label=${this.localize.term('templateEditor_defaultValue')}></uui-input>`}

						<uui-label for="recursive"><umb-localize key="templateEditor_recursive">Recursive</umb-localize></uui-label>
						<uui-checkbox
							id="recursive"
							label=${this.localize.term('templateEditor_recursiveDescr')}
							@change=${(e: UUIBooleanInputEvent) => (this._recursive = e.target.checked)}
							?disabled=${this._field ? false : true}></uui-checkbox>

						<uui-label><umb-localize key="templateEditor_outputSample">Output sample</umb-localize></uui-label>
						<umb-code-block language="C#" copy
							>${this._field ? getUmbracoFieldSnippet(this._field, this._default, this._recursive) : ''}</umb-code-block
						>
					</div>
				</uui-box>
				<uui-button
					slot="actions"
					@click=${this._close}
					look="secondary"
					label=${this.localize.term('general_close')}></uui-button>
				<uui-button
					slot="actions"
					@click=${this._submit}
					color="positive"
					look="primary"
					label=${this.localize.term('general_submit')}></uui-button>
			</umb-body-layout>
		`;
	}

	static styles = [
		UmbTextStyles,
		css`
			uui-box > div {
				display: flex;
				flex-direction: column;
				gap: var(--uui-size-space-2);
			}

			uui-label:not(:first-child) {
				margin-top: var(--uui-size-space-6);
			}
		`,
	];
}

export default UmbTemplatingPageFieldBuilderModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-templating-page-field-builder-modal': UmbTemplatingPageFieldBuilderModalElement;
	}
}
