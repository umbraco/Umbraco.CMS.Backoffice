import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import type { UmbLanguageDetailStore } from './language-detail.store.js';

export const UMB_LANGUAGE_DETAIL_STORE_CONTEXT = new UmbContextToken<UmbLanguageDetailStore>('UmbLanguageDetailStore');
