/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DictionaryTranslationOverview } from './DictionaryTranslationOverview';

export type DictionaryOverview = {
    name?: string;
    key?: string;
    level?: number;
    readonly translations?: Array<DictionaryTranslationOverview>;
};

