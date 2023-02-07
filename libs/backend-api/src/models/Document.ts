/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContentUrlInfo } from './ContentUrlInfo';
import type { DocumentProperty } from './DocumentProperty';
import type { DocumentVariant } from './DocumentVariant';

export type Document = {
    key?: string;
    contentTypeKey?: string;
    properties?: Array<DocumentProperty>;
    variants?: Array<DocumentVariant>;
    urls?: Array<ContentUrlInfo>;
    templateKey?: string | null;
};

