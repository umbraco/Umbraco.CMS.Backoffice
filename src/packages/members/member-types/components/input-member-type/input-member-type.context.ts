import { UMB_MEMBER_TYPE_PICKER_MODAL } from '../../../../core/modal/token/member-type-picker-modal.token.js';
import { UMB_MEMBER_TYPE_REPOSITORY_ALIAS } from '../../repository/index.js';
import { UmbPickerInputContext } from '@umbraco-cms/backoffice/picker-input';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';
import { MemberTypeItemResponseModel } from '@umbraco-cms/backoffice/backend-api';

export class UmbMemberTypePickerContext extends UmbPickerInputContext<MemberTypeItemResponseModel> {
	constructor(host: UmbControllerHostElement) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		super(host, UMB_MEMBER_TYPE_REPOSITORY_ALIAS, UMB_MEMBER_TYPE_PICKER_MODAL);
	}
}
