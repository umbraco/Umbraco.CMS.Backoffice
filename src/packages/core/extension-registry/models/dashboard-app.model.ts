import type { ConditionTypes } from '../conditions/types.js';
import type { ManifestElement, ManifestWithDynamicConditions } from '@umbraco-cms/backoffice/extension-api';

export interface ManifestDashboardApp extends ManifestElement, ManifestWithDynamicConditions<ConditionTypes> {
	type: 'dashboardApp';
}
