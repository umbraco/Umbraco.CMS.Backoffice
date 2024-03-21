import { UmbWebhookDetailRepository } from '../../repository/index.js';
import type { UmbWebhookDetailModel } from '../../types.js';
import {
	type UmbSaveableWorkspaceContextInterface,
	UmbEditableWorkspaceContextBase,
} from '@umbraco-cms/backoffice/workspace';
import { ApiError } from '@umbraco-cms/backoffice/external/backend-api';
import { UmbObjectState } from '@umbraco-cms/backoffice/observable-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';

export class UmbWebhookWorkspaceContext
	extends UmbEditableWorkspaceContextBase<UmbWebhookDetailModel>
	implements UmbSaveableWorkspaceContextInterface
{
	public readonly repository: UmbWebhookDetailRepository = new UmbWebhookDetailRepository(this);

	#data = new UmbObjectState<UmbWebhookDetailModel | undefined>(undefined);
	readonly data = this.#data.asObservable();

	// TODO: this is a temp solution to bubble validation errors to the UI
	#validationErrors = new UmbObjectState<any | undefined>(undefined);
	readonly validationErrors = this.#validationErrors.asObservable();

	constructor(host: UmbControllerHost) {
		super(host, 'Umb.Workspace.Webhook');
	}

	protected resetState(): void {
		super.resetState();
		this.#data.setValue(undefined);
	}

	async load(unique: string) {
		this.resetState();
		const { data } = await this.repository.requestByUnique(unique);
		if (data) {
			this.setIsNew(false);
			this.#data.update(data);
		}
	}

	async create() {
		this.resetState();
		const { data } = await this.repository.createScaffold();
		if (!data) return;
		this.setIsNew(true);
		this.#data.update(data);
		return { data };
	}

	getData() {
		return this.#data.getValue();
	}

	getEntityType() {
		return 'webhook';
	}

	// TODO: Convert to uniques:
	getUnique() {
		return this.#data.getValue()?.unique;
	}

	setName(name: string) {
		this.#data.update({ name });
	}

	setEnabled(enabled: boolean) {
		this.#data.update({ enabled });
	}

	// TODO: this is a temp solution to bubble validation errors to the UI
	setValidationErrors(errorMap: any) {
		// TODO: I can't use the update method to set the value to undefined
		this.#validationErrors.setValue(errorMap);
	}

	async save() {
		const data = this.getData();
		if (!data) return;

		if (this.getIsNew()) {
			const { error } = await this.repository.create(data);
			// TODO: this is temp solution to bubble validation errors to the UI
			if (error) {
				if (error instanceof ApiError && error.body.type === 'validation') {
					this.setValidationErrors?.(error.body.errors);
				}
			} else {
				this.setValidationErrors?.(undefined);
				// TODO: do not make it the buttons responsibility to set the workspace to not new.
				this.setIsNew(false);
			}
		} else {
			await this.repository.save(data);
			// TODO: Show validation errors as warnings?
		}
	}

	destroy(): void {
		this.#data.destroy();
		super.destroy();
	}
}

export const UMB_WEBHOOK_WORKSPACE_CONTEXT = new UmbContextToken<
	UmbSaveableWorkspaceContextInterface,
	UmbWebhookWorkspaceContext
>(
	'UmbWorkspaceContext',
	undefined,
	(context): context is UmbWebhookWorkspaceContext => context.getEntityType?.() === 'webhook',
);
