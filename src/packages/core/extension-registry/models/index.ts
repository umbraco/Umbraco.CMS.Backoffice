import type { ManifestBase, ManifestBundle, ManifestCondition } from '@umbraco-cms/backoffice/extension-api';

export type ManifestTypes = ManifestBundle<ManifestTypes> | ManifestCondition | ManifestBase;

type UnionOfProperties<T> = T extends object ? T[keyof T] : never;

declare global {
	/**
	 * This global type allows to declare manifests types from its own module.
	 * @example
	 ```js
 	 	declare global {
 	 		interface UmbExtensionManifestMap {
 	 			My_UNIQUE_MANIFEST_NAME: MyExtensionManifestType;
  		}
  	}
  	```
	 If you have multiple types, you can declare them in this way:
	 ```js
		declare global {
			interface UmbExtensionManifestMap {
				My_UNIQUE_MANIFEST_NAME: MyExtensionManifestTypeA | MyExtensionManifestTypeB;
			}
		}
	 ```
	 */
	interface UmbExtensionManifestMap {
		UMB_CORE: ManifestTypes;
	}

	/**
	 * This global type provides a union of all declared manifest types.
	 * If this is a local package that declares additional Manifest Types, then these will also be included in this union.
	 */
	type UmbExtensionManifest = UnionOfProperties<UmbExtensionManifestMap>;
}
