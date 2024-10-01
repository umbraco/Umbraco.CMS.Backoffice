import type { ConditionTypes } from '../extension-registry/conditions/types.js';
import type { ManifestElement, ManifestWithDynamicConditions } from '@umbraco-cms/backoffice/extension-api';

export interface ManifestDashboardApp extends ManifestElement, ManifestWithDynamicConditions<ConditionTypes> {
	type: 'dashboardApp';
}

declare global {
	interface UmbExtensionManifestMap {
		umbDashboardApp: ManifestDashboardApp;
	}
}
