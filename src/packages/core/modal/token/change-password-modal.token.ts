import { UmbModalToken } from './modal-token.js';

export interface UmbChangePasswordModalData {
	user: {
		unique: string;
	};
}

export interface UmbChangePasswordModalValue {
	oldPassword: string;
	newPassword: string;
	isCurrentUser: boolean;
}

export const UMB_CHANGE_PASSWORD_MODAL = new UmbModalToken<UmbChangePasswordModalData, UmbChangePasswordModalValue>(
	'Umb.Modal.ChangePassword',
	{
		modal: {
			type: 'dialog',
		},
	},
);
