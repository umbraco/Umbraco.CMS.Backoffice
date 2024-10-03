import { UMB_TIPTAP_TOOLBAR_CONFIGURATION_CONTEXT } from '../contexts/tiptap-toolbar-configuration.context.js';
import type {
	UmbTiptapToolbarGroupViewModel,
	UmbTiptapToolbarRowViewModel,
} from '../contexts/tiptap-toolbar-configuration.context.js';
import { css, customElement, html, property, repeat, when } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbSorterController } from '@umbraco-cms/backoffice/sorter';
import type { PropertyValues } from '@umbraco-cms/backoffice/external/lit';

import './tiptap-toolbar-configuration-group.element.js';

const elementName = 'umb-tiptap-toolbar-configuration-row';

@customElement(elementName)
export class UmbTiptapToolbarConfigurationRowElementElement extends UmbLitElement {
	#context?: typeof UMB_TIPTAP_TOOLBAR_CONFIGURATION_CONTEXT.TYPE;

	#sorter = new UmbSorterController<UmbTiptapToolbarGroupViewModel>(this, {
		getUniqueOfElement: (element: HTMLElement) => {
			return element.id;
		},
		getUniqueOfModel: (modelEntry) => {
			return modelEntry.unique;
		},
		itemSelector: 'umb-tiptap-toolbar-configuration-group',
		containerSelector: '#rows',
		onChange: ({ model }) => {
			this.#context?.updateToolbarRow(this.index, model);
		},
	});

	@property({ type: Boolean })
	hideActionBar = false;

	@property({ type: Number })
	index: number = 0;

	@property({ type: Object })
	row?: UmbTiptapToolbarRowViewModel;

	constructor() {
		super();

		this.consumeContext(UMB_TIPTAP_TOOLBAR_CONFIGURATION_CONTEXT, (context) => {
			this.#context = context;
		});
	}

	protected override firstUpdated(_changedProperties: PropertyValues): void {
		super.firstUpdated(_changedProperties);

		// TODO: [LK] This needs to be reactive, as the view-modal gets updated elsewhere, so the sorter becomes out of sync.
		if ((this.row?.data.length ?? 0) > 1) {
			this.#sorter.enable();
			this.#sorter.setModel(this.row?.data ?? []);
		} else {
			this.#sorter.disable();
		}
	}

	override render() {
		//console.log('row.render', this.row);
		if (!this.row) return;
		return html`
			<uui-button-inline-create
				label=${this.localize.term('grid_addRowConfiguration')}
				@click=${() => this.#context?.insertToolbarRow(this.index)}></uui-button-inline-create>
			<div class="row">
				${when(!this.hideActionBar, () => html`<uui-icon class="handle" name="icon-navigation"></uui-icon>`)}
				<div class="groups">
					<uui-button-inline-create
						vertical
						label="Add group"
						@click=${() => this.#context?.insertToolbarGroup(this.index, 0)}></uui-button-inline-create>
					${repeat(
						this.row.data,
						(group) => group.unique,
						(group, idx) => html`
							<umb-tiptap-toolbar-configuration-group
								id=${group.unique}
								.index=${idx}
								.rowIndex=${this.index}
								.group=${group}
								?hideActionBar=${this.row!.data.length === 1 &&
								group.data.length === 0}></umb-tiptap-toolbar-configuration-group>
						`,
					)}
				</div>
				${when(
					!this.hideActionBar,
					() => html`
						<uui-action-bar>
							<uui-button
								color="danger"
								look="secondary"
								label="Remove row"
								@click=${() => this.#context?.removeToolbarRow(this.index)}>
								<uui-icon name="icon-trash"></uui-icon>
							</uui-button>
						</uui-action-bar>
					`,
				)}
			</div>
		`;
	}

	static override styles = [
		css`
			.handle {
				cursor: move;
			}

			.row {
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
				gap: var(--uui-size-3);
				border: 1px solid var(--uui-color-border);
				border-radius: var(--uui-border-radius);
				padding: var(--uui-size-3) var(--uui-size-2);

				&:hover {
					border-color: rebeccapurple;
				}
			}

			.groups {
				flex: 1;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				align-items: center;
				justify-content: flex-start;
				gap: var(--uui-size-1);

				uui-button-inline-create {
					height: 40px;
				}
			}
		`,
	];
}

export { UmbTiptapToolbarConfigurationRowElementElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbTiptapToolbarConfigurationRowElementElement;
	}
}
