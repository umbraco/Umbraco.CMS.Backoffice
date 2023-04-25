import { expect } from '@open-wc/testing';
import { InterfaceColor, InterfaceLook } from '@umbraco-ui/uui-base/lib/types';
import { getLookAndColorFromUserStatus } from './utils';
import { UserStateModel } from '@umbraco-cms/backoffice/backend-api';

describe('UmbUserExtensions', () => {
	it('returns correct look and color from a status string', () => {
		const testCases: { status: UserStateModel; look: InterfaceLook; color: InterfaceColor }[] = [
			{ status: UserStateModel.ACTIVE, look: 'primary', color: 'positive' },
			{ status: UserStateModel.INACTIVE, look: 'primary', color: 'warning' },
			{ status: UserStateModel.INVITED, look: 'primary', color: 'warning' },
			{ status: UserStateModel.DISABLED, look: 'primary', color: 'danger' },
		];

		testCases.forEach((testCase) => {
			console.log('testCase', testCase.status);
			const { look, color } = getLookAndColorFromUserStatus(testCase.status);
			expect(look).to.equal(testCase.look);
			expect(color).to.equal(testCase.color);
		});
	});
});
