/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CreateContentTypeForMediaTypeRequestModel } from './CreateContentTypeForMediaTypeRequestModel';
import type { MediaTypeCompositionModel } from './MediaTypeCompositionModel';
import type { MediaTypeSortModel } from './MediaTypeSortModel';
import type { ReferenceByIdModel } from './ReferenceByIdModel';

export type CreateMediaTypeRequestModel = (CreateContentTypeForMediaTypeRequestModel & {
    allowedMediaTypes: Array<MediaTypeSortModel>;
    compositions: Array<MediaTypeCompositionModel>;
    collection?: ReferenceByIdModel | null;
});

