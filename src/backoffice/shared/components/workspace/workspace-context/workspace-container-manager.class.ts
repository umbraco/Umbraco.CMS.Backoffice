import { UmbDocumentWorkspaceContext } from '../../../../documents/documents/workspace/document-workspace.context';
import { PropertyTypeContainerResponseModelBaseModel } from '@umbraco-cms/backoffice/backend-api';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import { UmbContextConsumerController, UMB_ENTITY_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/context-api';
import { ArrayState, BooleanState, UmbObserverController } from '@umbraco-cms/backoffice/observable-api';

export class UmbWorkspaceContainerManager {
	#host: UmbControllerHostElement;

	#workspaceContext?: UmbDocumentWorkspaceContext;

	private _isRoot = false;
	private _containerName?: string;

	private _tabContainers: PropertyTypeContainerResponseModelBaseModel[] = [];

	#groups = new ArrayState<PropertyTypeContainerResponseModelBaseModel>([], (x) => x.key);
	readonly groups = this.#groups.asObservable();

	#hasProperties = new BooleanState(false);
	readonly hasProperties = this.#hasProperties.asObservable();

	constructor(host: UmbControllerHostElement) {
		this.#host = host;

		this.#groups.sortBy((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

		new UmbContextConsumerController(host, UMB_ENTITY_WORKSPACE_CONTEXT, (context) => {
			this.#workspaceContext = context as UmbDocumentWorkspaceContext;
			this._observeTabContainers();
		});
	}

	public setContainerName(value?: string) {
		if (this._containerName === value) return;
		this._containerName = value;
		this._observeTabContainers();
	}
	public getContainerName() {
		return this._containerName;
	}

	public setIsRoot(value: boolean) {
		if (this._isRoot === value) return;
		this._isRoot = value;
		this._observeTabContainers();
	}
	public getIsRoot() {
		return this._isRoot;
	}

	private _observeTabContainers() {
		if (!this.#workspaceContext) return;

		if (this._isRoot) {
			this.#groups.next([]);
			// We cannot have root properties currently, therefor we set it to false:
			this.#hasProperties.next(false);
			this._observeRootGroups();
		} else if (this._containerName) {
			this.#groups.next([]);
			new UmbObserverController(
				this.#host,
				this.#workspaceContext.structure.containersByNameAndType(this._containerName, 'Tab'),
				(tabContainers) => {
					this._tabContainers = tabContainers || [];
					if (this._tabContainers.length > 0) {
						this._observeHasTabProperties();
						this._observeGroups();
					}
				},
				'_observeContainers'
			);
		}
	}

	private _observeHasTabProperties() {
		if (!this.#workspaceContext) return;

		this._tabContainers.forEach((container) => {
			new UmbObserverController(
				this.#host,
				this.#workspaceContext!.structure.hasPropertyStructuresOf(container.key!),
				(hasProperties) => {
					this.#hasProperties.next(hasProperties);
				},
				'_observeHasProperties_' + container.key
			);
		});
	}

	private _observeGroups() {
		if (!this.#workspaceContext || !this._containerName) return;

		this._tabContainers.forEach((container) => {
			new UmbObserverController(
				this.#host,
				this.#workspaceContext!.structure.containersOfParentKey(container.key, 'Group'),
				this._insertGroupContainers,
				'_observeGroupsOf_' + container.key
			);
		});
	}

	private _observeRootGroups() {
		if (!this.#workspaceContext || !this._isRoot) return;

		new UmbObserverController(
			this.#host,
			this.#workspaceContext!.structure.rootContainers('Group'),
			this._insertGroupContainers,
			'_observeRootGroups'
		);
	}

	private _insertGroupContainers = (groupContainers: PropertyTypeContainerResponseModelBaseModel[]) => {
		groupContainers.forEach((group) => {
			if (group.name) {
				if (!this.#groups.getValue().find((x) => x.name === group.name)) {
					this.#groups.appendOne(group);
				}
			}
		});
	};
}
