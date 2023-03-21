/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuditTypeModel } from '../models/AuditTypeModel';
import type { DirectionModel } from '../models/DirectionModel';
import type { PagedAuditLogResponseModel } from '../models/PagedAuditLogResponseModel';
import type { PagedAuditLogWithUsernameResponseModel } from '../models/PagedAuditLogWithUsernameResponseModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuditLogResource {

    /**
     * @returns PagedAuditLogWithUsernameResponseModel Success
     * @throws ApiError
     */
    public static getAuditLog({
orderDirection,
sinceDate,
skip,
take = 100,
}: {
orderDirection?: DirectionModel,
sinceDate?: string,
skip?: number,
take?: number,
}): CancelablePromise<PagedAuditLogWithUsernameResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/audit-log',
            query: {
                'orderDirection': orderDirection,
                'sinceDate': sinceDate,
                'skip': skip,
                'take': take,
            },
        });
    }

    /**
     * @returns PagedAuditLogResponseModel Success
     * @throws ApiError
     */
    public static getAuditLogByKey({
key,
orderDirection,
sinceDate,
skip,
take = 100,
}: {
key: string,
orderDirection?: DirectionModel,
sinceDate?: string,
skip?: number,
take?: number,
}): CancelablePromise<PagedAuditLogResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/audit-log/{key}',
            path: {
                'key': key,
            },
            query: {
                'orderDirection': orderDirection,
                'sinceDate': sinceDate,
                'skip': skip,
                'take': take,
            },
        });
    }

    /**
     * @returns PagedAuditLogResponseModel Success
     * @throws ApiError
     */
    public static getAuditLogTypeByLogType({
logType,
sinceDate,
skip,
take = 100,
}: {
logType: AuditTypeModel,
sinceDate?: string,
skip?: number,
take?: number,
}): CancelablePromise<PagedAuditLogResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/audit-log/type/{logType}',
            path: {
                'logType': logType,
            },
            query: {
                'sinceDate': sinceDate,
                'skip': skip,
                'take': take,
            },
        });
    }

}
