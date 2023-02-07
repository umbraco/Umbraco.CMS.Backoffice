/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContentTypeCleanup } from './ContentTypeCleanup';
import type { ContentTypeComposition } from './ContentTypeComposition';
import type { ContentTypeSort } from './ContentTypeSort';
import type { DocumentTypePropertyType } from './DocumentTypePropertyType';
import type { DocumentTypePropertyTypeContainer } from './DocumentTypePropertyTypeContainer';

export type DocumentType = {
    key?: string;
    alias?: string;
    name?: string;
    description?: string | null;
    icon?: string;
    allowedAsRoot?: boolean;
    variesByCulture?: boolean;
    variesBySegment?: boolean;
    isElement?: boolean;
    properties?: Array<DocumentTypePropertyType>;
    containers?: Array<DocumentTypePropertyTypeContainer>;
    allowedContentTypes?: Array<ContentTypeSort>;
    compositions?: Array<ContentTypeComposition>;
    cleanup?: ContentTypeCleanup;
    allowedTemplateKeys?: Array<string>;
    defaultTemplateKey?: string | null;
};

