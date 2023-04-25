import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

export const UMB_CURRENT_USER_MODAL = new UmbModalToken<never, never>('Umb.Modal.CurrentUser', {
	type: 'sidebar',
	size: 'small',
});
