/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PropertyTypeAppearance } from './PropertyTypeAppearance';
import type { PropertyTypeValidation } from './PropertyTypeValidation';

export type DocumentTypePropertyType = {
    key?: string;
    containerKey?: string | null;
    alias?: string;
    name?: string;
    description?: string | null;
    dataTypeKey?: string;
    validation?: PropertyTypeValidation;
    appearance?: PropertyTypeAppearance;
};

