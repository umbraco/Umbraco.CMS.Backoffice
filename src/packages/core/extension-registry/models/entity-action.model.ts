import type { ConditionTypes } from '../conditions/types.js';
import type { ManifestElementAndApi, ManifestWithDynamicConditions } from '@umbraco-cms/backoffice/extension-api';

/**
 * An action to perform on an entity
 * For example for content you may wish to create a new document etc
 */
// TODO: create interface for API
export interface ManifestEntityAction extends ManifestElementAndApi, ManifestWithDynamicConditions<ConditionTypes> {
	type: 'entityAction';
	meta: MetaEntityAction;
}

export interface MetaEntityAction {
	/**
	 * An icon to represent the action to be performed
	 *
	 * @examples [
	 *   "icon-box",
	 *   "icon-grid"
	 * ]
	 */
	icon?: string;

	/**
	 * The friendly name of the action to perform
	 *
	 * @examples [
	 *   "Create",
	 *   "Create Content Template"
	 * ]
	 */
	label: string;

	/**
	 * The alias for the repository of the entity type this action is for
	 * such as 'Umb.Repository.Documents'
	 * @examples [
	 *   "Umb.Repository.Documents"
	 * ]
	 */
	repositoryAlias: string;

	/**
	 * The entity types that this action can be performed on
	 * @examples [
	 * "data-type",
	 * "data-type-folder",
	 * "document",
	 * "document-root",
	 * "document-type",
	 * "dictionary-item",
	 * "language",
	 * "language-root",
	 * "member",
	 * "member-group",
	 * "member-type",
	 * "template",
	 * "template-root",
	 * "partial-view"
	 * ]
	 */
	entityTypes: Array<string>;
}
