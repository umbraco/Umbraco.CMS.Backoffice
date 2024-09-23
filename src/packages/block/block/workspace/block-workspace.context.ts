import type { UmbBlockDataType, UmbBlockLayoutBaseModel } from '../types.js';
import { UmbBlockWorkspaceEditorElement } from './block-workspace-editor.element.js';
import { UmbBlockElementManager } from './block-element-manager.js';
import {
	UmbSubmittableWorkspaceContextBase,
	type UmbRoutableWorkspaceContext,
	UmbWorkspaceIsNewRedirectController,
	type ManifestWorkspace,
} from '@umbraco-cms/backoffice/workspace';
import { UmbClassState, UmbObjectState, UmbStringState } from '@umbraco-cms/backoffice/observable-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UMB_MODAL_CONTEXT, type UmbModalContext } from '@umbraco-cms/backoffice/modal';
import { decodeFilePath, UmbReadOnlyVariantStateManager } from '@umbraco-cms/backoffice/utils';
import {
	UMB_BLOCK_ENTRIES_CONTEXT,
	UMB_BLOCK_MANAGER_CONTEXT,
	type UmbBlockWorkspaceOriginData,
	type UmbBlockWorkspaceData,
} from '@umbraco-cms/backoffice/block';
import { UMB_PROPERTY_CONTEXT } from '@umbraco-cms/backoffice/property';
import type { UmbVariantId } from '@umbraco-cms/backoffice/variant';

export type UmbBlockWorkspaceElementManagerNames = 'content' | 'settings';
export class UmbBlockWorkspaceContext<LayoutDataType extends UmbBlockLayoutBaseModel = UmbBlockLayoutBaseModel>
	extends UmbSubmittableWorkspaceContextBase<LayoutDataType>
	implements UmbRoutableWorkspaceContext
{
	// Just for context token safety:
	public readonly IS_BLOCK_WORKSPACE_CONTEXT = true;
	//

	#blockManager?: typeof UMB_BLOCK_MANAGER_CONTEXT.TYPE;
	#retrieveBlockManager;
	#blockEntries?: typeof UMB_BLOCK_ENTRIES_CONTEXT.TYPE;
	#retrieveBlockEntries;
	#modalContext?: UmbModalContext<UmbBlockWorkspaceData>;
	#retrieveModalContext;

	#entityType: string;

	#liveEditingMode?: boolean;

	#initialLayout?: LayoutDataType;
	#initialContent?: UmbBlockDataType;
	#initialSettings?: UmbBlockDataType;

	#layout = new UmbObjectState<LayoutDataType | undefined>(undefined);
	readonly layout = this.#layout.asObservable();
	readonly unique = this.#layout.asObservablePart((x) => x?.contentUdi);
	readonly contentUdi = this.#layout.asObservablePart((x) => x?.contentUdi);

	readonly content = new UmbBlockElementManager(this, 'contentData');

	readonly settings = new UmbBlockElementManager(this, 'settingsData');

	// TODO: Get the name from the content element type. Or even better get the Label, but that has to be re-actively updated.
	#label = new UmbStringState<string | undefined>(undefined);
	readonly name = this.#label.asObservable();

	#variantId = new UmbClassState<UmbVariantId | undefined>(undefined);
	readonly variantId = this.#variantId.asObservable();

	public readonly readOnlyState = new UmbReadOnlyVariantStateManager(this);

	constructor(host: UmbControllerHost, workspaceArgs: { manifest: ManifestWorkspace }) {
		super(host, workspaceArgs.manifest.alias);
		const manifest = workspaceArgs.manifest;
		this.#entityType = manifest.meta?.entityType;

		this.addValidationContext(this.content.validation);
		this.addValidationContext(this.settings.validation);

		this.#retrieveModalContext = this.consumeContext(UMB_MODAL_CONTEXT, (context) => {
			this.#modalContext = context as any;
			context.onSubmit().catch(this.#modalRejected);
		}).asPromise();

		this.#retrieveBlockManager = this.consumeContext(UMB_BLOCK_MANAGER_CONTEXT, (context) => {
			this.#blockManager = context;
			this.observe(
				context.liveEditingMode,
				(liveEditingMode) => {
					this.#liveEditingMode = liveEditingMode;
				},
				'observeLiveEditingMode',
			);
		}).asPromise();

		this.#retrieveBlockEntries = this.consumeContext(UMB_BLOCK_ENTRIES_CONTEXT, (context) => {
			this.#blockEntries = context;
		}).asPromise();

		this.consumeContext(UMB_PROPERTY_CONTEXT, (context) => {
			this.observe(context.variantId, (variantId) => {
				this.#variantId.setValue(variantId);
			});

			// If the current property is readonly all inner block content should also be readonly.
			this.observe(context.isReadOnly, (isReadOnly) => {
				const unique = 'UMB_PROPERTY_CONTEXT';
				const variantId = this.#variantId.getValue();
				if (variantId === undefined) return;

				if (isReadOnly) {
					const state = {
						unique,
						variantId,
						message: '',
					};

					this.readOnlyState?.addState(state);
				} else {
					this.readOnlyState?.removeState(unique);
				}
			});
		});

		this.observe(this.variantId, (variantId) => {
			this.content.setVariantId(variantId);
		});

		this.routes.setRoutes([
			{
				path: 'create/:elementTypeKey',
				component: UmbBlockWorkspaceEditorElement,
				setup: async (component, info) => {
					(component as UmbBlockWorkspaceEditorElement).workspaceAlias = manifest.alias;

					const elementTypeKey = info.match.params.elementTypeKey;
					this.create(elementTypeKey);

					new UmbWorkspaceIsNewRedirectController(
						this,
						this,
						this.getHostElement().shadowRoot!.querySelector('umb-router-slot')!,
					);
				},
			},
			{
				path: 'edit/:udi',
				component: UmbBlockWorkspaceEditorElement,
				setup: (component, info) => {
					(component as UmbBlockWorkspaceEditorElement).workspaceAlias = manifest.alias;
					const udi = decodeFilePath(info.match.params.udi);
					this.load(udi);
				},
			},
		]);
	}

	protected override resetState() {
		super.resetState();
		this.#label.setValue(undefined);
		this.#layout.setValue(undefined);
		this.#initialLayout = undefined;
		this.#initialContent = undefined;
		this.#initialSettings = undefined;
		this.content.reset();
		this.settings.reset();
		this.removeUmbControllerByAlias('isNewRedirectController');
	}

	async load(unique: string) {
		await this.#retrieveBlockManager;
		await this.#retrieveBlockEntries;
		if (!this.#blockManager || !this.#blockEntries) {
			throw new Error('Block manager not found');
		}

		this.observe(
			this.#blockEntries.layoutOf(unique),
			(layoutData) => {
				this.#initialLayout ??= layoutData as LayoutDataType;
				this.removeUmbControllerByAlias('observeLayoutInitially');
			},
			'observeLayoutInitially',
		);

		this.#observeBlockData(unique);

		if (this.#liveEditingMode) {
			this.establishLiveSync();
		}
	}

	async create(contentElementTypeId: string) {
		await this.#retrieveBlockEntries;
		await this.#retrieveModalContext;
		if (!this.#blockEntries) {
			throw new Error('Block Entries not found');
			return;
		}
		if (!this.#modalContext) {
			throw new Error('Modal Context not found');
			return;
		}

		// TODO: Missing some way to append more layout data... this could be part of modal data, (or context api?)

		this.setIsNew(true);

		const blockCreated = await this.#blockEntries.create(
			contentElementTypeId,
			{},
			this.#modalContext.data.originData as UmbBlockWorkspaceOriginData,
		);
		if (!blockCreated) {
			throw new Error('Block Entries could not create block');
		}

		// TODO: We should investigate if it makes sense to gather

		if (!this.#liveEditingMode) {
			this.#layout.setValue(blockCreated.layout as LayoutDataType);
			this.content.setData(blockCreated.content);
			if (blockCreated.settings) {
				this.settings.setData(blockCreated.settings);
			}
		} else {
			// Insert already, cause we are in live editing mode:
			const blockInserted = await this.#blockEntries.insert(
				blockCreated.layout,
				blockCreated.content,
				blockCreated.settings,
				this.#modalContext.data.originData as UmbBlockWorkspaceOriginData,
			);
			if (!blockInserted) {
				throw new Error('Block Entries could not insert block');
			}

			const unique = blockCreated.layout.contentUdi;

			this.#observeBlockData(unique);
			this.establishLiveSync();
		}
	}

	#observeBlockData(unique: string) {
		if (!this.#blockEntries) {
			throw new Error('Block Entries not found');
			return;
		}
		this.observe(
			this.#blockEntries.layoutOf(unique),
			(layoutData) => {
				this.#layout.setValue(layoutData as LayoutDataType);

				// Content:
				const contentUdi = layoutData?.contentUdi;
				if (!contentUdi) {
					return;
				}

				this.observe(
					this.#blockManager!.contentOf(contentUdi),
					(contentData) => {
						this.content.setData(contentData);
					},
					'observeContent',
				);
				if (!this.#initialContent) {
					this.observe(
						this.#blockManager!.contentOf(contentUdi),
						(contentData) => {
							this.#initialContent ??= contentData;
							this.removeUmbControllerByAlias('observeContentInitially');
						},
						'observeContentInitially',
					);
				}

				// Settings:
				const settingsUdi = layoutData?.settingsUdi;
				if (settingsUdi) {
					this.observe(
						this.#blockManager!.settingsOf(settingsUdi),
						(settingsData) => {
							this.settings.setData(settingsData);
						},
						'observeSettings',
					);
					if (!this.#initialSettings) {
						this.observe(
							this.#blockManager!.settingsOf(settingsUdi),
							(settingsData) => {
								this.#initialSettings ??= settingsData;
								this.removeUmbControllerByAlias('observeSettingsInitially');
							},
							'observeSettingsInitially',
						);
					}
				}
			},
			'observeLayout',
		);
	}

	/**
	 * Establishes live synchronization of the block's layout, content, and settings data.
	 * This method observes local changes in the layout, content, and settings data and pushes those updates to the block manager.
	 * This method is used in live editing mode to ensure that changes made to the block's data are immediately reflected
	 * in the backoffice UI.
	 */
	establishLiveSync() {
		this.observe(this.layout, (layoutData) => {
			if (layoutData) {
				this.#blockManager?.setOneLayout(layoutData, this.#modalContext?.data as UmbBlockWorkspaceData);
			}
		});
		this.observe(this.content.data, (contentData) => {
			if (contentData) {
				this.#blockManager?.setOneContent(contentData);
			}
		});
		this.observe(this.settings.data, (settingsData) => {
			if (settingsData) {
				this.#blockManager?.setOneSettings(settingsData);
			}
		});
	}

	getData() {
		return this.#layout.getValue();
	}

	getUnique() {
		return this.getData()!.contentUdi;
	}

	getEntityType() {
		return this.#entityType;
	}

	getName() {
		return 'block name content element type here...';
	}

	/**
	 * @function propertyValueByAlias
	 * @param {string} propertyAlias - The alias of the property to get the value of.
	 * @returns {Promise<Observable<ReturnType | undefined> | undefined>} - The value of the property.
	 * @description Get an Observable for the value of this property.
	 */
	async propertyValueByAlias<propertyAliasType extends keyof LayoutDataType>(propertyAlias: propertyAliasType) {
		return this.#layout.asObservablePart(
			(layout) => layout?.[propertyAlias as keyof LayoutDataType] as LayoutDataType[propertyAliasType],
		);
	}

	getPropertyValue<propertyAliasType extends keyof LayoutDataType>(propertyAlias: propertyAliasType) {
		// TODO: Should be using Content, then we need a toggle or another method for getting settings.
		return this.#layout.getValue()?.[propertyAlias as keyof LayoutDataType] as LayoutDataType[propertyAliasType];
	}

	/**
	 * @function setPropertyValue
	 * @param {string} alias - The alias of the property to set the value of.
	 * @param {unknown} value - value can be a promise resolving into the actual value or the raw value it self.
	 * @returns {Promise<void>}
	 * @description Set the value of this property.
	 */
	async setPropertyValue(alias: string, value: unknown) {
		const currentData = this.#layout.value;
		if (currentData) {
			this.#layout.update({ ...currentData, [alias]: value });
		}
	}

	async submit() {
		const layoutData = this.#layout.value;
		const contentData = this.content.getData();
		if (!layoutData || !this.#blockManager || !this.#blockEntries || !contentData || !this.#modalContext) {
			throw new Error('Missing data');
		}

		const settingsData = this.settings.getData();

		if (!this.#liveEditingMode) {
			if (this.getIsNew() === true) {
				// Insert (This means the layout entry will be inserted at the desired location):
				const blockInserted = await this.#blockEntries.insert(
					layoutData,
					contentData,
					settingsData,
					this.#modalContext.data.originData as UmbBlockWorkspaceOriginData,
				);
				if (!blockInserted) {
					throw new Error('Block Entries could not insert block');
				}
			} else {
				// Update data:

				this.#blockManager.setOneLayout(layoutData, this.#modalContext.data.originData as UmbBlockWorkspaceOriginData);
				if (contentData) {
					this.#blockManager.setOneContent(contentData);
				}
				if (settingsData) {
					this.#blockManager.setOneSettings(settingsData);
				}
			}
		}

		this.setIsNew(false);
	}

	#modalRejected = () => {
		if (this.#liveEditingMode) {
			// Revert
			// Did it exist before?
			if (this.getIsNew() === true) {
				// Remove the block?
				const contentUdi = this.#layout.value?.contentUdi;
				if (contentUdi) {
					this.#blockEntries?.delete(contentUdi);
				}
			} else {
				// Revert the layout, content & settings data to the original state: [NL]
				if (this.#initialLayout) {
					this.#blockManager?.setOneLayout(this.#initialLayout, this.#modalContext?.data as UmbBlockWorkspaceData);
				}
				if (this.#initialContent) {
					this.#blockManager?.setOneContent(this.#initialContent);
				}
				if (this.#initialSettings) {
					this.#blockManager?.setOneContent(this.#initialSettings);
				}
			}
		}
	};

	public override destroy(): void {
		super.destroy();
		this.#layout.destroy();
		this.#label.destroy();
		this.#blockManager = undefined;
		this.#modalContext = undefined;
	}
}

export { UmbBlockWorkspaceContext as api };
