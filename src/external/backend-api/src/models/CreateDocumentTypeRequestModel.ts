/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContentTypeCleanupModel } from './ContentTypeCleanupModel';
import type { CreateContentTypeForDocumentTypeRequestModel } from './CreateContentTypeForDocumentTypeRequestModel';

export type CreateDocumentTypeRequestModel = (CreateContentTypeForDocumentTypeRequestModel & {
    allowedTemplateIds: Array<string>;
    defaultTemplateId?: string | null;
    cleanup: ContentTypeCleanupModel;
});

