/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Field } from './Field';

export type SearchResult = {
    id?: string;
    score?: number;
    readonly fieldCount?: number;
    fields?: Array<Field>;
};

