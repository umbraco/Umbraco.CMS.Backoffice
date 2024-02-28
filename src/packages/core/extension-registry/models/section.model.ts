import type { UmbSectionElement } from '../interfaces/index.js';
import type {
	ManifestElement,
	ManifestWithDynamicConditions,
	ConditionTypes,
} from '@umbraco-cms/backoffice/extension-api';

export interface ManifestSection
	extends ManifestElement<UmbSectionElement>,
		ManifestWithDynamicConditions<ConditionTypes> {
	type: 'section';
	meta: MetaSection;
}

export interface MetaSection {
	label: string;
	pathname: string;
}
