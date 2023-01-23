/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IOutputFormatter } from './IOutputFormatter';
import type { Type } from './Type';

export type CreatedResult = {
    value?: any;
    formatters?: Array<IOutputFormatter>;
    contentTypes?: Array<string>;
    declaredType?: Type;
    statusCode?: number | null;
    location?: string;
};

