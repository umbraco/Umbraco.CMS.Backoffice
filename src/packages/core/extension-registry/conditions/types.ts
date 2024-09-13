import type { CollectionAliasConditionConfig } from '../../collection/collection-alias.manifest.js';
import type { CollectionBulkActionPermissionConditionConfig } from '../../collection/collection-bulk-action-permission.manifest.js';
import type { UmbSectionUserPermissionConditionConfig } from '../../section/conditions/index.js';
import type { SectionAliasConditionConfig } from './section-alias.condition.js';
import type { SwitchConditionConfig } from './switch.condition.js';
import type { UmbConditionConfigBase } from '@umbraco-cms/backoffice/extension-api';
import type { UmbDocumentUserPermissionConditionConfig } from '@umbraco-cms/backoffice/document';

export type ConditionTypes =
	| CollectionAliasConditionConfig
	| CollectionBulkActionPermissionConditionConfig
	| SectionAliasConditionConfig
	| SwitchConditionConfig
	| UmbConditionConfigBase
	| UmbDocumentUserPermissionConditionConfig
	| UmbSectionUserPermissionConditionConfig;

type UnionOfProperties<T> = T extends object ? T[keyof T] : never;

declare global {
	/**
	 * This global type allows to declare condition types from its own module.
	 * @example
	 ```js
 	 	declare global {
 	 		interface UmbExtensionConditionMap {
 	 			My_UNIQUE_CONDITION_NAME: MyExtensionConditionType;
  		}
  	}
  	```
	 If you have multiple types, you can declare them in this way:
	 ```js
		declare global {
			interface UmbExtensionConditionMap {
				My_UNIQUE_CONDITION_NAME: MyExtensionConditionTypeA | MyExtensionConditionTypeB;
			}
		}
	 ```
	 */
	interface UmbExtensionConditionMap {
		UMB_CORE: ConditionTypes;
	}

	/**
	 * This global type provides a union of all declared manifest types.
	 * If this is a local package that declares additional Manifest Types, then these will also be included in this union.
	 */
	type UmbExtensionCondition = UnionOfProperties<UmbExtensionConditionMap>;
}
