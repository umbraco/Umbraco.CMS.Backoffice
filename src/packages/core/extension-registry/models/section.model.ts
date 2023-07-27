import type { UmbSectionExtensionElement } from '../interfaces/index.js';
import type { ManifestElement } from '@umbraco-cms/backoffice/extension-api';

export interface ManifestSection extends ManifestElement<UmbSectionExtensionElement> {
	type: 'section';
	meta: MetaSection;
}

export interface MetaSection {
	label: string;
	pathname: string;
}
