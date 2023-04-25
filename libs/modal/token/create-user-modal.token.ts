import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

export const UMB_CREATE_USER_MODAL = new UmbModalToken<never, never>('Umb.Modal.CreateUser', {
	type: 'dialog',
	size: 'small',
});
