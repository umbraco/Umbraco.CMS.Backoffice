import type { UmbWorkspaceContextInterface } from '@umbraco-cms/backoffice/workspace';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';

export const UMB_PROPERTY_TYPE_WORKSPACE_ALIAS = 'Umb.Workspace.PropertyType';

/**
 * This is a very simplified workspace context, just to serve one for the imitated property type workspace. (As its not a real workspace, but this does as well provide the ability for extension-conditions to match with this workspace, as entity type and alias is available.)  [NL]
 */
export class UmbPropertyTypeWorkspaceContext
	extends UmbContextBase<UmbPropertyTypeWorkspaceContext>
	implements UmbWorkspaceContextInterface
{
	constructor(host: UmbControllerHost) {
		super(host, UMB_PROPERTY_TYPE_WORKSPACE_CONTEXT);
	}

	get workspaceAlias() {
		return UMB_PROPERTY_TYPE_WORKSPACE_ALIAS;
	}

	getUnique() {
		return undefined;
	}

	getEntityType() {
		return 'property-type';
	}
}

export default UmbPropertyTypeWorkspaceContext;

export const UMB_PROPERTY_TYPE_WORKSPACE_CONTEXT = new UmbContextToken<
	UmbWorkspaceContextInterface,
	UmbPropertyTypeWorkspaceContext
>(
	'UmbWorkspaceContext',
	undefined,
	(context): context is UmbPropertyTypeWorkspaceContext => context.getEntityType() === 'property-type',
);
