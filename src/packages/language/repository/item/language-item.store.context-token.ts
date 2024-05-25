import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import type { UmbLanguageItemStore } from './language-item.store.js';

export const UMB_LANGUAGE_ITEM_STORE_CONTEXT = new UmbContextToken<UmbLanguageItemStore>('UmbLanguageItemStore');
