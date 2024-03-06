import { UMB_USER_ENTITY_TYPE } from '../../entity.js';
import { UmbResendInviteToUserEntityAction } from './resend-invite/resend-invite.action.js';
import { manifest as conditionManifest } from './resend-invite/resend-invite.action.condition.js';
import type { ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

const entityActions: Array<ManifestTypes> = [
	{
		type: 'entityAction',
		kind: 'default',
		alias: 'Umb.EntityAction.User.ResendInvite',
		name: 'Resend Invite User Entity Action',
		weight: 500,
		api: UmbResendInviteToUserEntityAction,
		forEntityTypes: [UMB_USER_ENTITY_TYPE],
		meta: {
			icon: 'icon-message',
			label: 'Resend Invite',
		},
		conditions: [
			{
				alias: 'Umb.Condition.User.AllowResendInviteAction',
			},
		],
	},
	conditionManifest,
];

export const manifests = [...entityActions];
