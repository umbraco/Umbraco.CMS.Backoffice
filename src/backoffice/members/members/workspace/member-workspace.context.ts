import { UmbMemberRepository } from '../repository/member.repository';
import { UmbEntityWorkspaceContextInterface, UmbWorkspaceContext } from '@umbraco-cms/backoffice/workspace';
import type { MemberDetails } from '@umbraco-cms/backoffice/models';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';

export class UmbMemberWorkspaceContext
	extends UmbWorkspaceContext<UmbMemberRepository, MemberDetails>
	implements UmbEntityWorkspaceContextInterface<MemberDetails | undefined>
{
	constructor(host: UmbControllerHostElement) {
		super(host, new UmbMemberRepository(host));
	}

	getEntityType(): string {
		return 'member';
	}

	getEntityId() {
		return '1234';
	}

	getData() {
		return 'fake' as unknown as MemberDetails;
	}

	async save() {
		console.log('save');
	}

	async load(id: string) {
		console.log('load', id);
	}

	public destroy(): void {
		console.log('destroy');
	}
}
