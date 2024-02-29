/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateLanguageRequestModel } from '../models/CreateLanguageRequestModel';
import type { LanguageItemResponseModel } from '../models/LanguageItemResponseModel';
import type { LanguageResponseModel } from '../models/LanguageResponseModel';
import type { PagedLanguageResponseModel } from '../models/PagedLanguageResponseModel';
import type { UpdateLanguageRequestModel } from '../models/UpdateLanguageRequestModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LanguageResource {

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getItemLanguage({
        isoCode,
    }: {
        isoCode?: Array<string>,
    }): CancelablePromise<Array<LanguageItemResponseModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/item/language',
            query: {
                'isoCode': isoCode,
            },
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

    /**
     * @returns PagedLanguageResponseModel Success
     * @throws ApiError
     */
    public static getLanguage({
        skip,
        take = 100,
    }: {
        skip?: number,
        take?: number,
    }): CancelablePromise<PagedLanguageResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/language',
            query: {
                'skip': skip,
                'take': take,
            },
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

    /**
     * @returns string Created
     * @throws ApiError
     */
    public static postLanguage({
        requestBody,
    }: {
        requestBody?: CreateLanguageRequestModel,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/management/api/v1/language',
            body: requestBody,
            mediaType: 'application/json',
            responseHeader: 'Umb-Generated-Resource',
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getLanguageByIsoCode({
        isoCode,
    }: {
        isoCode: string,
    }): CancelablePromise<LanguageResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/language/{isoCode}',
            path: {
                'isoCode': isoCode,
            },
            errors: {
                401: `The resource is protected and requires an authentication token`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns string Success
     * @throws ApiError
     */
    public static deleteLanguageByIsoCode({
        isoCode,
    }: {
        isoCode: string,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/umbraco/management/api/v1/language/{isoCode}',
            path: {
                'isoCode': isoCode,
            },
            responseHeader: 'Umb-Notifications',
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns string Success
     * @throws ApiError
     */
    public static putLanguageByIsoCode({
        isoCode,
        requestBody,
    }: {
        isoCode: string,
        requestBody?: UpdateLanguageRequestModel,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/management/api/v1/language/{isoCode}',
            path: {
                'isoCode': isoCode,
            },
            body: requestBody,
            mediaType: 'application/json',
            responseHeader: 'Umb-Notifications',
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                404: `Not Found`,
            },
        });
    }

}
