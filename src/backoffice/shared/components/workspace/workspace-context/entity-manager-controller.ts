import { v4 as uuidv4 } from 'uuid';
import { UmbContextConsumerController, UmbContextToken } from '@umbraco-cms/context-api';
import { UmbControllerHostInterface } from '@umbraco-cms/controller';
import {
	UmbNotificationDefaultData,
	UmbNotificationContext,
	UMB_NOTIFICATION_SERVICE_CONTEXT_TOKEN,
} from '@umbraco-cms/notification';
import { ObjectState, UmbObserverController } from '@umbraco-cms/observable-api';
import type { EntityTreeItemModel } from '@umbraco-cms/backend-api';
import { UmbEntityDetailStore } from '@umbraco-cms/store';

// Extend entityType base type?, so we are sure to have parentKey?
// TODO: switch to use EntityDetailItem ? if we can have such type?
export class UmbEntityWorkspaceManager<
	StoreType extends UmbEntityDetailStore<EntityDetailsType>,
	EntityDetailsType extends EntityTreeItemModel = ReturnType<StoreType['getScaffold']>
> {
	private _host;

	state = new ObjectState<EntityDetailsType | undefined>(undefined);

	protected _storeSubscription?: UmbObserverController;

	private _notificationService?: UmbNotificationContext;
	private _store?: StoreType;

	#isNew = false;
	private _entityType;
	private _entityKey!: string;

	private _createAtParentKey?: string | null;

	constructor(host: UmbControllerHostInterface, entityType: string, storeToken: UmbContextToken<StoreType>) {
		this._host = host;
		this._entityType = entityType;

		new UmbContextConsumerController(this._host, UMB_NOTIFICATION_SERVICE_CONTEXT_TOKEN, (_instance) => {
			this._notificationService = _instance;
		});

		// Create controller holding Token?
		new UmbContextConsumerController<StoreType>(this._host, storeToken, (_instance) => {
			this._store = _instance;
			this._observeStore();
		});
	}

	private _observeStore() {
		if (!this._store || !this._entityKey) {
			return;
		}

		if (this.#isNew) {
			const newData = this._store.getScaffold(this._entityType, this._createAtParentKey || null);
			this.state.next(newData);
		} else {
			this._storeSubscription?.destroy();
			this._storeSubscription = new UmbObserverController(
				this._host,
				this._store.getByKey(this._entityKey),
				(content) => {
					if (!content) return; // TODO: Handle nicely if there is no content data.
					this.state.next(content as any);
				}
			);
		}
	}

	getEntityType = () => {
		return this._entityType;
	};
	getEntityKey = (): string => {
		return this._entityKey;
	};

	getStore = () => {
		return this._store;
	};

	getData = () => {
		return this.state.getValue();
	};

	load = (entityKey: string) => {
		this.#isNew = false;
		this._entityKey = entityKey;
		this._observeStore();
	};

	create = (parentKey: string | null) => {
		this.#isNew = true;
		this._entityKey = uuidv4();
		this._createAtParentKey = parentKey;
	};

	save = (): Promise<void> => {
		if (!this._store) {
			// TODO: add a more beautiful error:
			console.error('Could not save cause workspace context has no store.');
			return Promise.resolve();
		}

		const documentData = this.getData();
		if (!documentData) {
			console.error('Could not save cause workspace context has no data.');
			return Promise.resolve();
		}

		return this._store
			.save([documentData])
			.then(() => {
				const data: UmbNotificationDefaultData = { message: 'Document Saved' };
				this._notificationService?.peek('positive', { data });
			})
			.catch(() => {
				const data: UmbNotificationDefaultData = { message: 'Failed to save Document' };
				this._notificationService?.peek('danger', { data });
			});
	};

	public destroy = (): void => {
		this.state.unsubscribe();
	};
}
