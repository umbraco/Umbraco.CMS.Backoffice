import { v4 as uuid } from 'uuid';
import { UmbEntityData } from './entity.data';
import { createEntityTreeItem } from './utils';
import {
	EntityTreeItemResponseModel,
	PagedEntityTreeItemResponseModel,
	TemplateResponseModel,
	TemplateModelBaseModel,
	TemplateScaffoldResponseModel,
} from '@umbraco-cms/backoffice/backend-api';

type TemplateDBItem = TemplateResponseModel & EntityTreeItemResponseModel;

const createTemplate = (dbItem: TemplateDBItem): TemplateResponseModel => {
	return {
		$type: '',
		id: dbItem.id,
		name: dbItem.name,
		alias: dbItem.alias,
		content: dbItem.content,
	};
};

export const data: Array<TemplateDBItem> = [
	{
		$type: '',
		id: '2bf464b6-3aca-4388-b043-4eb439cc2643',
		isContainer: false,
		parentId: null,
		name: 'Doc 1',
		type: 'template',
		icon: 'icon-layout',
		hasChildren: false,
		alias: 'Doc1',
		content: `@using Umbraco.Extensions
		@inherits Umbraco.Cms.Web.Common.Views.UmbracoViewPage<Umbraco.Cms.Core.Models.Blocks.BlockGridItem>
		@{
			if (Model?.Areas.Any() != true) { return; }
		}

		<div class="umb-block-grid__area-container"
			 style="--umb-block-grid--area-grid-columns: @(Model.AreaGridColumns?.ToString() ?? Model.GridColumns?.ToString() ?? "12");">
			@foreach (var area in Model.Areas)
			{
				@await Html.GetBlockGridItemAreaHtmlAsync(area)
			}
		</div>`,
	},
	{
		$type: '',
		id: '9a84c0b3-03b4-4dd4-84ac-706740ac0f71',
		isContainer: false,
		parentId: null,
		name: 'Test',
		type: 'template',
		icon: 'icon-layout',
		hasChildren: true,
		alias: 'Test',
		content:
			'@using Umbraco.Cms.Web.Common.PublishedModels;\n@inherits Umbraco.Cms.Web.Common.Views.UmbracoViewPage<ContentModels.Test>\r\n@using ContentModels = Umbraco.Cms.Web.Common.PublishedModels;\r\n@{\r\n\tLayout = null;\r\n}',
	},
	{
		$type: '',
		id: '9a84c0b3-03b4-4dd4-84ac-706740ac0f72',
		isContainer: false,
		parentId: '9a84c0b3-03b4-4dd4-84ac-706740ac0f71',
		name: 'Child',
		type: 'template',
		icon: 'icon-layout',
		hasChildren: false,
		alias: 'Test',
		content:
			'@using Umbraco.Cms.Web.Common.PublishedModels;\n@inherits Umbraco.Cms.Web.Common.Views.UmbracoViewPage<ContentModels.Test>\r\n@using ContentModels = Umbraco.Cms.Web.Common.PublishedModels;\r\n@{\r\n\tLayout = null;\r\n}',
	},
];

export const createTemplateScaffold = (masterTemplateAlias: string) => {
	return `Template Scaffold Mock for master template: ${masterTemplateAlias}`;
};

// Temp mocked database
// TODO: all properties are optional in the server schema. I don't think this is correct.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
class UmbTemplateData extends UmbEntityData<TemplateDBItem> {
	constructor() {
		super(data);
	}

	getById(id: string): TemplateResponseModel | undefined {
		const item = this.data.find((item) => item.id === id);
		return item ? createTemplate(item) : undefined;
	}

	getScaffold(masterTemplateAlias: string): TemplateScaffoldResponseModel {
		return {
			content: `Template Scaffold Mock: Layout = ${masterTemplateAlias || null};`,
		};
	}

	create(templateData: TemplateModelBaseModel) {
		const template = {
			$type: '',
			id: uuid(),
			...templateData,
		};
		this.data.push(template);
		return template;
	}

	update(template: TemplateResponseModel) {
		this.updateData(template);
		return template;
	}

	getTreeRoot(): PagedEntityTreeItemResponseModel {
		const items = this.data.filter((item) => item.parentId === null);
		const treeItems = items.map((item) => createEntityTreeItem(item));
		const total = items.length;
		return { items: treeItems, total };
	}

	getTreeItemChildren(id: string): PagedEntityTreeItemResponseModel {
		const items = this.data.filter((item) => item.parentId === id);
		const treeItems = items.map((item) => createEntityTreeItem(item));
		const total = items.length;
		return { items: treeItems, total };
	}

	getTreeItem(ids: Array<string>): Array<EntityTreeItemResponseModel> {
		const items = this.data.filter((item) => ids.includes(item.id ?? ''));
		return items.map((item) => createEntityTreeItem(item));
	}
}

export const umbTemplateData = new UmbTemplateData();
