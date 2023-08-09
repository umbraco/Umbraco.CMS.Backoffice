import type { UmbExtensionCondition } from './condition/index.js';
import type { UmbEntryPointModule } from './entry-point.interface.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HTMLElementConstructor<T = HTMLElement> = new (...args: any[]) => T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClassConstructor<T = object> = new (...args: any[]) => T;

export type ManifestTypeMap<ManifestTypes extends ManifestBase> = {
	[Manifest in ManifestTypes as Manifest['type']]: Manifest;
} & {
	[key: string]: ManifestBase;
};

export type SpecificManifestTypeOrManifestBase<
	ManifestTypes extends ManifestBase,
	T extends keyof ManifestTypeMap<ManifestTypes> | string
> = T extends keyof ManifestTypeMap<ManifestTypes> ? ManifestTypeMap<ManifestTypes>[T] : ManifestBase;

export interface ManifestBase {
	/**
	 * The type of extension such as dashboard etc...
	 */
	type: string;

	/**
	 * The alias of the extension, ensure it is unique
	 */
	alias: string;

	/**
	 * The kind of the extension, used to group extensions together
	 *
	 * @examples ["button"]
	 */
	kind?: unknown; // I had to add the optional kind property set to undefined. To make the ManifestTypes recognize the Manifest Kind types. Notice that Kinds has to Omit the kind property when extending.

	/**
	 * The friendly name of the extension
	 */
	name: string;

	/**
	 * Extensions such as dashboards are ordered by weight with lower numbers being first in the list
	 */
	weight?: number;
}

export interface ManifestKind<ManifestTypes> {
	type: 'kind';
	alias: string;
	matchType: string;
	matchKind: string;
	manifest: Partial<ManifestTypes>;
}

// TODO: Get rid of this type and implements ManifestWithDynamicConditions instead.
export interface ManifestWithConditions<ConditionType> {
	/**
	 * Set the conditions for when the extension should be loaded
	 */
	conditions: ConditionType;
}

export interface UmbConditionConfigBase<AliasType extends string = string> {
	alias: AliasType;
}

export type ConditionTypeMap<ConditionTypes extends UmbConditionConfigBase> = {
	[Condition in ConditionTypes as Condition['alias']]: Condition;
} & {
	[key: string]: UmbConditionConfigBase;
};

export type SpecificConditionTypeOrUmbConditionConfigBase<
	ConditionTypes extends UmbConditionConfigBase,
	T extends keyof ConditionTypeMap<ConditionTypes> | string
> = T extends keyof ConditionTypeMap<ConditionTypes> ? ConditionTypeMap<ConditionTypes>[T] : UmbConditionConfigBase;

export interface ManifestWithDynamicConditions<ConditionTypes extends UmbConditionConfigBase = UmbConditionConfigBase>
	extends ManifestBase {
	/**
	 * Set the conditions for when the extension should be loaded
	 */
	conditions?: Array<ConditionTypes>;
	/**
	 * Define one or more extension aliases that this extension should overwrite.
	 */
	overwrites?: string | Array<string>;
}

export interface ManifestWithLoader<LoaderReturnType> extends ManifestBase {
	/**
	 * @TJS-ignore
	 */
	loader?: () => Promise<LoaderReturnType>;
}

/**
 * The type of extension such as dashboard etc...
 */
export interface ManifestClass<ClassType = unknown>
	extends ManifestWithLoader<{ default: ClassConstructor<ClassType> }> {
	/**
	 * @TJS-ignore
	 */
	readonly CLASS_TYPE?: ClassType;

	/**
	 * The file location of the javascript file to load
	 * @TJS-required
	 */
	js?: string;

	/**
	 * @TJS-ignore
	 */
	className?: string;

	/**
	 * @TJS-ignore
	 */
	class?: ClassConstructor<ClassType>;
}

export interface ManifestClassWithClassConstructor<T = unknown> extends ManifestClass<T> {
	class: ClassConstructor<T>;
}

export interface ManifestWithLoaderIncludingDefaultExport<T = unknown>
	extends ManifestWithLoader<{ default: T } | Omit<object, 'default'>> {
	/**
	 * The file location of the javascript file to load
	 */
	js?: string;
}

export interface ManifestElement<ElementType extends HTMLElement = HTMLElement>
	extends ManifestWithLoader<{ default: ClassConstructor<ElementType> } | Omit<object, 'default'>> {
	/**
	 * @TJS-ignore
	 */
	readonly ELEMENT_TYPE?: ElementType;

	/**
	 * The file location of the javascript file to load
	 *
	 * @TJS-require
	 */
	js?: string;

	/**
	 * The HTML web component name to use such as 'my-dashboard'
	 * Note it is NOT <my-dashboard></my-dashboard> but just the name
	 */
	elementName?: string;

	/**
	 * This contains properties specific to the type of extension
	 */
	meta?: unknown;
}

export interface ManifestWithView<ElementType extends HTMLElement = HTMLElement> extends ManifestElement<ElementType> {
	meta: MetaManifestWithView;
}

export interface MetaManifestWithView {
	pathname: string;
	label: string;
	icon: string;
}

export interface ManifestElementWithElementName extends ManifestElement {
	/**
	 * The HTML web component name to use such as 'my-dashboard'
	 * Note it is NOT <my-dashboard></my-dashboard> but just the name
	 */
	elementName: string;
}

export interface ManifestWithMeta extends ManifestBase {
	/**
	 * This contains properties specific to the type of extension
	 */
	meta: unknown;
}

/**
 * This type of extension gives full control and will simply load the specified JS file
 * You could have custom logic to decide which extensions to load/register by using extensionRegistry
 */
export interface ManifestEntryPoint extends ManifestWithLoader<UmbEntryPointModule> {
	type: 'entryPoint';

	/**
	 * The file location of the javascript file to load in the backoffice
	 */
	js?: string;
}

/**
 * This type of extension takes a JS module and registers all exported manifests from the pointed JS file.
 */
export interface ManifestBundle<UmbManifestTypes extends ManifestBase = ManifestBase>
	extends ManifestWithLoader<{ [key: string]: Array<UmbManifestTypes> }> {
	type: 'bundle';

	/**
	 * The file location of the javascript file to load in the backoffice
	 */
	js?: string;
}

/**
 * This type of extension takes a JS module and registers all exported manifests from the pointed JS file.
 */
export interface ManifestCondition extends ManifestClass<UmbExtensionCondition> {
	type: 'condition';

	/**
	 * The file location of the javascript file to load in the backoffice
	 */
	js?: string;
}
