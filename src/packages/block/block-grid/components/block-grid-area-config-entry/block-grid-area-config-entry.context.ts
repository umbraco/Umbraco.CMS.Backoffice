import {
	UmbBlockGridScaleManager,
	type UmbBlockGridScalableContext,
} from '../../context/block-grid-scale-manager/block-grid-scale-manager.controller.js';
import { UMB_BLOCK_GRID_AREA_TYPE_ENTRIES_CONTEXT } from '../../property-editors/block-grid-areas-config/block-grid-area-type-entries.context-token.js';
import { UMB_BLOCK_GRID_AREA_CONFIG_ENTRY_CONTEXT } from './block-grid-area-config-entry.context-token.js';
import type { UmbBlockGridTypeAreaType } from '@umbraco-cms/backoffice/block';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbObjectState } from '@umbraco-cms/backoffice/observable-api';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import { UMB_PROPERTY_CONTEXT } from '@umbraco-cms/backoffice/property';
import { UMB_CONFIRM_MODAL, UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';
export class UmbBlockGridAreaConfigEntryContext
	extends UmbContextBase<UmbBlockGridAreaConfigEntryContext>
	implements UmbBlockGridScalableContext
{
	//
	#entriesContext?: typeof UMB_BLOCK_GRID_AREA_TYPE_ENTRIES_CONTEXT.TYPE;
	//
	#propertyContext?: typeof UMB_PROPERTY_CONTEXT.TYPE;
	//
	#areaKey?: string;
	#area = new UmbObjectState<UmbBlockGridTypeAreaType | undefined>(undefined);
	readonly alias = this.#area.asObservablePart((x) => x?.alias);
	readonly columnSpan = this.#area.asObservablePart((x) => x?.columnSpan);
	readonly rowSpan = this.#area.asObservablePart((x) => x?.rowSpan ?? 1);

	readonly scaleManager = new UmbBlockGridScaleManager(this);

	public getMinMaxRowSpan(): [number, number] {
		return [1, 999];
	}
	setColumnSpan(columnSpan: number) {
		const layoutColumns = this.#entriesContext?.getLayoutColumns();
		if (!layoutColumns) return;
		columnSpan = Math.max(1, Math.min(columnSpan, layoutColumns));
		this.#area.update({ columnSpan });
	}
	getColumnSpan() {
		return this.#area.getValue()?.columnSpan;
	}
	setRowSpan(rowSpan: number) {
		this.#area.update({ rowSpan });
	}
	getRowSpan() {
		return this.#area.getValue()?.rowSpan;
	}
	public getRelevantColumnSpanOptions() {
		const layoutColumns = this.#entriesContext?.getLayoutColumns();
		if (!layoutColumns) return;
		// Makes an array based of the given length, with number entries starting from 1. ex.: length 4 => [1, 2, 3, 4]
		return Array.from({ length: layoutColumns }, (_, i) => i + 1);
	}

	constructor(host: UmbControllerHost) {
		super(host, UMB_BLOCK_GRID_AREA_CONFIG_ENTRY_CONTEXT);

		this.consumeContext(UMB_PROPERTY_CONTEXT, (context) => {
			this.#propertyContext = context;
			this.#observeAreaData();
		});

		this.consumeContext(UMB_BLOCK_GRID_AREA_TYPE_ENTRIES_CONTEXT, (context) => {
			this.#entriesContext = context;
			this.scaleManager.setEntriesContext(context);
		});
	}

	setAreaKey(areaKey: string) {
		if (this.#areaKey === areaKey) return;
		this.#areaKey = areaKey;
		this.#observeAreaData();
	}

	#observeAreaData() {
		if (!this.#areaKey || !this.#propertyContext) return;
		this.observe(
			this.#propertyContext.value,
			(value: Array<UmbBlockGridTypeAreaType> | undefined) => {
				if (value) {
					const areaType = value.find((x) => x.key === this.#areaKey);
					this.#area.setValue(areaType);
				}
			},
			'observeAreaKey',
		);
	}

	requestDelete() {
		this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, async (modalManager) => {
			const modalContext = modalManager.open(UMB_CONFIRM_MODAL, {
				data: {
					headline: `Delete ${this.alias}`,
					content: 'Are you sure you want to delete this Area?',
					confirmLabel: 'Delete',
					color: 'danger',
				},
			});
			await modalContext.onSubmit();
			this.delete();
		});
	}
	public delete() {
		if (!this.#areaKey || !this.#propertyContext) return;
		const value = this.#propertyContext.getValue() as Array<UmbBlockGridTypeAreaType> | undefined;
		if (!value) return;
		this.#propertyContext.setValue(value.filter((x) => x.key !== this.#areaKey));
	}

	destroy() {
		super.destroy();
		this.#area.destroy();
	}
}
