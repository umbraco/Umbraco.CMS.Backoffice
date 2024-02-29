import type { ConditionTypes } from '../conditions/types.js';
import type { MetaEntityAction } from './entity-action.model.js';
import type { ManifestElementAndApi, ManifestWithDynamicConditions } from '@umbraco-cms/backoffice/extension-api';
import type { UmbWorkspaceAction } from '@umbraco-cms/backoffice/workspace';

export interface ManifestWorkspaceActionMenuItem
	extends ManifestElementAndApi<HTMLElement, UmbWorkspaceAction>,
		ManifestWithDynamicConditions<ConditionTypes> {
	type: 'workspaceActionMenuItem';
	meta: MetaWorkspaceActionMenuItem;
}

export interface MetaWorkspaceActionMenuItem extends MetaEntityAction {
	/**
	 * Define which workspace actions this menu item should be shown for.
	 * @examples [
	 * 	['Umb.WorkspaceAction.Document.Save', 'Umb.WorkspaceAction.Document.SaveAndPublish'],
	 * 	"Umb.WorkspaceAction.Document.Save"
	 * ]
	 * @required
	 */
	workspaceActions: string | string[];
}
