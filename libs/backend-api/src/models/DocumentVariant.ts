/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContentState } from './ContentState';

export type DocumentVariant = {
    culture?: string | null;
    segment?: string | null;
    name?: string;
    createDate?: string;
    updateDate?: string;
    state?: ContentState;
    publishDate?: string | null;
};

