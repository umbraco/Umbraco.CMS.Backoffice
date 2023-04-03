/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DocumentValueModel } from './DocumentValueModel';
import type { DocumentVariantRequestModel } from './DocumentVariantRequestModel';

export type CreateContentRequestModelBaseDocumentValueModelDocumentVariantRequestModel = {
    values?: Array<DocumentValueModel>;
    variants?: Array<DocumentVariantRequestModel>;
    parentKey?: string | null;
};
