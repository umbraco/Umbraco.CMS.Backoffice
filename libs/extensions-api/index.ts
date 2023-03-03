import { UmbExtensionRegistry } from './registry/extension.registry';

export * from './registry/extension.registry';
export * from './create-extension-element.function';
export * from './has-default-export.function';
export * from './has-init-export.function';
export * from './is-manifest-element-name-type.function';
export * from './is-manifest-elementable-type.function';
export * from './is-manifest-js-type.function';
export * from './is-manifest-loader-type.function';
export * from './load-extension.function';
export * from './create-extension-element-or-fallback.function';
export * from './create-extension-class.function';
export * from './umb-lifecycle.interface';

export const umbExtensionsRegistry = new UmbExtensionRegistry();
