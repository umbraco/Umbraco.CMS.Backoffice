import type { ConditionTypes } from '../conditions/types.js';
import type { ManifestElementAndApi, ManifestWithDynamicConditions } from '@umbraco-cms/backoffice/extension-api';

export interface ManifestDashboardApp extends ManifestElementAndApi, ManifestWithDynamicConditions<ConditionTypes> {
	type: 'dashboardApp';
	meta: MetaDashboardApp;
}

export interface MetaDashboardApp {
	headline?: string;
}
