/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SetTourStatusRequestModel } from '../models/SetTourStatusRequestModel';
import type { UserTourStatusesResponseModel } from '../models/UserTourStatusesResponseModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TourResource {

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getTour(): CancelablePromise<UserTourStatusesResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/tour',
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

    /**
     * @returns string Success
     * @throws ApiError
     */
    public static postTour({
        requestBody,
    }: {
        requestBody?: SetTourStatusRequestModel,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/management/api/v1/tour',
            body: requestBody,
            mediaType: 'application/json',
            responseHeader: 'Umb-Notifications',
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

}
