import { UmbWorkspaceContext } from '../../../shared/components/workspace/workspace-context/workspace-context';
import { UmbUserRepository } from '../repository/user.repository';
import { UmbEntityWorkspaceContextInterface } from '@umbraco-cms/backoffice/workspace';
import type { UserDetails } from '@umbraco-cms/backoffice/models';
import type { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import { ObjectState } from '@umbraco-cms/backoffice/observable-api';
import { UserResponseModel } from '@umbraco-cms/backoffice/backend-api';

export class UmbUserWorkspaceContext
	extends UmbWorkspaceContext<UmbUserRepository, UserDetails>
	implements UmbEntityWorkspaceContextInterface<UserDetails | undefined>
{
	constructor(host: UmbControllerHostElement) {
		super(host, new UmbUserRepository(host));
	}

	#data = new ObjectState<UserResponseModel | undefined>(undefined);
	data = this.#data.asObservable();

	async load(id: string) {
		console.log('load');

		const { data } = await this.repository.requestById(id);
		if (data) {
			this.setIsNew(false);
			this.#data.update(data);
		}
	}

	getEntityId(): string | undefined {
		throw new Error('Method not implemented.');
	}
	getEntityType(): string {
		throw new Error('Method not implemented.');
	}
	getData(): UserDetails | undefined {
		throw new Error('Method not implemented.');
	}
	save(): Promise<void> {
		throw new Error('Method not implemented.');
	}
	destroy(): void {
		throw new Error('Method not implemented.');
	}
}
