import type { UserGroupEntity } from '@umbraco-cms/backoffice/models';

export interface UserGroupDetails extends UserGroupEntity {
	sections: Array<string>;
	contentStartNode?: string;
	mediaStartNode?: string;
	permissions: Array<string>;
}
