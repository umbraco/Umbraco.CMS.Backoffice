import { UmbTiptapToolbarConfigurationContext } from '../contexts/tiptap-toolbar-configuration.context.js';
import type {
	UmbTiptapToolbarExtension,
	UmbTiptapToolbarRowViewModel,
} from '../contexts/tiptap-toolbar-configuration.context.js';
import type { UmbTiptapToolbarValue } from '../../../extensions/types.js';
import { customElement, css, html, property, repeat, state, when } from '@umbraco-cms/backoffice/external/lit';
import { debounce } from '@umbraco-cms/backoffice/utils';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbSorterController } from '@umbraco-cms/backoffice/sorter';
import { UMB_PROPERTY_CONTEXT } from '@umbraco-cms/backoffice/property';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/property-editor';
import type { UUIInputEvent } from '@umbraco-cms/backoffice/external/uui';

import './tiptap-toolbar-configuration-row.element.js';

const elementName = 'umb-property-editor-ui-tiptap-toolbar-configuration';

@customElement(elementName)
export class UmbPropertyEditorUiTiptapToolbarConfigurationElement
	extends UmbLitElement
	implements UmbPropertyEditorUiElement
{
	#context = new UmbTiptapToolbarConfigurationContext(this);

	#debouncedFilterInput = debounce(() => {
		this._availableExtensions = this.#context.filterExtensions(this.#filterQuery);
	}, 250);

	#filterQuery = '';

	#sorter = new UmbSorterController<UmbTiptapToolbarRowViewModel>(this, {
		getUniqueOfElement: (element: HTMLElement) => {
			return element.id;
		},
		getUniqueOfModel: (modelEntry) => {
			return modelEntry.unique;
		},
		itemSelector: 'umb-tiptap-toolbar-configuration-row',
		containerSelector: '#rows',
		onChange: ({ model }) => {
			this.#value = model.map((rows) => rows.data.map((groups) => [...groups.data]));
			this.#context.setToolbar(this.#value);
		},
	});

	@state()
	private _availableExtensions: Array<UmbTiptapToolbarExtension> = [];

	@state()
	private _toolbar: Array<UmbTiptapToolbarRowViewModel> = [];

	@property({ attribute: false })
	set value(value: UmbTiptapToolbarValue | undefined) {
		if (!value) value = [[[]]];
		if (value === this.#value) return;
		console.log('set value', value);
		this.#context.setToolbar(value);
	}
	get value(): UmbTiptapToolbarValue | undefined {
		return this.#value?.map((rows) => rows.map((groups) => [...groups]));
	}
	#value?: UmbTiptapToolbarValue;

	constructor() {
		super();

		this.consumeContext(UMB_PROPERTY_CONTEXT, (propertyContext) => {
			this.observe(this.#context.extensions, (extensions) => {
				this._availableExtensions = extensions;
			});

			this.observe(this.#context.reload, (reload) => {
				if (reload) {
					this.requestUpdate();
				}
			});

			this.observe(this.#context.toolbar, (toolbar) => {
				if (!toolbar.length) return;

				this._toolbar = toolbar;

				this.#value = toolbar.map((rows) => rows.data.map((groups) => [...groups.data]));

				console.log('observe toolbar set value', [toolbar, this.#value]);

				propertyContext.setValue(this.#value);

				if (this.#value.length > 1) {
					this.#sorter.enable();
					this.#sorter.setModel(this._toolbar);
				} else {
					this.#sorter.disable();
				}
			});
		});
	}

	#onClick(item: UmbTiptapToolbarExtension) {
		const lastRow = (this.#value?.length ?? 1) - 1;
		const lastGroup = (this.#value?.[lastRow].length ?? 1) - 1;
		const lastItem = this.#value?.[lastRow][lastGroup].length ?? 0;
		console.log('onClick', [item, this.#value, lastRow, lastGroup, lastItem]);
		this.#context.insertToolbarItem(item.alias, [lastRow, lastGroup, lastItem]);
	}

	#onFilterInput(event: UUIInputEvent) {
		this.#filterQuery = (event.target.value as string).toLocaleLowerCase();
		this.#debouncedFilterInput();
	}

	override render() {
		return html`${this.#renderAvailableItems()} ${this.#renderDesigner()} ${this.#renderDebug()}`;
	}

	#renderAvailableItems() {
		return html`
			<uui-box class="minimal" headline="Available toolbar items">
				<div slot="header-actions">
					<uui-input
						type="search"
						autocomplete="off"
						placeholder=${this.localize.term('placeholders_filter')}
						@input=${this.#onFilterInput}>
						<div slot="prepend">
							<uui-icon name="search"></uui-icon>
						</div>
					</uui-input>
				</div>
				<div class="available-items">
					${when(
						this._availableExtensions.length === 0,
						() =>
							html`<umb-localize key="content_noItemsToShow">There are no toolbar extensions to show</umb-localize>`,
						() => repeat(this._availableExtensions, (item) => this.#renderAvailableItem(item)),
					)}
				</div>
			</uui-box>
		`;
	}

	#renderAvailableItem(item: UmbTiptapToolbarExtension) {
		const forbidden = !this.#context.isExtensionEnabled(item.alias);
		const inUse = this.#context.isExtensionInUse(item.alias);
		return html`
			<uui-button
				compact
				class=${forbidden ? 'forbidden' : ''}
				look=${forbidden ? 'placeholder' : 'outline'}
				?disabled=${forbidden || inUse}
				@click=${() => this.#onClick(item)}>
				<div class="inner">
					${when(item.icon, () => html`<umb-icon .name=${item.icon}></umb-icon>`)}
					<span>${this.localize.string(item.label)}</span>
				</div>
			</uui-button>
		`;
	}

	#renderDesigner() {
		return html`
			<uui-box class="minimal" headline="Toolbar designer">
				<div id="rows">
					${repeat(
						this._toolbar,
						(row) => row.unique,
						(row, idx) => html`
							<umb-tiptap-toolbar-configuration-row
								id=${row.unique}
								.index=${idx}
								.row=${row}
								?hideActionBar=${this._toolbar.length === 1}>
							</umb-tiptap-toolbar-configuration-row>
						`,
					)}
				</div>
				<uui-button
					id="btnAdd"
					look="placeholder"
					label=${this.localize.term('grid_addRowConfiguration')}
					@click=${() => this.#context.insertToolbarRow(this._toolbar.length)}></uui-button>
			</uui-box>
		`;
	}

	#renderDebug() {
		return html`
			<details>
				<summary style="cursor:pointer;">Raw JSON value</summary>
				<umb-code-block language="#value">${JSON.stringify(this.#value, null, 2)}</umb-code-block>
			</details>
			<details>
				<summary style="cursor:pointer;">Toolbar view model</summary>
				<umb-code-block language="_toolbar">${JSON.stringify(this._toolbar, null, 2)}</umb-code-block>
			</details>
		`;
	}

	static override readonly styles = [
		css`
			:host {
				display: flex;
				flex-direction: column;
				gap: var(--uui-size-1);
			}

			uui-box.minimal {
				--uui-box-header-padding: 0;
				--uui-box-default-padding: var(--uui-size-2) 0;
				--uui-box-box-shadow: none;

				[slot='header-actions'] {
					margin-bottom: var(--uui-size-2);

					uui-icon {
						color: var(--uui-color-border);
					}
				}
			}

			.available-items {
				display: flex;
				flex-wrap: wrap;
				gap: var(--uui-size-3);
				background-color: var(--uui-color-surface-alt);
				border-radius: var(--uui-border-radius);
				padding: var(--uui-size-3);

				uui-button {
					--uui-button-font-weight: normal;

					&[draggable='true'],
					&[draggable='true'] > .inner {
						cursor: move;
					}

					&[disabled],
					&[disabled] > .inner {
						cursor: not-allowed;
					}

					&.forbidden {
						--color: var(--uui-color-danger);
						--color-standalone: var(--uui-color-danger-standalone);
						--color-emphasis: var(--uui-color-danger-emphasis);
						--color-contrast: var(--uui-color-danger);
						--uui-button-contrast-disabled: var(--uui-color-danger);
						--uui-button-border-color-disabled: var(--uui-color-danger);
						opacity: 0.5;
					}

					div {
						display: flex;
						gap: var(--uui-size-1);
					}
				}
			}

			#rows {
				display: flex;
				flex-direction: column;
				gap: var(--uui-size-1);
			}

			#btnAdd {
				display: block;
				margin-top: var(--uui-size-1);
			}
		`,
	];
}

export { UmbPropertyEditorUiTiptapToolbarConfigurationElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbPropertyEditorUiTiptapToolbarConfigurationElement;
	}
}
