import type { ConditionTypes } from '../conditions/types.js';
import type { UmbWorkspaceActionMenuItem } from '../../workspace/components/workspace-action-menu-item/workspace-action-menu-item.interface.js';
import type { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';
import type { ManifestElementAndApi, ManifestWithDynamicConditions } from '@umbraco-cms/backoffice/extension-api';

export interface ManifestWorkspaceActionMenuItem<
	MetaType extends MetaWorkspaceActionMenuItem = MetaWorkspaceActionMenuItem,
> extends ManifestElementAndApi<UmbControllerHostElement, UmbWorkspaceActionMenuItem<MetaType>>,
		ManifestWithDynamicConditions<ConditionTypes> {
	type: 'workspaceActionMenuItem';
	/**
	 * Define which workspace actions this menu item should be shown for.
	 * @examples [
	 * 	['Umb.WorkspaceAction.Document.Save', 'Umb.WorkspaceAction.Document.SaveAndPublish'],
	 * 	"Umb.WorkspaceAction.Document.Save"
	 * ]
	 * @required
	 */
	forWorkspaceActions: string | string[];
	meta: MetaType;
}

export interface MetaWorkspaceActionMenuItem {}

export interface ManifestWorkspaceActionMenuItemDefaultKind<
	MetaType extends MetaWorkspaceActionMenuItemDefaultKind = MetaWorkspaceActionMenuItemDefaultKind,
> extends ManifestWorkspaceActionMenuItem<MetaType> {
	type: 'workspaceActionMenuItem';
	kind: 'default';
}

export interface MetaWorkspaceActionMenuItemDefaultKind extends MetaWorkspaceActionMenuItem {
	/**
	 * An icon to represent the action to be performed
	 *
	 * @examples [
	 *   "icon-box",
	 *   "icon-grid"
	 * ]
	 */
	icon: string;

	/**
	 * The friendly name of the action to perform
	 *
	 * @examples [
	 *   "Create",
	 *   "Create Content Template"
	 * ]
	 */
	label: string;
}
