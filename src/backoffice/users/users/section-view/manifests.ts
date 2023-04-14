import { UMB_USER_SECTION_ALIAS } from '../../user-section/manifests';
import type { ManifestSectionView } from '@umbraco-cms/backoffice/extensions-registry';

const sectionsViews: Array<ManifestSectionView> = [
	{
		type: 'sectionView',
		alias: 'Umb.SectionView.Users',
		name: 'Users Section View',
		loader: () => import('./section-view-users.element'),
		weight: 200,
		meta: {
			label: 'Users',
			pathname: 'users',
			icon: 'umb:user',
		},
		conditions: {
			sections: [UMB_USER_SECTION_ALIAS],
		},
	},
];

export const manifests = [...sectionsViews];
