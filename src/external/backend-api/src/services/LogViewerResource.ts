/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DirectionModel } from '../models/DirectionModel';
import type { LogLevelCountsReponseModel } from '../models/LogLevelCountsReponseModel';
import type { LogLevelModel } from '../models/LogLevelModel';
import type { PagedLoggerResponseModel } from '../models/PagedLoggerResponseModel';
import type { PagedLogMessageResponseModel } from '../models/PagedLogMessageResponseModel';
import type { PagedLogTemplateResponseModel } from '../models/PagedLogTemplateResponseModel';
import type { PagedSavedLogSearchResponseModel } from '../models/PagedSavedLogSearchResponseModel';
import type { SavedLogSearchRequestModel } from '../models/SavedLogSearchRequestModel';
import type { SavedLogSearchResponseModel } from '../models/SavedLogSearchResponseModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LogViewerResource {

    /**
     * @returns PagedLoggerResponseModel Success
     * @throws ApiError
     */
    public static getLogViewerLevel({
        skip,
        take = 100,
    }: {
        skip?: number,
        take?: number,
    }): CancelablePromise<PagedLoggerResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/log-viewer/level',
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
     * @returns any Success
     * @throws ApiError
     */
    public static getLogViewerLevelCount({
        startDate,
        endDate,
    }: {
        startDate?: string,
        endDate?: string,
    }): CancelablePromise<LogLevelCountsReponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/log-viewer/level-count',
            query: {
                'startDate': startDate,
                'endDate': endDate,
            },
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

    /**
     * @returns PagedLogMessageResponseModel Success
     * @throws ApiError
     */
    public static getLogViewerLog({
        skip,
        take = 100,
        orderDirection,
        filterExpression,
        logLevel,
        startDate,
        endDate,
    }: {
        skip?: number,
        take?: number,
        orderDirection?: DirectionModel,
        filterExpression?: string,
        logLevel?: Array<LogLevelModel>,
        startDate?: string,
        endDate?: string,
    }): CancelablePromise<PagedLogMessageResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/log-viewer/log',
            query: {
                'skip': skip,
                'take': take,
                'orderDirection': orderDirection,
                'filterExpression': filterExpression,
                'logLevel': logLevel,
                'startDate': startDate,
                'endDate': endDate,
            },
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

    /**
     * @returns PagedLogTemplateResponseModel Success
     * @throws ApiError
     */
    public static getLogViewerMessageTemplate({
        skip,
        take = 100,
        startDate,
        endDate,
    }: {
        skip?: number,
        take?: number,
        startDate?: string,
        endDate?: string,
    }): CancelablePromise<PagedLogTemplateResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/log-viewer/message-template',
            query: {
                'skip': skip,
                'take': take,
                'startDate': startDate,
                'endDate': endDate,
            },
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

    /**
     * @returns PagedSavedLogSearchResponseModel Success
     * @throws ApiError
     */
    public static getLogViewerSavedSearch({
        skip,
        take = 100,
    }: {
        skip?: number,
        take?: number,
    }): CancelablePromise<PagedSavedLogSearchResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/log-viewer/saved-search',
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
    public static postLogViewerSavedSearch({
        requestBody,
    }: {
        requestBody?: SavedLogSearchRequestModel,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/management/api/v1/log-viewer/saved-search',
            body: requestBody,
            mediaType: 'application/json',
            responseHeader: 'Umb-Generated-Resource',
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getLogViewerSavedSearchByName({
        name,
    }: {
        name: string,
    }): CancelablePromise<SavedLogSearchResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/log-viewer/saved-search/{name}',
            path: {
                'name': name,
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
    public static deleteLogViewerSavedSearchByName({
        name,
    }: {
        name: string,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/umbraco/management/api/v1/log-viewer/saved-search/{name}',
            path: {
                'name': name,
            },
            responseHeader: 'Umb-Notifications',
            errors: {
                401: `The resource is protected and requires an authentication token`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getLogViewerValidateLogsSize({
        startDate,
        endDate,
    }: {
        startDate?: string,
        endDate?: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/log-viewer/validate-logs-size',
            query: {
                'startDate': startDate,
                'endDate': endDate,
            },
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

}
