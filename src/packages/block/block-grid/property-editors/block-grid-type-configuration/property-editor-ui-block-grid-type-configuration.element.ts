import type { UmbBlockTypeWithGroupKey, UmbInputBlockTypeElement } from '../../../block-type/index.js';
import '../../../block-type/components/input-block-type/index.js';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import {
	html,
	customElement,
	property,
	state,
	repeat,
	nothing,
	css,
	ifDefined,
} from '@umbraco-cms/backoffice/external/lit';
import {
	UmbPropertyValueChangeEvent,
	type UmbPropertyEditorConfigCollection,
} from '@umbraco-cms/backoffice/property-editor';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UMB_BLOCK_GRID_TYPE, type UmbBlockGridTypeGroupType } from '@umbraco-cms/backoffice/block-grid';
import type { UUIInputEvent } from '@umbraco-cms/backoffice/external/uui';
import { UMB_PROPERTY_DATASET_CONTEXT, type UmbPropertyDatasetContext } from '@umbraco-cms/backoffice/property';
import { UMB_WORKSPACE_MODAL, UmbModalRouteRegistrationController } from '@umbraco-cms/backoffice/modal';
import { UmbSorterController } from '@umbraco-cms/backoffice/sorter';

interface MappedGroupWithBlockTypes extends UmbBlockGridTypeGroupType {
	blocks: Array<UmbBlockTypeWithGroupKey>;
}

/**
 * @element umb-property-editor-ui-block-grid-type-configuration
 */
@customElement('umb-property-editor-ui-block-grid-type-configuration')
export class UmbPropertyEditorUIBlockGridTypeConfigurationElement
	extends UmbLitElement
	implements UmbPropertyEditorUiElement
{
	#sorter = new UmbSorterController<MappedGroupWithBlockTypes, HTMLElement>(this, {
		getUniqueOfElement: (element) => element.getAttribute('data-umb-group-key'),
		getUniqueOfModel: (modelEntry) => modelEntry.key!,
		itemSelector: '.group',
		draggableSelector: '.group-handle',
		containerSelector: '#groups',
		onChange: ({ model }) => {
			this._groupsWithBlockTypes = model;
		},
		onEnd: () => {
			// TODO: make one method for updating the blockGroupsDataSetValue:
			this.#datasetContext?.setPropertyValue(
				'blockGroups',
				this._groupsWithBlockTypes.map((group) => ({ key: group.key, name: group.name })),
			);
		},
	});

	#datasetContext?: UmbPropertyDatasetContext;
	#blockTypeWorkspaceModalRegistration?: UmbModalRouteRegistrationController<
		typeof UMB_WORKSPACE_MODAL.DATA,
		typeof UMB_WORKSPACE_MODAL.VALUE
	>;

	private _value: Array<UmbBlockTypeWithGroupKey> = [];
	@property({ attribute: false })
	get value() {
		return this._value;
	}
	set value(value: Array<UmbBlockTypeWithGroupKey>) {
		this._value = value ?? [];
	}

	@property({ type: Object, attribute: false })
	public config?: UmbPropertyEditorConfigCollection;

	@state()
	private _blockGroups: Array<UmbBlockGridTypeGroupType> = [];

	@state()
	private _groupsWithBlockTypes: Array<MappedGroupWithBlockTypes> = [];

	@state()
	private _notGroupedBlockTypes: Array<UmbBlockTypeWithGroupKey> = [];

	@state()
	private _workspacePath?: string;

	constructor() {
		super();
		this.consumeContext(UMB_PROPERTY_DATASET_CONTEXT, async (instance) => {
			this.#datasetContext = instance;
			this.#observeProperties();
		});

		this.#blockTypeWorkspaceModalRegistration = new UmbModalRouteRegistrationController(this, UMB_WORKSPACE_MODAL)
			.addAdditionalPath(UMB_BLOCK_GRID_TYPE)
			.onSetup(() => {
				return { data: { entityType: UMB_BLOCK_GRID_TYPE, preset: {} }, modal: { size: 'large' } };
			})
			.observeRouteBuilder((routeBuilder) => {
				const newpath = routeBuilder({});
				this._workspacePath = newpath;
			});
	}

	async #observeProperties() {
		if (!this.#datasetContext) return;

		this.observe(await this.#datasetContext.propertyValueByAlias('blockGroups'), (value) => {
			this._blockGroups = (value as Array<UmbBlockGridTypeGroupType>) ?? [];
			this.#mapValuesToBlockGroups();
		});
		this.observe(await this.#datasetContext.propertyValueByAlias('blocks'), (value) => {
			this.value = (value as Array<UmbBlockTypeWithGroupKey>) ?? [];
			this.#mapValuesToBlockGroups();
		});
	}

	#mapValuesToBlockGroups() {
		// Map blocks that are not in any group, or in a group that does not exist
		this._notGroupedBlockTypes = this._value.filter(
			(block) => !block.groupKey || !this._blockGroups.find((group) => group.key === block.groupKey),
		);

		// Map blocks to the group they belong to
		this._groupsWithBlockTypes = this._blockGroups.map((group) => {
			return { name: group.name, key: group.key, blocks: this._value.filter((value) => value.groupKey === group.key) };
		});

		this.#sorter.setModel(this._groupsWithBlockTypes);
	}

	#onChange(e: CustomEvent, groupKey?: string) {
		const updatedValues = (e.target as UmbInputBlockTypeElement).value.map((value) => ({ ...value, groupKey }));
		const filteredValues = this.value.filter((value) => value.groupKey !== groupKey);
		this.value = [...filteredValues, ...updatedValues];
		this.dispatchEvent(new UmbPropertyValueChangeEvent());
	}

	#onCreate(e: CustomEvent, groupKey?: string) {
		const selectedElementType = e.detail.contentElementTypeKey;
		if (selectedElementType) {
			this.#blockTypeWorkspaceModalRegistration?.open({}, 'create/' + selectedElementType + '/' + (groupKey ?? null));
		}
	}

	// TODO: Implement confirm dialog
	#deleteGroup(groupKey: string) {
		// TODO: make one method for updating the blockGroupsDataSetValue:
		// This one that deletes might require the ability to parse what to send as an argument to the method, then a filtering can occur before.
		this.#datasetContext?.setPropertyValue(
			'blockGroups',
			this._blockGroups.filter((group) => group.key !== groupKey),
		);

		// If a group is deleted, Move the blocks to no group:
		this.value = this._value.map((block) => (block.groupKey === groupKey ? { ...block, groupKey: undefined } : block));
	}

	#changeGroupName(e: UUIInputEvent, groupKey: string) {
		const groupName = e.target.value as string;
		// TODO: make one method for updating the blockGroupsDataSetValue:
		this.#datasetContext?.setPropertyValue(
			'blockGroups',
			this._blockGroups.map((group) => (group.key === groupKey ? { ...group, name: groupName } : group)),
		);
	}

	render() {
		return html`<div id="groups">
			${this._notGroupedBlockTypes
				? html`<umb-input-block-type
						.value=${this._notGroupedBlockTypes}
						.workspacePath=${this._workspacePath}
						@create=${(e: CustomEvent) => this.#onCreate(e, undefined)}
						@change=${(e: CustomEvent) => this.#onChange(e, undefined)}></umb-input-block-type>`
				: ''}
			${repeat(
				this._groupsWithBlockTypes,
				(group) => group.key,
				(group) =>
					html`<div class="group" data-umb-group-key=${ifDefined(group.key)}>
						${group.key ? this.#renderGroupInput(group.key, group.name) : nothing}
						<umb-input-block-type
							.value=${group.blocks}
							.workspacePath=${this._workspacePath}
							@create=${(e: CustomEvent) => this.#onCreate(e, group.key)}
							@change=${(e: CustomEvent) => this.#onChange(e, group.key)}></umb-input-block-type>
					</div>`,
			)}
		</div>`;
	}

	#renderGroupInput(groupKey: string, groupName?: string) {
		return html`<div class="group-handle">
			<uui-input
				auto-width
				label="Group"
				.value=${groupName ?? ''}
				@change=${(e: UUIInputEvent) => this.#changeGroupName(e, groupKey)}>
				<uui-button compact slot="append" label="delete" @click=${() => this.#deleteGroup(groupKey)}>
					<uui-icon name="icon-trash"></uui-icon>
				</uui-button>
			</uui-input>
		</div>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			uui-input:not(:hover, :focus) {
				border: 1px solid transparent;
			}
			uui-input:not(:hover, :focus) uui-button {
				opacity: 0;
			}

			.group-handle {
				padding: var(--uui-size-1);
				margin-top: var(--uui-size-6);
				margin-bottom: var(--uui-size-4);
				cursor: grab;
			}

			.group-handle:hover {
				background-color: var(--uui-color-divider);
				border-radius: var(--uui-border-radius);
			}

			.group:has([drag-placeholder]) {
				opacity: 0.2;
			}
		`,
	];
}

export default UmbPropertyEditorUIBlockGridTypeConfigurationElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-block-grid-type-configuration': UmbPropertyEditorUIBlockGridTypeConfigurationElement;
	}
}
