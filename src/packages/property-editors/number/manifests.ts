import { manifests as decimalSchemaManifests } from './Umbraco.Decimal.js';
import { manifests as integerSchemaManifests } from './Umbraco.Integer.js';
import type { ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes> = [
	{
		type: 'propertyEditorUi',
		alias: 'Umb.PropertyEditorUi.Decimal',
		name: 'Decimal Property Editor UI',
		element: () => import('./property-editor-ui-number.element.js'),
		meta: {
			label: 'Decimal',
			propertyEditorSchemaAlias: 'Umbraco.Decimal',
			icon: 'icon-autofill',
			group: 'common',
			settings: {
				properties: [],
				defaultData: [
					{
						alias: 'step',
						value: '0.01',
					},
				],
			},
		},
	},
	{
		type: 'propertyEditorUi',
		alias: 'Umb.PropertyEditorUi.Number',
		name: 'Number Property Editor UI',
		element: () => import('./property-editor-ui-number.element.js'),
		meta: {
			label: 'Number',
			icon: 'icon-autofill',
			group: 'common',
			propertyEditorSchemaAlias: 'Umbraco.Integer',
		},
	},
	...decimalSchemaManifests,
	...integerSchemaManifests,
];
