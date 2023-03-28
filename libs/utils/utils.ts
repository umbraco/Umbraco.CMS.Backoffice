import { InterfaceColor, InterfaceLook } from '@umbraco-ui/uui-base/lib/types';
import type { UserStatus } from '@umbraco-cms/backoffice/models';

export const getLookAndColorFromUserStatus = (status: UserStatus): { look: InterfaceLook; color: InterfaceColor } => {
	switch ((status || '').toLowerCase()) {
		case 'invited':
		case 'inactive':
			return { look: 'primary', color: 'warning' };
		case 'enabled':
			return { look: 'primary', color: 'positive' };
		case 'disabled':
			return { look: 'primary', color: 'danger' };
		default:
			return { look: 'secondary', color: 'default' };
	}
};
