import { UMB_MODAL_TEMPLATING_INSERT_SECTION_SIDEBAR_ALIAS } from '../manifests.js';
import { getAddSectionSnippet, getRenderBodySnippet, getRenderSectionSnippet } from '../../utils.js';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, queryAll, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbModalToken, UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';

import './insert-section-input.element.js';
// eslint-disable-next-line local-rules/ensure-relative-import-use-js-extension
import type { UmbInsertSectionCheckboxElement } from './insert-section-input.element';

export const UMB_MODAL_TEMPLATING_INSERT_SECTION_MODAL = new UmbModalToken<object, UmbInsertSectionModalModalValue>(
	UMB_MODAL_TEMPLATING_INSERT_SECTION_SIDEBAR_ALIAS,
	{
		modal: {
			type: 'sidebar',
			size: 'small',
		},
	},
);

export interface UmbInsertSectionModalModalValue {
	value?: string;
}

@customElement('umb-templating-insert-section-modal')
export default class UmbTemplatingInsertSectionModalElement extends UmbModalBaseElement<
	object,
	UmbInsertSectionModalModalValue
> {
	@queryAll('umb-insert-section-checkbox')
	checkboxes!: NodeListOf<UmbInsertSectionCheckboxElement>;

	@state()
	selectedCheckbox?: UmbInsertSectionCheckboxElement | null = null;

	@state()
	snippet = '';

	#chooseSection(event: Event) {
		const target = event.target as UmbInsertSectionCheckboxElement;
		const checkboxes = Array.from(this.checkboxes);
		if (checkboxes.every((checkbox) => checkbox.checked === false)) {
			this.selectedCheckbox = null;
			return;
		}
		if (target.checked) {
			this.selectedCheckbox = target;
			this.snippet = this.selectedCheckbox.snippet ?? '';
			checkboxes.forEach((checkbox) => {
				if (checkbox !== target) {
					checkbox.checked = false;
				}
			});
		}
	}

	firstUpdated() {
		this.selectedCheckbox = this.checkboxes[0];
	}

	snippetMethods = [getRenderBodySnippet, getRenderSectionSnippet, getAddSectionSnippet];

	#close() {
		this.modalContext?.reject();
	}

	#submit() {
		const value = this.selectedCheckbox?.snippet;
		if (this.selectedCheckbox?.validate()) {
			this.value = { value: value ?? '' };
			this.modalContext?.submit();
		}
	}

	render() {
		return html`
			<umb-body-layout headline="Insert">
				<div id="main">
					<uui-box>
						<umb-insert-section-checkbox
							@change=${this.#chooseSection}
							label="Render child template"
							checked
							.snippetMethod=${getRenderBodySnippet}>
							<p slot="description">
								Renders the contents of a child template, by inserting a <code>@RenderBody()</code> placeholder.
							</p>
						</umb-insert-section-checkbox>

						<umb-insert-section-checkbox
							@change=${this.#chooseSection}
							label="Render a named section"
							show-mandatory
							show-input
							.snippetMethod=${getRenderSectionSnippet}>
							<p slot="description">
								Renders a named area of a child template, by inserting a <code>@RenderSection(name)</code> placeholder.
								This renders an area of a child template which is wrapped in a corresponding
								<code>@section [name]{ ... }</code> definition.
							</p>
						</umb-insert-section-checkbox>

						<umb-insert-section-checkbox
							@change=${this.#chooseSection}
							label="Define a named section"
							show-input
							.snippetMethod=${getAddSectionSnippet}>
							<p slot="description">
								Defines a part of your template as a named section by wrapping it in <code>@section { ... }</code>. This
								can be rendered in a specific area of the parent of this template, by using <code>@RenderSection</code>.
							</p>
						</umb-insert-section-checkbox>
					</uui-box>
				</div>
				<div slot="actions">
					<uui-button @click=${this.#close} look="secondary" label="Close">Close</uui-button>
					<uui-button @click=${this.#submit} look="primary" color="positive" label="Submit">Submit</uui-button>
				</div>
			</umb-body-layout>
		`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
				color: var(--uui-color-text);
				--umb-header-layout-height: 70px;
			}

			#main {
				box-sizing: border-box;
				height: calc(
					100dvh - var(--umb-header-layout-height) - var(--umb-footer-layout-height) - 2 * var(--uui-size-layout-1)
				);
			}

			#main umb-insert-section-checkbox:not(:last-of-type) {
				margin-bottom: var(--uui-size-space-5);
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-templating-insert-section-modal': UmbTemplatingInsertSectionModalElement;
	}
}
