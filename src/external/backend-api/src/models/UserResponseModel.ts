/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserPresentationBaseModel } from './UserPresentationBaseModel';
import type { UserStateModel } from './UserStateModel';

export type UserResponseModel = (UserPresentationBaseModel & {
    id: string;
    languageIsoCode?: string | null;
    documentStartNodeIds: Array<string>;
    mediaStartNodeIds: Array<string>;
    avatarUrls: Array<string>;
    state: UserStateModel;
    failedLoginAttempts: number;
    createDate: string;
    updateDate: string;
    lastLoginDate?: string | null;
    lastLockoutDate?: string | null;
    lastPasswordChangeDate?: string | null;
});

