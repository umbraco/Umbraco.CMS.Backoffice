/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CopyDocumentRequestModel } from '../models/CopyDocumentRequestModel';
import type { CreateDocumentRequestModel } from '../models/CreateDocumentRequestModel';
import type { DocumentItemResponseModel } from '../models/DocumentItemResponseModel';
import type { DocumentNotificationResponseModel } from '../models/DocumentNotificationResponseModel';
import type { DocumentResponseModel } from '../models/DocumentResponseModel';
import type { DomainsResponseModel } from '../models/DomainsResponseModel';
import type { MoveDocumentRequestModel } from '../models/MoveDocumentRequestModel';
import type { PagedDocumentTreeItemResponseModel } from '../models/PagedDocumentTreeItemResponseModel';
import type { PagedDocumentTypeResponseModel } from '../models/PagedDocumentTypeResponseModel';
import type { PagedRecycleBinItemResponseModel } from '../models/PagedRecycleBinItemResponseModel';
import type { PublicAccessRequestModel } from '../models/PublicAccessRequestModel';
import type { PublishDocumentRequestModel } from '../models/PublishDocumentRequestModel';
import type { PublishDocumentWithDescendantsRequestModel } from '../models/PublishDocumentWithDescendantsRequestModel';
import type { SortingRequestModel } from '../models/SortingRequestModel';
import type { UnpublishDocumentRequestModel } from '../models/UnpublishDocumentRequestModel';
import type { UpdateDocumentNotificationsRequestModel } from '../models/UpdateDocumentNotificationsRequestModel';
import type { UpdateDocumentRequestModel } from '../models/UpdateDocumentRequestModel';
import type { UpdateDomainsRequestModel } from '../models/UpdateDomainsRequestModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DocumentResource {

    /**
     * @returns string Created
     * @throws ApiError
     */
    public static postDocument({
        requestBody,
    }: {
        requestBody?: CreateDocumentRequestModel,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/management/api/v1/document',
            body: requestBody,
            mediaType: 'application/json',
            responseHeader: 'Location',
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getDocumentById({
        id,
    }: {
        id: string,
    }): CancelablePromise<DocumentResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/document/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static putDocumentById({
        id,
        requestBody,
    }: {
        id: string,
        requestBody?: UpdateDocumentRequestModel,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/management/api/v1/document/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns string Created
     * @throws ApiError
     */
    public static postDocumentByIdCopy({
        id,
        requestBody,
    }: {
        id: string,
        requestBody?: CopyDocumentRequestModel,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/management/api/v1/document/{id}/copy',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            responseHeader: 'Location',
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getDocumentByIdDomains({
        id,
    }: {
        id: string,
    }): CancelablePromise<DomainsResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/document/{id}/domains',
            path: {
                'id': id,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static putDocumentByIdDomains({
        id,
        requestBody,
    }: {
        id: string,
        requestBody?: UpdateDomainsRequestModel,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/management/api/v1/document/{id}/domains',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static putDocumentByIdMove({
        id,
        requestBody,
    }: {
        id: string,
        requestBody?: MoveDocumentRequestModel,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/management/api/v1/document/{id}/move',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static putDocumentByIdMoveToRecycleBin({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/management/api/v1/document/{id}/move-to-recycle-bin',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getDocumentByIdNotifications({
        id,
    }: {
        id: string,
    }): CancelablePromise<Array<DocumentNotificationResponseModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/document/{id}/notifications',
            path: {
                'id': id,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static putDocumentByIdNotifications({
        id,
        requestBody,
    }: {
        id: string,
        requestBody?: UpdateDocumentNotificationsRequestModel,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/management/api/v1/document/{id}/notifications',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns string Created
     * @throws ApiError
     */
    public static postDocumentByIdPublicAccess({
        id,
        requestBody,
    }: {
        id: string,
        requestBody?: PublicAccessRequestModel,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/management/api/v1/document/{id}/public-access',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            responseHeader: 'Location',
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static deleteDocumentByIdPublicAccess({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/umbraco/management/api/v1/document/{id}/public-access',
            path: {
                'id': id,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns void
     * @throws ApiError
     */
    public static getDocumentByIdPublicAccess({
        id,
    }: {
        id: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/document/{id}/public-access',
            path: {
                'id': id,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static putDocumentByIdPublicAccess({
        id,
        requestBody,
    }: {
        id: string,
        requestBody?: PublicAccessRequestModel,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/management/api/v1/document/{id}/public-access',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static putDocumentByIdPublish({
        id,
        requestBody,
    }: {
        id: string,
        requestBody?: (PublishDocumentRequestModel | PublishDocumentWithDescendantsRequestModel),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/management/api/v1/document/{id}/publish',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static putDocumentByIdPublishWithDescendants({
        id,
        requestBody,
    }: {
        id: string,
        requestBody?: PublishDocumentWithDescendantsRequestModel,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/management/api/v1/document/{id}/publish-with-descendants',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static putDocumentByIdUnpublish({
        id,
        requestBody,
    }: {
        id: string,
        requestBody?: UnpublishDocumentRequestModel,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/management/api/v1/document/{id}/unpublish',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns PagedDocumentTypeResponseModel Success
     * @throws ApiError
     */
    public static getDocumentAllowedDocumentTypes({
        parentId,
        skip,
        take = 100,
    }: {
        parentId?: string,
        skip?: number,
        take?: number,
    }): CancelablePromise<PagedDocumentTypeResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/document/allowed-document-types',
            query: {
                'parentId': parentId,
                'skip': skip,
                'take': take,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getDocumentItem({
        id,
        dataTypeId,
        culture,
    }: {
        id?: Array<string>,
        dataTypeId?: string,
        culture?: string,
    }): CancelablePromise<Array<DocumentItemResponseModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/document/item',
            query: {
                'id': id,
                'dataTypeId': dataTypeId,
                'culture': culture,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static putDocumentSort({
        requestBody,
    }: {
        requestBody?: SortingRequestModel,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/management/api/v1/document/sort',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns PagedRecycleBinItemResponseModel Success
     * @throws ApiError
     */
    public static getRecycleBinDocumentChildren({
        parentId,
        skip,
        take = 100,
    }: {
        parentId?: string,
        skip?: number,
        take?: number,
    }): CancelablePromise<PagedRecycleBinItemResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/recycle-bin/document/children',
            query: {
                'parentId': parentId,
                'skip': skip,
                'take': take,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }

    /**
     * @returns PagedRecycleBinItemResponseModel Success
     * @throws ApiError
     */
    public static getRecycleBinDocumentRoot({
        skip,
        take = 100,
    }: {
        skip?: number,
        take?: number,
    }): CancelablePromise<PagedRecycleBinItemResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/recycle-bin/document/root',
            query: {
                'skip': skip,
                'take': take,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }

    /**
     * @returns PagedDocumentTreeItemResponseModel Success
     * @throws ApiError
     */
    public static getTreeDocumentChildren({
        parentId,
        skip,
        take = 100,
        dataTypeId,
        culture,
    }: {
        parentId?: string,
        skip?: number,
        take?: number,
        dataTypeId?: string,
        culture?: string,
    }): CancelablePromise<PagedDocumentTreeItemResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/tree/document/children',
            query: {
                'parentId': parentId,
                'skip': skip,
                'take': take,
                'dataTypeId': dataTypeId,
                'culture': culture,
            },
        });
    }

    /**
     * @returns PagedDocumentTreeItemResponseModel Success
     * @throws ApiError
     */
    public static getTreeDocumentRoot({
        skip,
        take = 100,
        dataTypeId,
        culture,
    }: {
        skip?: number,
        take?: number,
        dataTypeId?: string,
        culture?: string,
    }): CancelablePromise<PagedDocumentTreeItemResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/tree/document/root',
            query: {
                'skip': skip,
                'take': take,
                'dataTypeId': dataTypeId,
                'culture': culture,
            },
        });
    }

}
