import { UMB_TEMPLATE_HAS_NO_CHILDREN_CONDITION_ALIAS } from './const.js';

export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'condition',
		name: 'Template Has No Children Condition',
		alias: UMB_TEMPLATE_HAS_NO_CHILDREN_CONDITION_ALIAS,
		api: () => import('./template-has-no-children.condition.js'),
	},
];
