/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MediaValueModel } from './MediaValueModel';
import type { MediaVariantRequestModel } from './MediaVariantRequestModel';
import type { ReferenceByIdModel } from './ReferenceByIdModel';

export type CreateContentForMediaRequestModel = {
    values: Array<MediaValueModel>;
    variants: Array<MediaVariantRequestModel>;
    id?: string | null;
    parent?: ReferenceByIdModel | null;
};

