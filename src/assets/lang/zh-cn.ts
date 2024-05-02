/**
 * Creator Name: 黄仁祥(wanddy@163.com)
 * Creator Link: https://docs.umbraco.com/umbraco-cms/extending/language-files
 *
 * Language Alias: zh
 * Language Int Name: Chinese (Simple) (CN)
 * Language Local Name: 中文（简体，中国
 * Language LCID: 0804
 * Language Culture: zh-CN
 */
import type { UmbLocalizationDictionary } from '@umbraco-cms/backoffice/localization-api';
export default {
	actions: {
		assigndomain: '管理主机名',
		auditTrail: '跟踪审计',
		browse: '浏览节点',
		changeDocType: '改变文档类型',
		copy: '复制',
		create: '创建',
		createPackage: '创建扩展包',
		delete: '删除',
		disable: '禁用',
		emptyrecyclebin: '清空回收站',
		exportDocumentType: '导出文档类型',
		importdocumenttype: '导入文档类型',
		importPackage: '导入扩展包',
		liveEdit: '实时编辑模式',
		logout: '退出',
		move: '移动',
		notify: '提醒',
		protect: '公众访问权限',
		publish: '发布',
		unpublish: '取消发布',
		refreshNode: '重新加载节点',
		republish: '重新发布整站',
		restore: '恢复',
		chooseWhereToMove: '选择移动目的地',
		toInTheTreeStructureBelow: '到下列的树结构中',
		rights: '权限',
		rollback: '回滚',
		sendtopublish: '提交至发布者',
		sendToTranslate: '发送给翻译',
		sort: '排序',
		translate: '翻译',
		update: '更新',
		defaultValue: '默认值',
	},
	assignDomain: {
		permissionDenied: '禁止访问',
		addNew: '添加域名',
		remove: '移除',
		invalidNode: '错误的节点',
		invalidDomain: '域名错误',
		duplicateDomain: '域名重复',
		language: '语言',
		domain: '域名',
		domainCreated: "新域名 '%0%' 已创建",
		domainDeleted: "域名 '%0%' 已删除",
		domainExists: "域名 '%0%' 已使用",
		domainUpdated: "域名 '%0%' 已更新",
		orEdit: '编辑当前域名',
		inherit: '继承',
		setLanguage: '语言',
		setLanguageHelp: '为当前节点及子节点设置语言，<br />\n       也可以从父节点继承。',
		setDomains: '域名',
	},
	auditTrails: {
		atViewingFor: '查看',
	},
	buttons: {
		clearSelection: '清除选择',
		select: '选择',
		somethingElse: '其它功能',
		bold: '粗体',
		deindent: '取消段落缩进',
		formFieldInsert: '插入表单字段',
		graphicHeadline: '插入图片标题',
		htmlEdit: '编辑Html',
		indent: '段落缩进',
		italic: '斜体',
		justifyCenter: '居中',
		justifyLeft: '左对齐',
		justifyRight: '右对齐',
		linkInsert: '插入链接',
		linkLocal: '插入本地链接（锚点）',
		listBullet: '圆点列表',
		listNumeric: '数字列表',
		macroInsert: '插入宏',
		pictureInsert: '插入图片',
		relations: '编辑关联',
		returnToList: '返回列表',
		save: '保存',
		saveAndPublish: '保存并发布',
		saveToPublish: '保存并提交审核',
		saveListView: '保存列表视图',
		saveAndPreview: '预览',
		showPageDisabled: '因未设置模板无法预览',
		styleChoose: '选择样式',
		styleShow: '显示样式',
		tableInsert: '插入表格',
	},
	content: {
		isPublished: '已发布',
		about: '关于本页',
		alias: '别名',
		alternativeTextHelp: '（图片的替代文本）',
		alternativeUrls: '替代链接',
		clickToEdit: '点击编辑',
		createBy: '创建者',
		createByDesc: '原作者',
		updatedBy: '更新者',
		createDate: '创建时间',
		createDateDesc: '创建此文档的日期/时间',
		documentType: '文档类型',
		editing: '编辑',
		expireDate: '过期于',
		itemChanged: '该项发布之后有更改',
		itemNotPublished: '该项没有发布',
		lastPublished: '最近发布',
		noItemsToShow: '没有要显示的项目',
		listViewNoItems: '列表中没有要显示的项目。',
		mediatype: '媒体类型',
		mediaLinks: '媒体链接地址',
		membergroup: '会员组',
		memberrole: '角色',
		membertype: '会员类型',
		noDate: '没有选择时间',
		nodeName: '页标题',
		otherElements: '属性',
		parentNotPublished: "该文档不可见，因为其上级 '%0%' 未发布。",
		parentNotPublishedAnomaly: '该文档已发布，但是没有更新至缓存（内部错误）',
		getUrlException: 'Could not get the URL',
		routeError: 'This document is published but its URL would collide with content %0%',
		publish: '发布',
		publishStatus: '发布状态',
		releaseDate: '发布于',
		unpublishDate: '取消发布于',
		removeDate: '清空时间',
		sortDone: '排序完成',
		sortHelp: '拖拽项目或单击列头即可排序，可以按住Shift多选。',
		statistics: '统计',
		titleOptional: '标题（可选）',
		altTextOptional: 'Alternative text (optional)',
		type: '类型',
		unpublish: '取消发布',
		updateDate: '最近编辑',
		updateDateDesc: '编辑此文档的日期/时间',
		uploadClear: '移除文件',
		urls: '链接到文档',
		memberof: '会员组成员',
		notmemberof: '非会员组成员',
		childItems: '子项',
		target: '目标',
		scheduledPublishServerTime: '这将转换到服务器上的以下时间:',
		scheduledPublishDocumentation:
			'<a href="https://docs.umbraco.com/umbraco-cms/fundamentals/data/scheduled-publishing#timezones" target="_blank" rel="noopener">这是什么意思？</a>',
	},
	media: {
		clickToUpload: '点击上传',
		orClickHereToUpload: '或单击此处选择文件',
		maxFileSize: '最大文件大小为',
	},
	member: {
		createNewMember: '创建新成员',
		allMembers: '所有成员',
	},
	create: {
		chooseNode: '您想在哪里创建 %0%',
		createUnder: '创建在',
		updateData: '选择类型和标题',
		noDocumentTypes: '没有允许的文档类型可用。必须在 <strong> "文档类型" </strong> 下的 "设置" 部分中启用这些内容。',
		noMediaTypes: '没有允许的媒体类型可用。必须在 <strong> "媒体类型" </strong> 下的 "设置" 部分中启用这些内容。',
		documentTypeWithoutTemplate: '没有模板的文档类型',
		newFolder: '新建文件夹',
		newDataType: '新数据类型',
	},
	dashboard: {
		browser: '浏览您的网站',
		dontShowAgain: '- 隐藏',
		nothinghappens: '如果Umbraco没有打开，您可能需要允许弹出式窗口。',
		openinnew: '已经在新窗口中打开',
		restart: '重启',
		visit: '访问',
		welcome: '欢迎',
	},
	prompt: {
		stay: '保持',
		discardChanges: '丢弃更改',
		unsavedChanges: '您有未保存的更改',
		unsavedChangesWarning: '确实要离开此页吗？-您有未保存的更改',
	},
	bulk: {
		done: '完成',
		deletedItem: '已删除 %0% 项',
		deletedItems: '已删除 %0% 项',
		deletedItemOfItem: '已删除 %0% 项，共 %1% 项',
		deletedItemOfItems: '已删除 %0% 项，共 %1% 项',
		publishedItem: '已发布 %0% 项',
		publishedItems: '已发布 %0% 项',
		publishedItemOfItem: '已发布 %0% 项，共 %1% 项',
		publishedItemOfItems: '已发布 %0% 项，共 %1% 项',
		unpublishedItem: '已取消发布 %0% 项',
		unpublishedItems: '已取消发布 %0% 项',
		unpublishedItemOfItem: '已取消发布 %0% 项，共 %1% 项',
		unpublishedItemOfItems: '已取消发布 %0% 项，共 %1% 项',
		movedItem: '已移动 %0% 项',
		movedItems: '已移动 %0% 项',
		movedItemOfItem: '已移动 %0% 项，共 %1% 项',
		movedItemOfItems: '已移动 %0% 项，共 %1% 项',
		copiedItem: '已复制 %0% 项',
		copiedItems: '已复制 %0% 项',
		copiedItemOfItem: '已复制 %0% 项，共 %1% 项',
		copiedItemOfItems: '已复制 %0% 项，共 %1% 项',
	},
	defaultdialogs: {
		anchorInsert: '锚点名称',
		assignDomain: '管理主机名',
		closeThisWindow: '关闭窗口',
		confirmdelete: '您确定要删除吗',
		confirmdisable: '您确定要禁用吗',
		confirmlogout: '您确定吗?',
		confirmSure: '您确定吗？',
		cut: '剪切',
		editDictionary: '编辑字典项',
		editlanguage: '编辑语言',
		insertAnchor: '插入本地链接',
		insertCharacter: '插入字符',
		insertgraphicheadline: '插入图片标题',
		insertimage: '插入图片',
		insertlink: '插入链接',
		insertMacro: '插入宏',
		inserttable: '插入表格',
		lastEdited: '最近编辑',
		link: '链接',
		linkinternal: '内部链接：',
		linklocaltip: '本地链接请用“#”号开头',
		linknewwindow: '在新窗口中打开？',
		macroDoesNotHaveProperties: '该宏没有可编辑的属性',
		paste: '粘贴',
		permissionsEdit: '编辑权限',
		recycleBinDeleting: '正在清空回收站，请不要关闭窗口。',
		recycleBinIsEmpty: '回收站已清空',
		recycleBinWarning: '从回收站删除的项目将不可恢复',
		regexSearchError:
			"<a target='_blank' rel='noopener' href='http://regexlib.com'>regexlib.com</a>的服务暂时出现问题。",
		regexSearchHelp: "查找正则表达式来验证输入，如: 'email、'zip-code'、'URL'。",
		removeMacro: '移除宏',
		requiredField: '必填项',
		sitereindexed: '站点已重建索引',
		siterepublished: '网站缓存已刷新，所有已发布的内容更新生效。',
		siterepublishHelp: '网站缓存将会刷新，所有已发布的内容将会更新。',
		tableColumns: '表格列数',
		tableRows: '表格行数',
		thumbnailimageclickfororiginal: '点击图片查看完整大小',
		treepicker: '拾取项',
		viewCacheItem: '查看缓存项',
		relateToOriginalLabel: '与原始连接',
		includeDescendants: '包括后代',
		theFriendliestCommunity: '最友好的社区',
		linkToPage: '链接到页面',
		openInNewWindow: '在新窗口或选项卡中打开链接的文档',
		linkToMedia: '链接到媒体',
		selectMedia: '选择媒体',
		selectIcon: '选择图标',
		selectItem: '选择项',
		selectLink: '选择链接',
		selectMacro: '选择宏',
		selectContent: '选择内容',
		selectMember: '选择成员',
		selectMemberGroup: '选择成员组',
		noIconsFound: '未找到图标',
		noMacroParams: '此宏没有参数',
		externalLoginProviders: '外部登录提供程序',
		exceptionDetail: '异常详细信息',
		stacktrace: '堆栈跟踪',
		innerException: '内部异常',
		linkYour: '链接您的',
		unLinkYour: '取消链接您的',
		account: '帐户',
		selectEditor: '选择编辑器',
	},
	dictionaryItem: {
		description: '\n       为字典项编辑不同语言的版本‘<em>%0%</em>’<br/>您可以在左侧的“语言”中添加一种语言\n    ',
		displayName: '语言名称',
		changeKeyError: "\n      关键字 '%0%' 已经存在。\n   ",
	},
	placeholders: {
		username: '输入您的用户名',
		password: '输入您的密码',
		confirmPassword: '确认密码',
		nameentity: '命名 %0%...',
		entername: '输入名称...',
		label: '标签...',
		enterDescription: '输入说明...',
		search: '输入搜索关键字...',
		filter: '输入过滤词...',
		enterTags: '键入添加tags (在每个tag之后按 enter)...',
		email: '输入您的电子邮件',
	},
	editcontenttype: {
		createListView: '创建自定义列表视图',
		removeListView: '删除自定义列表视图',
	},
	editdatatype: {
		addPrevalue: '添加预设值',
		dataBaseDatatype: '数据库数据类型',
		guid: '数据类型唯一标识',
		renderControl: '渲染控件',
		rteButtons: '按钮',
		rteEnableAdvancedSettings: '允许高级设置',
		rteEnableContextMenu: '允许快捷菜单',
		rteMaximumDefaultImgSize: '插入图片默认最大',
		rteRelatedStylesheets: '关联的样式表',
		rteShowLabel: '显示标签',
		rteWidthAndHeight: '宽和高',
	},
	errorHandling: {
		errorButDataWasSaved: '数据已保存，但是发布前您需要修正一些错误：',
		errorChangingProviderPassword: '当前成员提供程序不支持修改密码(EnablePasswordRetrieval的值应该为true)',
		errorExistsWithoutTab: '%0% 已存在',
		errorHeader: '发现错误：',
		errorHeaderWithoutTab: '发现错误：',
		errorInPasswordFormat: '密码最少%0%位，且至少包含%1%位非字母数字符号',
		errorIntegerWithoutTab: '%0% 必须是整数',
		errorMandatory: '%1% 中的 %0% 字段是必填项',
		errorMandatoryWithoutTab: '%0% 是必填项',
		errorRegExp: '%1% 中的 %0% 格式不正确',
		errorRegExpWithoutTab: '%0% 格式不正确',
	},
	errors: {
		receivedErrorFromServer: '从服务器收到错误',
		dissallowedMediaType: '该文件类型已被管理员禁用',
		codemirroriewarning: '注意，尽管配置中允许CodeMirror，但是它在IE上不够稳定，所以无法在IE运行。',
		contentTypeAliasAndNameNotNull: '请为新的属性类型填写名称和别名！',
		filePermissionsError: '权限有问题，访问指定文件或文件夹失败！',
		macroErrorLoadingPartialView: '加载Partial视图脚本时出错(文件: %0%)',
		missingTitle: '请输入标题',
		missingType: '请选择类型',
		pictureResizeBiggerThanOrg: '图片尺寸大于原始尺寸不会提高图片质量，您确定要把图片尺寸变大吗?',
		startNodeDoesNotExists: '默认打开页面不存在，请联系管理员',
		stylesMustMarkBeforeSelect: '请先选择内容，再设置样式。',
		stylesNoStylesOnPage: '没有可用的样式',
		tableColMergeLeft: '请把光标放在您要合并的两个单元格中的左边单元格',
		tableSplitNotSplittable: '非合并单元格不能分离。',
	},
	general: {
		about: '关于',
		action: '操作',
		actions: '操作',
		add: '添加',
		alias: '别名',
		all: '所有',
		areyousure: '您确定吗？',
		back: '返回',
		border: '边框',
		by: '或',
		cancel: '取消',
		cellMargin: '单元格边距',
		choose: '选择',
		close: '关闭',
		closewindow: '关闭窗口',
		comment: '备注',
		confirm: '确认',
		constrainProportions: '强制属性',
		continue: '继续',
		copy: '复制',
		create: '创建',
		database: '数据库',
		date: '时间',
		default: '默认',
		delete: '删除',
		deleted: '已删除',
		deleting: '正在删除…',
		design: '设计',
		dimensions: '规格',
		down: '下',
		download: '下载',
		edit: '编辑',
		edited: '已编辑',
		elements: '元素',
		email: '邮箱',
		error: '错误',
		findDocument: '查找文档',
		height: '高',
		help: '帮助',
		icon: '图标',
		import: '导入',
		innerMargin: '内边距',
		insert: '插入',
		install: '安装',
		invalid: '无效',
		justify: '对齐',
		language: '语言',
		layout: '布局',
		loading: '加载中',
		locked: '锁定',
		login: '登录',
		logoff: '退出',
		logout: '注销',
		macro: '宏',
		mandatory: '必填项',
		move: '移动',
		name: '名称',
		new: '新的',
		next: '下一步',
		no: '否',
		of: '属于',
		ok: '确定',
		open: '打开',
		or: '或',
		password: '密码',
		path: '路径',
		pleasewait: '请稍候…',
		previous: '上一步',
		properties: '属性',
		reciept: '接收数据邮箱',
		recycleBin: '回收站',
		remaining: '保持状态中',
		rename: '重命名',
		renew: '更新',
		required: '必填',
		retry: '重试',
		rights: '权限',
		search: '搜索',
		server: '服务器',
		show: '显示',
		showPageOnSend: '在发送时预览',
		size: '大小',
		sort: '排序',
		submit: '提交',
		type: '类型',
		typeToSearch: '输入内容开始查找…',
		up: '上',
		update: '更新',
		upgrade: '更新',
		upload: '上传',
		url: '链接地址',
		user: '用户',
		username: '用户名',
		value: '值',
		view: '查看',
		welcome: '欢迎…',
		width: '宽',
		yes: '是',
		folder: '文件夹',
		searchResults: '搜索结果',
		reorder: '重新排序',
		reorderDone: '我已结束排序',
		preview: '预览',
		changePassword: '更改密码',
		to: '至',
		listView: '列表视图',
		saving: '保存中...',
		current: '当前',
		embed: '嵌入',
		selected: '已选择',
	},
	colors: {
		blue: '蓝色',
	},
	shortcuts: {
		addGroup: '添加选项卡',
		addProperty: '添加属性',
		addEditor: '添加编辑器',
		addTemplate: '添加模板',
		addChildNode: '添加子节点',
		addChild: '添加子项',
		editDataType: '编辑数据类型',
		navigateSections: '导航节',
		shortcut: '快捷方式',
		showShortcuts: '显示快捷方式',
		toggleListView: '切换列表视图',
		toggleAllowAsRoot: '切换允许作为根',
	},
	graphicheadline: {
		backgroundcolor: '背景色',
		bold: '粗体',
		color: '前景色',
		font: '字体',
		text: '文本',
	},
	headers: {
		page: '页面',
	},
	installer: {
		databaseErrorCannotConnect: '无法连接到数据库。',
		databaseFound: '发现数据库',
		databaseHeader: '数据库配置',
		databaseInstall: '\n      点击<strong>安装</strong>进行 %0% 数据库配置\n    ',
		databaseInstallDone: '%0%数据库安装完成。点击<strong>下一步</strong>继续。',
		databaseText:
			'完成本步，需要配置一个正确的连接字符串（“connection string”）。<br />\n      如有必要，请联系您的系统管理员。\n      如果您是本机安装，请使用管理员账号。',
		databaseUpgrade:
			'\n      <p>\n     点击<strong>更新</strong>来更新系统到 %0%</p>\n      <p>\n      不用担心更新会丢失数据！\n      </p>\n    ',
		databaseUpgradeDone: '数据库已更新到版本 %0%。<br />点击<strong>下一步</strong>继续。',
		databaseUpToDate: '您的数据库已安装！点击<strong>下一步</strong>继续',
		defaultUserChangePass: '<strong>需要修改默认密码！</strong>',
		defaultUserDisabled: '<strong>默认账户已禁用或无权访问系统！</strong></p><p>点击<strong>下一步</strong>继续。',
		defaultUserPassChanged: '<strong>安装过程中默认用户密码已更改</strong></p><p>点击<strong>下一步</strong>继续。',
		defaultUserPasswordChanged: '密码已更改',
		greatStart: '作为入门者，从视频教程开始吧！',
		None: '安装失败。',
		permissionsAffectedFolders: '受影响的文件和文件夹',
		permissionsAffectedFoldersMoreInfo: '此处查看更多信息',
		permissionsAffectedFoldersText: '您需要对以下文件和文件夹授于ASP.NET用户修改权限',
		permissionsAlmostPerfect:
			'<strong>您当前的安全设置满足要求!</strong><br /><br />\n        您可以毫无问题的运行系统，但您不能安装系统所推荐的扩展包的完整功能。',
		permissionsHowtoResolve: '如何解决',
		permissionsHowtoResolveLink: '点击阅读文字版',
		permissionsHowtoResolveText: '观看我们的<strong>视频教程</strong> ',
		permissionsMaybeAnIssue:
			'<strong>您当前的安全设置有问题！</strong>\n      <br/><br />\n      您可以毫无问题的运行系统，但您不能新建文件夹、也不能安装系统所推荐的包的完整功能。    ',
		permissionsNotReady:
			'<strong>您当前的安全设置不适合于系统!</strong>\n          <br /><br />\n         您需要修改系统访问权限。',
		permissionsPerfect:
			'<strong>您当前的权限设置正确！</strong><br /><br />\n             您可以运行系统并安装其它扩展包！',
		permissionsResolveFolderIssues: '解决文件夹问题',
		permissionsResolveFolderIssuesLink: '点此查看ASP.NET和创建文件夹的问题解决方案',
		permissionsSettingUpPermissions: '设置文件夹权限',
		permissionsText:
			'\n      系统需要磁盘的读写权限以实现功能，\n      比如模板文件、站点中Cache文件的的操作等。\n    ',
		runwayFromScratch: '我要从头开始',
		runwayFromScratchText:
			'\n       此时您的网站是全空的,您应该首先建立您的文档类型和模板\n        (<a href="https://umbraco.tv/documentation/videos/for-site-builders/foundation/document-types">如何操作？</a>)\n       您也可以安装晚一些安装“Runway”。\n    ',
		runwayHeader: '您刚刚安装了一个干净的系统，要继续吗？',
		runwayInstalled: '“Runway”已安装',
		runwayInstalledText:
			'\n                在顶部选择您想要的功能模块<br />\n      这是我们推荐的模块，您也可以查看 <a href="#" onclick="toggleModules(); return false;" id="toggleModuleList">全部模块</a>\n    ',
		runwayOnlyProUsers: '仅推荐高级用户使用',
		runwaySimpleSite: '给我一个简单的网站',
		runwaySimpleSiteText:
			'\n      <p>\n      “Runway”是一个简单的，包含文件类型和模板的示例网站。安装程序会自动为您安装。\n       您可以自行编辑和删除之。\n        “Runway”为新手提供了最佳的入门功能\n\n        </p>\n        <small>\n        <em>Runway:</em> 主页, 开始页, 安装模块页.<br />\n        <em>可选模块:</em> 顶部导航, 站点地图, 联系我们, 图库.\n        </small>\n    ',
		runwayWhatIsRunway: '“Runway”是什么？',
		step1: '步骤 1/5：接受许可协议',
		step2: '步骤 2/5：数据库配置',
		step3: '步骤 3/5：文件权限验证',
		step4: '步骤 4/5：系统安全性',
		step5: '步骤 5/5：一切就绪，可以开始使用系统。',
		thankYou: '感谢选择我们的产品',
		theEndBrowseSite: '<h3>浏览您的新站点</h3>\n您安装了“Runway”，那么来瞧瞧吧。',
		theEndFurtherHelp: '<h3>更多的帮助信息</h3>\n从社区获取帮助',
		theEndHeader: '系统 %0% 安装完毕',
		theEndInstallSuccess:
			'您想要<strong>立即开始</strong>请点“运行系统”<br />如果您是<strong>新手</strong>, 您可以得到相当丰富的学习资源。',
		theEndOpenUmbraco: '<h3>运行系统</h3>\n管理您的网站, 运行后台添加内容，\n也可以添加模板和功能。',
		Unavailable: '无法连接到数据库。',
		Version3: '系统版本 3',
		Version4: '系统版本 4',
		watch: '观看',
		welcomeIntro:
			'本向导将指引您完成配置和安装（或升级安装）系统\n<br /><br />\n按 <strong>“下一步”</strong>进入向导。',
	},
	language: {
		cultureCode: '语言代码',
		displayName: '语言名称',
	},
	lockout: {
		lockoutWillOccur: '用户在空闲状态下将会自动注销',
		renewSession: '已更新，继续工作。',
	},
	login: {
		greeting0: '欢迎',
		greeting1: '欢迎',
		greeting2: '欢迎',
		greeting3: '欢迎',
		greeting4: '欢迎',
		greeting5: '欢迎',
		greeting6: '欢迎',
		instruction: '在下方登录',
		signInWith: '登录',
		timeout: '会话超时',
		bottomText:
			'<p style="text-align:right;">&copy; 2001 - %0% <br /><a href="https://umbraco.com" style="text-decoration: none" target="_blank" rel="noopener">Umbraco.com</a></p> ',
		forgottenPassword: '忘记密码?',
		forgottenPasswordInstruction: '电子邮件将发送到地址指定的链接, 以重置您的密码',
		requestPasswordResetConfirmation: '如果电子邮件与我们的记录相符, 则将发送带有密码重置指令的邮件',
		returnToLogin: '返回登录表单',
		setPasswordInstruction: '请提供新密码',
		setPasswordConfirmation: '您的密码已更新',
		resetCodeExpired: '您单击的链接无效或已过期',
		resetPasswordEmailCopySubject: 'Umbraco: 重置密码',
		resetPasswordEmailCopyFormat:
			'<p>您的用户名登录到 Umbraco 后台是: <strong>%0%</strong></p><p>点击 <a href="%1%"><strong>这里</strong></a> 重置密码，或复制链接粘贴到您的浏览器访问:</p><p><em>%1%</em></p>',
	},
	main: {
		dashboard: '仪表板',
		sections: '区域',
		tree: '内容',
	},
	moveOrCopy: {
		choose: '选择上面的页面…',
		copyDone: '%0% 被复制到 %1%',
		copyTo: '将 %0% 复制到',
		moveDone: '%0% 已被移动到 %1%',
		moveTo: '将 %0% 移动到',
		nodeSelected: '作为内容的根结点，点“确定”。',
		noNodeSelected: '尚未选择节点，请选择一个节点点击“确定”。',
		notAllowedByContentType: '类型不符不允许选择',
		notAllowedByPath: '该项不能移到其子项',
		notAllowedAtRoot: '当前节点不能建在根节点下',
		notValid: '您在子项的权限不够，不允许该操作。',
		relateToOriginal: '复本和原本建立关联',
	},
	notifications: {
		editNotifications: '为 %0% 编写通知',
		mailBody:
			"\n%0%：\n\n  您好！这是一封自动邮件，提醒您用户'%3%'\n  执行'%1%'任务\n  已经在完成'%2%'。\n\n      转到 http://%4%/#/content/content/edit/%5% 进行编辑\n\n      Have a nice day!\n\n      来自Umbraco机器人\n    ",
		mailBodyHtml:
			'<p>%0%：</p>\n\n\t\t  <p>您好！这是一封自动发送的邮件，告诉您任务<strong>\'%1%\'</strong>\n\t\t  已在<a href="http://%4%/actions/preview.aspx?id=%5%"><strong>\'%2%\'</strong></a>\n\t\t  被用户<strong>\'%3%\'</strong>执行\n\t\t  </p>\n\t\t  <div style="margin: 8px 0; padding: 8px; display: block;">\n\t\t\t\t<br />\n\t\t\t\t<a style="color: white; font-weight: bold; background-color: #5372c3; text-decoration : none; margin-right: 20px; border: 8px solid #5372c3; width: 150px;" href="http://%4%/#/content/content/edit/%5%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编辑&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a> &nbsp;\n\t\t\t\t<br />\n\t\t  </div>\n\t\t  <p>\n                          <h3>更新概况：</h3>\n\t\t\t  <table style="width: 100%;">\n\t\t\t\t\t\t   %6%\n\t\t\t\t</table>\n\t\t\t </p>\n\n\t\t  <div style="margin: 8px 0; padding: 8px; display: block;">\n\t\t\t\t<br />\n                                <a style="color: white; font-weight: bold; background-color: #5372c3; text-decoration : none; margin-right: 20px; border: 8px solid #5372c3; width: 150px;" href="http://%4%/#/content/content/edit/%5%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编辑&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a> &nbsp;\n                                <br />\n                  </div>\n\n                  <p>祝您愉快！<br /><br />\n                          该信息由系统自动发送\n                  </p>',
		mailSubject: '在 %2%，[%0%] 关于 %1% 的通告已执行。',
		notifications: '通知',
	},
	packager: {
		chooseLocalPackageText:
			'\n      从本机安装扩展包，可以点击“浏览”按钮<br />\n      选择 ".umb" 或者 ".zip" 文件\n    ',
		packageAuthor: '作者',
		packageDocumentation: '文档',
		packageMetaData: '元数据',
		packageName: '名称',
		packageNoItemsHeader: '扩展包不含任何项',
		packageNoItemsText: '该扩展包不包含任何项<br/><br/>\n      点击下面的“卸载”，您可以安全的删除。',
		packageOptions: '选项',
		packageReadme: '说明',
		packageRepository: '程序库',
		packageUninstallConfirm: '确认卸载',
		packageUninstalledHeader: '已卸载',
		packageUninstalledText: '扩展包卸载成功',
		packageUninstallHeader: '卸载',
		packageUninstallText:
			'选择想要卸载的项目，点击“卸载”<br />\n      <span style="color: Red; font-weight: bold;">注意：</span>\n      卸载包将导致所有依赖该包的东西失效，请确认。    ',
		packageVersion: '版本',
	},
	paste: {
		doNothing: '带格式粘贴（不推荐）',
		errorMessage: '您所粘贴的文本含有特殊字符或格式，Umbraco将清除以适应网页。',
		removeAll: '无格式粘贴',
		removeSpecialFormattering: '粘贴并移除格式（推荐）',
	},
	publicAccess: {
		paAdvanced: '基于角色的保护',
		paAdvancedHelp: '基于角色的授权，<br /> 要使用的会员组。',
		paAdvancedNoGroups: '使用基于角色的授权需要首先建立会员组。',
		paErrorPage: '错误页',
		paErrorPageHelp: '当用户登录后访问没有权限的页时显示该页',
		paHowWould: '选择限制访问此页的方式',
		paIsProtected: '%0% 现在处于受保护状态',
		paIsRemoved: '%0% 的保护被取消 ',
		paLoginPage: '登录页',
		paLoginPageHelp: '选择公开的登录入口',
		paRemoveProtection: '取消保护',
		paSelectPages: '选择一个包含登录表单和提示信息的页',
		paSelectRoles: '选择访问该页的角色类型',
		paSetLogin: '为此页设置账号和密码',
		paSimple: '单用户保护',
		paSimpleHelp: '如果您只希望提供一个用户名和密码就能访问',
	},
	publish: {
		contentPublishedFailedAwaitingRelease: '\n      %0% 无法发布, 因为该项在计划发布中。\n    ',
		contentPublishedFailedExpired: '\n      %0% 无法发布, 因为该项已过期。\n    ',
		contentPublishedFailedInvalid: '\n       %0%不能发布，因为%1%字段不合验证规则。\n    ',
		contentPublishedFailedByEvent: '\n      %0% 无法发布，第三方组件造成失败。\n    ',
		contentPublishedFailedByParent: '\n      %0% 不能发布，因为上级页面没有发布。\n    ',
		includeUnpublished: '包含未发布的子项',
		inProgress: '正在发布，请稍候…',
		inProgressCounter: '%0% 中的 %1% 页面已发布…',
		nodePublish: '%0% 已发布',
		nodePublishAll: '%0% 及其子项已发布',
		publishAll: '发布 %0% 及其子项',
		publishHelp:
			'点 <em>确定</em> 发布 <strong>%0%</strong><br/><br />\n       要发布当前页和所有子页，请选中 <em>全部发布</em> 发布所有子页。\n     ',
	},
	colorpicker: {
		noColors: '您没有配置任何认可的颜色',
	},
	relatedlinks: {
		enterExternal: '输入外部链接',
		chooseInternal: '选择内部页面',
		caption: '标题',
		link: '链接',
		newWindow: '新窗口',
		captionPlaceholder: '输入新标题',
		externalLinkPlaceholder: '输入链接',
	},
	imagecropper: {
		reset: 'Reset',
	},
	rollback: {
		diffHelp: '显示当前版本和选择版本的差异<br /><del>红色</del>是选中版本中没有的。<ins>绿色是新增的</ins>',
		documentRolledBack: '文档已回滚',
		htmlHelp: '将选中版本显示为HTML，如果您想看到版本间的差异比较，请使用对比视图。',
		rollbackTo: '回滚至',
		selectVersion: '选择版本',
		view: '查看',
	},
	scripts: {
		editscript: '编辑脚本',
	},
	sections: {
		concierge: '礼宾',
		content: '内容',
		courier: '导游',
		developer: '开发',
		installer: 'Umbraco配置向导',
		media: '媒体',
		member: '会员',
		newsletters: '消息',
		settings: '设置',
		statistics: '统计',
		translation: '翻译',
		users: '用户',
		help: '帮助',
		forms: '窗体',
	},
	help: {
		theBestUmbracoVideoTutorials: '最佳 Umbraco 视频教程',
	},
	settings: {
		defaulttemplate: '默认模板',
		importDocumentTypeHelp:
			'要导入文档类型，请点击“浏览”按钮，再点击“导入”，然后在您电脑上查找 ".udt"文件导入（下一页中需要您再次确认）',
		newtabname: '新建选项卡标题',
		nodetype: '节点类型',
		objecttype: '类型',
		stylesheet: '样式表',
		script: '脚本',
		tab: '选项卡',
		tabname: '选项卡标题',
		tabs: '选项卡',
		contentTypeEnabled: '主控文档类型激活',
		contentTypeUses: '该文档类型使用',
		noPropertiesDefinedOnTab: '没有字段设置在该标签页',
		addIcon: '添加图标',
	},
	sort: {
		sortOrder: '排序次序',
		sortCreationDate: '创建日期',
		sortDone: '排序完成。',
		sortHelp: '上下拖拽项目或单击列头进行排序',
		sortPleaseWait: '正在排序请稍候…',
	},
	speechBubbles: {
		validationFailedHeader: '验证',
		validationFailedMessage: '在保存项之前必须修复验证错误',
		operationFailedHeader: '失败',
		invalidUserPermissionsText: '用户权限不足, 无法完成操作',
		operationCancelledHeader: '取消',
		operationCancelledText: '操作被第三方插件取消。',
		contentPublishedFailedByEvent: '发布因为第三方插件取消',
		contentTypeDublicatePropertyType: '属性类型已存在',
		contentTypePropertyTypeCreated: '属性类型已创建',
		contentTypePropertyTypeCreatedText: '名称：%0% <br />数据类型：%1%',
		contentTypePropertyTypeDeleted: '属性类型已删除',
		contentTypeSavedHeader: '内容类型已保存',
		contentTypeTabCreated: '选项卡已创建',
		contentTypeTabDeleted: '选项卡已删除',
		contentTypeTabDeletedText: 'id为%0%的选项卡已删除',
		cssErrorHeader: '样式表未保存',
		cssSavedHeader: '样式表已保存',
		cssSavedText: '样式表保存，无错误。',
		dataTypeSaved: '数据类型已保存',
		dictionaryItemSaved: '字典项已保存',
		editContentPublishedFailedByParent: '因为上级页面未发布导致发布失败！',
		editContentPublishedHeader: '内容已发布',
		editContentPublishedText: '公众可见',
		editContentSavedHeader: '内容已保存',
		editContentSavedText: '请发布以使更改生效',
		editContentSendToPublish: '提交审核',
		editContentSendToPublishText: '更改已提交审核',
		editMediaSaved: '媒体已保存',
		editMediaSavedText: '媒体已保存',
		editMemberSaved: '会员已保存',
		editStylesheetPropertySaved: '样式表属性已保存',
		editStylesheetSaved: '样式表已保存',
		editTemplateSaved: '模板已保存',
		editUserError: '保存用户出错（请查看日志）',
		editUserSaved: '用户已保存',
		editUserTypeSaved: '用户类型已保存',
		fileErrorHeader: '文件未保存',
		fileErrorText: '文件无法保存，请检查权限。',
		fileSavedHeader: '文件保存',
		fileSavedText: '文件保存，无错误。',
		languageSaved: '语言已保存',
		mediaTypeSavedHeader: '已保存媒体类型',
		memberTypeSavedHeader: '已保存成员类型',
		templateErrorHeader: '模板未保存',
		templateErrorText: '模板别名相同',
		templateSavedHeader: '模板已保存',
		templateSavedText: '模板保存，无错误。',
		contentUnpublished: '未发布内容',
		partialViewSavedHeader: '片段视图已保存',
		partialViewSavedText: '片段视图保存，无错误。',
		partialViewErrorHeader: '片段视图未保存',
		partialViewErrorText: '片段视图因为错误未能保存',
	},
	stylesheet: {
		aliasHelp: '使用CSS语法，如：h1、.redHeader、.blueTex。',
		editstylesheet: '编辑样式表',
		editstylesheetproperty: '编辑样式属性',
		nameHelp: '编辑器中的样式属性名 ',
		preview: '预览',
		styles: '样式',
	},
	template: {
		edittemplate: '编辑模板',
		insertContentArea: '插入内容区',
		insertContentAreaPlaceHolder: '插入内容占位符',
		insertDictionaryItem: '插入字典项',
		insertMacro: '插入宏',
		insertPageField: '插入页字段',
		mastertemplate: '母版',
		quickGuide: '模板标签快速指南',
		template: '模板',
	},
	grid: {
		media: 'Image',
		macro: 'Macro',
		insertControl: '选择内容类别',
		chooseLayout: '选择一项布局',
		addRows: '添加一行',
		addElement: '添加内容',
		dropElement: '丢弃内容',
		settingsApplied: '设置已应用',
		contentNotAllowed: '此处不允许有该内容',
		contentAllowed: '此处允许有该内容',
		clickToEmbed: '点击嵌入',
		clickToInsertImage: '点击添加图片',
		placeholderWriteHere: '在这里输入...',
		gridLayouts: '网格布局',
		gridLayoutsDetail: '布局是网格编辑器的整体工作区域, 通常只需要一个或两个不同的布局',
		addGridLayout: '添加网络布局',
		addGridLayoutDetail: '通过设置列宽并添加其他节来调整版式',
		rowConfigurations: '行配置',
		rowConfigurationsDetail: '行是水平排列的预定义单元格',
		addRowConfiguration: '添加行配置',
		addRowConfigurationDetail: '通过设置单元格宽度和添加其他单元格来调整行',
		columns: '列',
		columnsDetails: '网格布局中的总和列数',
		settings: '设置',
		settingsDetails: '配置编辑器可以更改的设置',
		styles: '样式',
		stylesDetails: '配置编辑器可以更改的样式',
		allowAllEditors: '允许所有的编辑器',
		allowAllRowConfigurations: '允许所有行配置',
		setAsDefault: '设置为默认值',
		chooseExtra: '选择附加',
		chooseDefault: '选择默认值',
		areAdded: '已增加',
	},
	contentTypeEditor: {
		compositions: '组合',
		noGroups: '您没有添加任何选项卡',
		inheritedFrom: '继承自',
		addProperty: '添加属性',
		requiredLabel: '必需的标签',
		enableListViewHeading: '启用列表视图',
		enableListViewDescription: '配置内容项以显示其子项的可排序和搜索列表, 这些子项将不会显示在树中',
		allowedTemplatesHeading: '允许的模板',
		allowedTemplatesDescription: '选择允许在该类型的内容上使用哪些模板编辑器',
		allowAsRootHeading: '允许作为根',
		allowAsRootDescription: '允许编辑器在内容树的根目录中创建此类型的内容',
		childNodesHeading: '允许的子节点类型',
		childNodesDescription: '允许在该类型的内容下方创建指定类型的内容',
		chooseChildNode: '选择子节点',
		compositionsDescription:
			'从现有文档类型继承选项卡和属性。如果存在同名的选项卡, 则新选项卡将添加到当前文档类型或合并。',
		compositionInUse: '此内容类型在组合中使用, 因此不能自行组成。',
		noAvailableCompositions: '没有可供组合使用的内容类型。',
		availableEditors: '可用编辑器',
		reuse: '重用',
		editorSettings: '编辑器设置',
		configuration: '配置',
		yesDelete: '是，删除',
		movedUnderneath: '被移动到下方',
		copiedUnderneath: '被复制到下面',
		folderToMove: '选择要移动的文件夹',
		folderToCopy: '选择要复制的文件夹',
		structureBelow: '在下面的树结构中',
		allDocumentTypes: '所有文档类型',
		allDocuments: '所有文档',
		allMediaItems: '所有媒体项目',
		usingThisDocument: '使用此文档类型将被永久删除, 请确认您还要删除这些文件。',
		usingThisMedia: '使用此媒体类型将被永久删除, 请确认您也要删除这些。',
		usingThisMember: '使用此成员类型将被永久删除, 请确认您想要删除这些',
		andAllDocuments: '和所有使用此类型的文档',
		andAllMediaItems: '和所有使用此类型的媒体项目',
		andAllMembers: '和使用此类型的所有成员',
		memberCanEdit: '成员可编辑',
		showOnMemberProfile: '显示成员配置文件',
	},
	templateEditor: {
		alternativeField: '替代字段',
		alternativeText: '替代文本',
		casing: '大小写',
		chooseField: '选取字段',
		convertLineBreaks: '转换换行符',
		convertLineBreaksHelp: '将换行符转化为&lt;br&gt;',
		customFields: '自定义字段',
		dateOnly: '是，仅日期',
		encoding: '编码',
		formatAsDate: '格式化时间',
		htmlEncode: 'HTML编码',
		htmlEncodeHelp: '将替换HTML中的特殊字符',
		insertedAfter: '将在字段值后插入',
		insertedBefore: '将在字段值前插入',
		lowercase: '小写',
		none: '无',
		postContent: '字段后插入',
		preContent: '字段前插入',
		recursive: '递归',
		removeParagraph: '移除段落符号',
		removeParagraphHelp: '将移除&lt;P&gt;标签',
		standardFields: '标准字段',
		uppercase: '大写',
		urlEncode: 'URL编码',
		urlEncodeHelp: '将格式化URL中的特殊字符',
		usedIfAllEmpty: '当上面字段值为空时使用',
		usedIfEmpty: '该字段仅在主字段为空时使用',
		withTime: '是，含时间，分隔符为： ',
	},
	translation: {
		details: '翻译详情',
		DownloadXmlDTD: '下载 XML DTD',
		fields: '字段',
		includeSubpages: '包含子页',
		mailBody:
			"\n     %0%：\n\n     您好！这是一封自动邮件来提醒您注意，%2%的文档'%1%'\n     需要您翻译为'%5%'\n\n     转到 http://%3%/translation/details.aspx?id=%4% 进行编辑\n\n      或登录下列网址查看翻译任务\n      http://%3%\n\n      Have a nice day!\n\n      来自Umbraco 机器人的祝福\n    ",
		noTranslators: '没有翻译员，请创建翻译员角色的用户。',
		pageHasBeenSendToTranslation: "页面'%0%'已经发送给翻译",
		sendToTranslate: "发送页面'%0%'以便翻译",
		totalWords: '总字数',
		translateTo: '翻译到',
		translationDone: '翻译完成。',
		translationDoneHelp: '您可以浏览刚翻译的页面，如果原始页存在，您将得到两者的比较。',
		translationFailed: '翻译失败，XML可能损坏了。',
		translationOptions: '翻译选项',
		translator: '翻译员',
		uploadTranslationXml: '上传翻译的xml',
	},
	treeHeaders: {
		cacheBrowser: '缓存浏览',
		contentRecycleBin: '回收站',
		createdPackages: '创建扩展包',
		dataTypes: '数据类型',
		dictionary: '字典',
		installedPackages: '已安装的扩展包',
		installSkin: '安装皮肤',
		installStarterKit: '安装新手套件',
		languages: '语言',
		localPackage: '安装本地扩展包',
		macros: '宏',
		mediaTypes: '媒体类型',
		member: '会员',
		memberGroups: '会员组',
		memberRoles: '角色',
		memberTypes: '会员类型',
		documentTypes: '文档类型',
		relationTypes: '关系类型',
		packager: '扩展包',
		packages: '扩展包',
		repositories: '从在线程序库安装',
		runway: '安装Runway',
		runwayModules: 'Runway模块',
		scripting: 'Scripting文件',
		scripts: '脚本',
		stylesheets: '样式表',
		templates: '模板',
		userPermissions: '用户权限',
		users: 'Users',
		partialViews: '分部视图',
		partialViewMacros: '分部视图宏文件',
	},
	update: {
		updateAvailable: '有可用更新',
		updateDownloadText: '%0%已就绪，点击这里下载',
		updateNoServer: '无到服务器的连接',
		updateNoServerError: '检查更新失败',
	},
	user: {
		administrators: '管理员',
		categoryField: '分类字段',
		changePassword: '更改密码',
		newPassword: '更改密码',
		confirmNewPassword: '确认新密码',
		changePasswordDescription: '要改变密码，请在框中输入新密码，然后单击“更改密码”。',
		contentChannel: '内容频道',
		descriptionField: '描述字段',
		disabled: '禁用用户',
		documentType: '文档类型',
		editors: '编辑',
		excerptField: '排除字段',
		language: '语言',
		loginname: '登录',
		mediastartnode: '默认打开媒体项',
		modules: '区域',
		noConsole: '禁用后台管理界面',
		oldPassword: '旧密码',
		password: '密码',
		resetPassword: '重设密码',
		passwordChanged: '您的密码已更改！',
		passwordConfirm: '重输密码',
		passwordEnterNew: '输入新密码',
		passwordIsBlank: '新密码不能为空！',
		passwordCurrent: '当前密码',
		passwordInvalid: '密码错误',
		passwordIsDifferent: '新密码和重输入的密码不一致，请重试！',
		passwordMismatch: '重输的密码和原密码不一致！',
		permissionReplaceChildren: '替换子项权限设置',
		permissionSelectedPages: '您正在修改访问权限的页面：',
		permissionSelectPages: '选择要修改权限的页',
		searchAllChildren: '搜索子对象',
		startnode: '默认打开内容项',
		username: '用户名',
		userPermissions: '用户权限',
		usertype: '用户类型',
		userTypes: '用户类型',
		writer: '撰稿人',
		change: '更改',
		yourProfile: '你的资料',
		yourHistory: '你最近的历史信息',
		sessionExpires: '会话过期于',
	},
	validation: {
		validation: '验证',
		validateAsEmail: '验证为电子邮件',
		validateAsNumber: '验证为数字',
		validateAsUrl: '验证为 URL',
		enterCustomValidation: '...或输入自定义验证',
		fieldIsMandatory: '字段是强制性的',
	},
	healthcheck: {
		checkSuccessMessage: "Value is set to the recommended value: '%0%'.",
		checkErrorMessageDifferentExpectedValue:
			"Expected value '%1%' for '%2%' in configuration file '%3%', but found '%0%'.",
		checkErrorMessageUnexpectedValue: "Found unexpected value '%0%' for '%2%' in configuration file '%3%'.",
		macroErrorModeCheckSuccessMessage: "MacroErrors are set to '%0%'.",
		macroErrorModeCheckErrorMessage:
			"MacroErrors are set to '%0%' which will prevent some or all pages in your site from loading completely if there are any errors in macros. Rectifying this will set the value to '%1%'.",
		httpsCheckValidCertificate: 'Your site certificate was marked as valid.',
		httpsCheckInvalidCertificate: "Certificate validation error: '%0%'",
		healthCheckInvalidUrl: "Error pinging the URL %0% - '%1%'",
		httpsCheckIsCurrentSchemeHttps: 'You are currently %0% viewing the site using the HTTPS scheme.',
		compilationDebugCheckSuccessMessage: 'Debug compilation mode is disabled.',
		compilationDebugCheckErrorMessage:
			'Debug compilation mode is currently enabled. It is recommended to disable this setting before go live.',
		clickJackingCheckHeaderFound:
			'The header or meta-tag <strong>X-Frame-Options</strong> used to control whether a site can be IFRAMEd by another was found.',
		clickJackingCheckHeaderNotFound:
			'The header or meta-tag <strong>X-Frame-Options</strong> used to control whether a site can be IFRAMEd by another was not found.',
		excessiveHeadersFound:
			'The following headers revealing information about the website technology were found: <strong>%0%</strong>.',
		excessiveHeadersNotFound: 'No headers revealing information about the website technology were found.',
		smtpMailSettingsConnectionSuccess:
			'SMTP settings are configured correctly and the service is operating as expected.',
		notificationEmailsCheckSuccessMessage: 'Notification email has been set to <strong>%0%</strong>.',
		notificationEmailsCheckErrorMessage:
			'Notification email is still set to the default value of <strong>%0%</strong>.',
	},
	redirectUrls: {
		disableUrlTracker: '禁用 URL 跟踪程序',
		enableUrlTracker: '启用 URL 跟踪程序',
		originalUrl: '原始网址',
		redirectedTo: '已重定向至',
		noRedirects: '未进行重定向',
		noRedirectsDescription: '当已发布的页重命名或移动时, 将自动对新页进行重定向。',
		redirectRemoved: '重定向URL已删除。',
		redirectRemoveError: '删除重定向 URL 时出错.',
		confirmDisable: '是否确实要禁用 URL 跟踪程序?',
		disabledConfirm: 'URL 跟踪器现在已被禁用。',
		disableError: '禁用 URL 跟踪程序时出错, 可以在日志文件中找到更多信息。',
		enabledConfirm: '现在已启用 URL 跟踪程序。',
		enableError: '启用 URL 跟踪程序时出错, 可以在日志文件中找到更多信息。',
	},
	logViewer: {
		selectAllLogLevelFilters: '全选',
		deselectAllLogLevelFilters: '取消全选',
	},
} as UmbLocalizationDictionary;
