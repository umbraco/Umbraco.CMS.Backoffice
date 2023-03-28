import { ManifestLoaderType } from './load-extension.function';
import type { ManifestBase } from '@umbraco-cms/backoffice/extensions-registry';

export function isManifestLoaderType(manifest: ManifestBase): manifest is ManifestLoaderType {
	return typeof (manifest as ManifestLoaderType).loader === 'function';
}
