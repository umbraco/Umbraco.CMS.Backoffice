import type { UmbValidationContext } from './validation.context.js';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';

export const UMB_VALIDATION_CONTEXT = new UmbContextToken<UmbValidationContext>('UmbValidationContext');
