import { UserGroupEntity } from '../../../../libs/models';

export interface UserGroupDetails extends UserGroupEntity {
	sections: Array<string>;
	contentStartNode?: string;
	mediaStartNode?: string;
	permissions: Array<string>;
}
