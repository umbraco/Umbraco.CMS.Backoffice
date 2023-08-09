import { ManifestTypes } from '../extension-registry/index.js';
import { ManifestTranslations } from '../extension-registry/models/translations.model.js';

const translationManifests: Array<ManifestTranslations> = [
	{
		type: 'translations',
		alias: 'Umb.Translations.En_US',
		weight: -100,
		name: 'English (US)',
		meta: {
			culture: 'en-us',
		},
		loader: () => import('../../../assets/lang/en-us.js'),
	},
	{
		type: 'translations',
		alias: 'Umb.Translations.Da_DK',
		weight: -100,
		name: 'Dansk (Danmark)',
		meta: {
			culture: 'da-dk',
		},
		loader: () => import('../../../assets/lang/da-dk.js'),
	},
];

export const manifests: Array<ManifestTypes> = [...translationManifests];
