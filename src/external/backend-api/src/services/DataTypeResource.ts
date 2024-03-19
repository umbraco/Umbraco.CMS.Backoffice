/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CopyDataTypeRequestModel } from '../models/CopyDataTypeRequestModel';
import type { CreateDataTypeRequestModel } from '../models/CreateDataTypeRequestModel';
import type { CreateFolderRequestModel } from '../models/CreateFolderRequestModel';
import type { DatatypeConfigurationResponseModel } from '../models/DatatypeConfigurationResponseModel';
import type { DataTypeItemResponseModel } from '../models/DataTypeItemResponseModel';
import type { DataTypeReferenceResponseModel } from '../models/DataTypeReferenceResponseModel';
import type { DataTypeResponseModel } from '../models/DataTypeResponseModel';
import type { FolderResponseModel } from '../models/FolderResponseModel';
import type { MoveDataTypeRequestModel } from '../models/MoveDataTypeRequestModel';
import type { PagedDataTypeItemResponseModel } from '../models/PagedDataTypeItemResponseModel';
import type { PagedDataTypeTreeItemResponseModel } from '../models/PagedDataTypeTreeItemResponseModel';
import type { UpdateDataTypeRequestModel } from '../models/UpdateDataTypeRequestModel';
import type { UpdateFolderResponseModel } from '../models/UpdateFolderResponseModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DataTypeResource {

    /**
     * @returns string Created
     * @throws ApiError
     */
    public static postDataType({
        requestBody,
    }: {
        requestBody?: CreateDataTypeRequestModel,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/management/api/v1/data-type',
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
    public static getDataTypeById({
        id,
    }: {
        id: string,
    }): CancelablePromise<DataTypeResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/data-type/{id}',
            path: {
                'id': id,
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
    public static deleteDataTypeById({
        id,
    }: {
        id: string,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/umbraco/management/api/v1/data-type/{id}',
            path: {
                'id': id,
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
    public static putDataTypeById({
        id,
        requestBody,
    }: {
        id: string,
        requestBody?: UpdateDataTypeRequestModel,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/management/api/v1/data-type/{id}',
            path: {
                'id': id,
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

    /**
     * @returns string Created
     * @throws ApiError
     */
    public static postDataTypeByIdCopy({
        id,
        requestBody,
    }: {
        id: string,
        requestBody?: CopyDataTypeRequestModel,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/management/api/v1/data-type/{id}/copy',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            responseHeader: 'Umb-Generated-Resource',
            errors: {
                401: `The resource is protected and requires an authentication token`,
                404: `Not Found`,
            },
        });
    }

    /**
     * @returns boolean Success
     * @throws ApiError
     */
    public static getDataTypeByIdIsUsed({
        id,
    }: {
        id: string,
    }): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/data-type/{id}/is-used',
            path: {
                'id': id,
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
    public static putDataTypeByIdMove({
        id,
        requestBody,
    }: {
        id: string,
        requestBody?: MoveDataTypeRequestModel,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/management/api/v1/data-type/{id}/move',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
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
    public static getDataTypeByIdReferences({
        id,
    }: {
        id: string,
    }): CancelablePromise<Array<DataTypeReferenceResponseModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/data-type/{id}/references',
            path: {
                'id': id,
            },
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
    public static getDataTypeConfiguration(): CancelablePromise<DatatypeConfigurationResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/data-type/configuration',
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

    /**
     * @returns string Created
     * @throws ApiError
     */
    public static postDataTypeFolder({
        requestBody,
    }: {
        requestBody?: CreateFolderRequestModel,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/management/api/v1/data-type/folder',
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
    public static getDataTypeFolderById({
        id,
    }: {
        id: string,
    }): CancelablePromise<FolderResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/data-type/folder/{id}',
            path: {
                'id': id,
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
    public static deleteDataTypeFolderById({
        id,
    }: {
        id: string,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/umbraco/management/api/v1/data-type/folder/{id}',
            path: {
                'id': id,
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
    public static putDataTypeFolderById({
        id,
        requestBody,
    }: {
        id: string,
        requestBody?: UpdateFolderResponseModel,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/management/api/v1/data-type/folder/{id}',
            path: {
                'id': id,
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

    /**
     * @returns PagedDataTypeItemResponseModel Success
     * @throws ApiError
     */
    public static getFilterDataType({
        skip,
        take = 100,
        name = '',
        editorUiAlias,
        editorAlias,
    }: {
        skip?: number,
        take?: number,
        name?: string,
        editorUiAlias?: string,
        editorAlias?: string,
    }): CancelablePromise<PagedDataTypeItemResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/filter/data-type',
            query: {
                'skip': skip,
                'take': take,
                'name': name,
                'editorUiAlias': editorUiAlias,
                'editorAlias': editorAlias,
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
    public static getItemDataType({
        id,
    }: {
        id?: Array<string>,
    }): CancelablePromise<Array<DataTypeItemResponseModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/item/data-type',
            query: {
                'id': id,
            },
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

    /**
     * @returns PagedDataTypeTreeItemResponseModel Success
     * @throws ApiError
     */
    public static getTreeDataTypeChildren({
        parentId,
        skip,
        take = 100,
        foldersOnly = false,
    }: {
        parentId?: string,
        skip?: number,
        take?: number,
        foldersOnly?: boolean,
    }): CancelablePromise<PagedDataTypeTreeItemResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/tree/data-type/children',
            query: {
                'parentId': parentId,
                'skip': skip,
                'take': take,
                'foldersOnly': foldersOnly,
            },
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

    /**
     * @returns PagedDataTypeTreeItemResponseModel Success
     * @throws ApiError
     */
    public static getTreeDataTypeRoot({
        skip,
        take = 100,
        foldersOnly = false,
    }: {
        skip?: number,
        take?: number,
        foldersOnly?: boolean,
    }): CancelablePromise<PagedDataTypeTreeItemResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/tree/data-type/root',
            query: {
                'skip': skip,
                'take': take,
                'foldersOnly': foldersOnly,
            },
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

}
