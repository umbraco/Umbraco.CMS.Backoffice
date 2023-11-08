/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContentTypeCompositionModel } from './ContentTypeCompositionModel';
import type { ContentTypeSortModel } from './ContentTypeSortModel';
import type { CreateDocumentTypePropertyTypeContainerRequestModel } from './CreateDocumentTypePropertyTypeContainerRequestModel';
import type { CreateDocumentTypePropertyTypeRequestModel } from './CreateDocumentTypePropertyTypeRequestModel';

export type CreateContentTypeForDocumentTypeRequestModel = {
    alias?: string;
    name?: string;
    description?: string | null;
    icon?: string;
    allowedAsRoot?: boolean;
    variesByCulture?: boolean;
    variesBySegment?: boolean;
    isElement?: boolean;
    properties?: Array<CreateDocumentTypePropertyTypeRequestModel>;
    containers?: Array<CreateDocumentTypePropertyTypeContainerRequestModel>;
    allowedContentTypes?: Array<ContentTypeSortModel>;
    compositions?: Array<ContentTypeCompositionModel>;
    id?: string | null;
    containerId?: string | null;
};

