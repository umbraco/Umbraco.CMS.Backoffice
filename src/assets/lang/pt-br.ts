/**
 * Creator Name: The Umbraco community
 * Creator Link: https://docs.umbraco.com/umbraco-cms/extending/language-files
 *
 * Language Alias: pt
 * Language Int Name: Portuguese (BR)
 * Language Local Name: português (BR)
 * Language LCID:
 * Language Culture: pt-BR
 */
import type { UmbLocalizationDictionary } from '@umbraco-cms/backoffice/localization-api';
export default {
	actions: {
		assigndomain: 'Gerenciar hostnames',
		auditTrail: 'Caminho de Auditoria',
		browse: 'Navegar o Nó',
		copy: 'Copiar',
		create: 'Criar',
		createPackage: 'Criar Pacote',
		delete: 'Remover',
		disable: 'Desabilitar',
		emptyrecyclebin: 'Esvaziar Lixeira',
		exportDocumentType: 'Exportar Tipo de Documento',
		importdocumenttype: 'Importar Tipo de Documento',
		importPackage: 'Importar Pacote',
		liveEdit: 'Editar na Tela',
		logout: 'Sair',
		move: 'Mover',
		notify: 'Notificações',
		protect: 'Acesso público',
		publish: 'Publicar',
		refreshNode: 'Recarregar nós',
		republish: 'Republicar site inteiro',
		rights: 'Permissões',
		rollback: 'Reversão',
		sendtopublish: 'Enviar para Publicação',
		sendToTranslate: 'Enviar para Tradução',
		sort: 'Classificar',
		translate: 'Traduzir',
		update: 'Atualizar',
	},
	assignDomain: {
		addNew: 'Adicionar novo Domínio',
		domain: 'Domínio',
		domainCreated: "Novo domínio '%0%' foi criado",
		domainDeleted: "Domínio '%0%' foi removido",
		domainExists: "Domínio '%0%' já foi designado",
		domainUpdated: "Domínio '%0%' foi atualizado",
		orEdit: 'Editar Domínios Atuais',
	},
	auditTrails: {
		atViewingFor: 'Visão para',
	},
	buttons: {
		bold: 'Negrito',
		deindent: 'Remover Travessão de Parágrafo',
		formFieldInsert: 'Inserir campo de formulário',
		graphicHeadline: 'Inserir manchete de gráfico',
		htmlEdit: 'Editar Html',
		indent: 'Travessão de Parágrafo',
		italic: 'Itálico',
		justifyCenter: 'Centro',
		justifyLeft: 'Justificar à Esquerda',
		justifyRight: 'Justificar à Direita',
		linkInsert: 'Inserir Link',
		linkLocal: 'Inserir link local (âncora)',
		listBullet: 'Lista de tópicos',
		listNumeric: 'Lista numérica',
		macroInsert: 'Inserir macro',
		pictureInsert: 'Inserir figura',
		relations: 'Editar relacionamentos',
		save: 'Salvar',
		saveAndPublish: 'Salvar e publicar',
		saveToPublish: 'Salvar e mandar para aprovação',
		saveAndPreview: 'Prévia',
		styleChoose: 'Escolha estilo',
		styleShow: 'Mostrar estilos',
		tableInsert: 'Inserir tabela',
	},
	content: {
		about: 'Sobre esta página',
		alias: 'Link alternativo',
		alternativeTextHelp: '(como você descreveria a imagem pelo telefone)',
		alternativeUrls: 'Links Alternativos',
		clickToEdit: 'Clique para editar este item',
		createBy: 'Criado por',
		createDate: 'Criado',
		documentType: 'Tipo de Documento',
		editing: 'Editando',
		expireDate: 'Remover em',
		itemChanged: 'Este item foi alterado após a publicação',
		itemNotPublished: 'Este item não está publicado',
		lastPublished: 'Última publicação',
		mediatype: 'Tipo de Mídia',
		membergroup: 'Grupo do Membro',
		memberrole: 'Função',
		membertype: 'Tipo de Membro',
		noDate: 'Nenhuma data escolhida',
		nodeName: 'Título da Página',
		otherElements: 'Propriedades',
		parentNotPublished: "Este documento está publicado mas não está visível porque o pai '%0%' não está publicado",
		publish: 'Publicar',
		publishStatus: 'Status da Publicação',
		releaseDate: 'Publicado em ',
		removeDate: 'Remover Data',
		sortDone: 'Ordem de classificação está atualizada',
		sortHelp:
			"Para classificar os nós simplesmente arraste os nós ou clique em um dos títulos de colunas. Você pode selecionar múltiplos nós ao pressionar e segurar 'shift' ou 'control' durante a seleção",
		statistics: 'Estatísticas',
		titleOptional: 'Título (opcional)',
		type: 'Tipo',
		unpublish: 'Des-Publicar',
		updateDate: 'Última edição',
		uploadClear: 'Remover arquivo',
		urls: 'Link ao documento',
	},
	create: {
		chooseNode: 'Onde você quer criar seu novo(a) %0%',
		createUnder: 'Criado em',
		updateData: 'Escolha um tipo e um título',
	},
	dashboard: {
		browser: 'Navegue seu site',
		dontShowAgain: '- Esconder',
		nothinghappens: 'Se Umbraco não estiver abrindo talvez você precise hablitar pop-ups para este site',
		openinnew: 'foi aberto em uma nova janela',
		restart: 'Reiniciar',
		visit: 'Visitar',
		welcome: 'Bem Vindo(a)',
	},
	prompt: {
		stay: 'Stay',
		discardChanges: 'Discard changes',
		unsavedChanges: 'You have unsaved changes',
		unsavedChangesWarning: 'Are you sure you want to navigate away from this page? - you have unsaved changes',
	},
	bulk: {
		done: 'Done',
		deletedItem: 'Deleted %0% item',
		deletedItems: 'Deleted %0% items',
		deletedItemOfItem: 'Deleted %0% out of %1% item',
		deletedItemOfItems: 'Deleted %0% out of %1% items',
		publishedItem: 'Published %0% item',
		publishedItems: 'Published %0% items',
		publishedItemOfItem: 'Published %0% out of %1% item',
		publishedItemOfItems: 'Published %0% out of %1% items',
		unpublishedItem: 'Unpublished %0% item',
		unpublishedItems: 'Unpublished %0% items',
		unpublishedItemOfItem: 'Unpublished %0% out of %1% item',
		unpublishedItemOfItems: 'Unpublished %0% out of %1% items',
		movedItem: 'Moved %0% item',
		movedItems: 'Moved %0% items',
		movedItemOfItem: 'Moved %0% out of %1% item',
		movedItemOfItems: 'Moved %0% out of %1% items',
		copiedItem: 'Copied %0% item',
		copiedItems: 'Copied %0% items',
		copiedItemOfItem: 'Copied %0% out of %1% item',
		copiedItemOfItems: 'Copied %0% out of %1% items',
	},
	defaultdialogs: {
		anchorInsert: 'Nome',
		assignDomain: 'Gerenciar hostnames',
		closeThisWindow: 'Fechar esta janela',
		confirmdelete: 'Certeza em remover',
		confirmdisable: 'Certeza em desabilitar',
		confirmlogout: 'Tem certeza',
		confirmSure: 'Tem certeza?',
		cut: 'Cortar',
		editDictionary: 'Editar Item de Dicionário',
		editLanguage: 'Editar Linguagem',
		insertAnchor: 'Inserir link local',
		insertCharacter: 'Inserir charactere',
		insertgraphicheadline: 'Inserir manchete de gráfico',
		insertimage: 'Inserir figura',
		insertlink: 'Inserir Link',
		insertMacro: 'Inserir Macro',
		inserttable: 'Inserir tabela',
		lastEdited: 'Última Edição',
		link: 'Link',
		linkinternal: 'Link interno:',
		linklocaltip: 'Ao usar links locais insira "#" na frente do link',
		linknewwindow: 'Abrir em nova janela?',
		macroDoesNotHaveProperties: 'Este macro não contém nenhuma propriedade que possa ser editada',
		paste: 'Colar',
		permissionsEdit: 'Editar Permissões para',
		recycleBinDeleting:
			'Os itens na lixeira agora estão sendo removidos. Favor não fechar esta janela enquanto este processo é concluído',
		recycleBinIsEmpty: 'A lixeira agora está vazia',
		recycleBinWarning: 'Quando itens são removidos da lixeira estes somem para sempre',
		regexSearchError:
			"O serviço web <a target='_blank' rel='noopener' href='http://regexlib.com'>regexlib.com</a> está no momento sofrendo dificuldades dos quais não temos controle. Pedimos desculpas pela inconveniência.",
		regexSearchHelp:
			"Busque por uma expressão regular para adicionar validação à um campo de formulário. Exemplo: 'email', 'zip-code' (código postal), 'URL'",
		removeMacro: 'Remover Macro',
		requiredField: 'Campo obrigatório',
		sitereindexed: 'Site foi re-indexado',
		siterepublished:
			'O cache do website foi atualizado. Todo conteúdo publicado está atualizado agora. No entanto, todo conteúdo não publicado ainda permanecerá invisível',
		siterepublishHelp:
			'O cache do website será atualizado. Todo conteúdo publicado será atualizado, enquanto o conteúdo que não foi publicado permanecerá invisível',
		tableColumns: 'Número de colunas',
		tableRows: 'Número de linhas',
		thumbnailimageclickfororiginal: 'Clique para ver a imagem em seu tamanho original',
		treepicker: 'Escolha item',
		viewCacheItem: 'Ver Item em Cache',
	},
	dictionaryItem: {
		description:
			"Editar as diferente versões de linguagem para o item de dicionário '%0%' abaixo. Você pode adicionar mais linguagens sob 'linguagens' no menu à esquerda.",
		displayName: 'Nome da Cultura',
	},
	editdatatype: {
		addPrevalue: 'Adicionar valor prévio',
		dataBaseDatatype: 'Tipo de Dados do Banco de Dados',
		guid: 'GUID do Editor de Propriedades',
		renderControl: 'Editor de Propriedades',
		rteButtons: 'Botões',
		rteEnableAdvancedSettings: 'Habilitar configurações avançadas para',
		rteEnableContextMenu: 'Habilitar menu de contexto',
		rteMaximumDefaultImgSize: 'Tamanho padrão máximo para imagens inseridas',
		rteRelatedStylesheets: 'Stylesheets relacionadas',
		rteShowLabel: 'Mostrar Rótulo',
		rteWidthAndHeight: 'Largura e altura',
	},
	errorHandling: {
		errorButDataWasSaved:
			'Seus dados foram salvos mas antes que possa publicar esta página existem alguns erros que precisam ser concertados:',
		errorChangingProviderPassword:
			'O provedor de membros (Membership provider) atual não suporta alterações de senha (EnablePasswordRetrieval tem que estar definica como true)',
		errorExistsWithoutTab: '%0% já existe',
		errorHeader: 'Houve erros:',
		errorHeaderWithoutTab: 'Houve erros:',
		errorInPasswordFormat:
			'A senha deve ter no mínimo %0% caracteres e conter pelo menos %1% caractere(s) não alfa-númérico',
		errorIntegerWithoutTab: '%0% tem que ser um inteiro',
		errorMandatory: 'O campo %0% na guia %1% é mandatório',
		errorMandatoryWithoutTab: '%0% é um campo mandatório',
		errorRegExp: '%0% em %1% não está no formato correto',
		errorRegExpWithoutTab: '%0% não está em um formato correto',
	},
	errors: {
		codemirroriewarning:
			'NOTA! Mesmo que CodeMirror esteja habilitado pela configuração o mesmo foi desabilitado em Internet Explorer pois não é estável o suficiente.',
		contentTypeAliasAndNameNotNull: 'Favor preencher ambos apelidos e nome na sua nova propriedade de tipo!',
		filePermissionsError: 'Houve um erro com o acesso de ler/escrever em um arquivo ou pasta específica',
		missingTitle: 'Favor digitar um título',
		missingType: 'Favor escolher um tipo',
		pictureResizeBiggerThanOrg:
			'Você está prestes a tornar esta figura maior que o tamanho original. Tem certeza que deseja proceguir?',
		startNodeDoesNotExists: 'Nó inicial removido, favor entrar em contato com seu administrador',
		stylesMustMarkBeforeSelect: 'Favor marcar conteúdo antes de alterar o estilo',
		stylesNoStylesOnPage: 'Nenhum estilo ativo disponível',
		tableColMergeLeft: 'Favor colocar o cursos à esquerda das duas células que deseja mesclar',
		tableSplitNotSplittable: 'Você não pode dividir uma célula que não foi mesclada.',
	},
	general: {
		about: 'Sobre',
		action: 'Ação',
		add: 'Adicionar',
		alias: 'Apelido',
		areyousure: 'Tem certeza?',
		border: 'Borda',
		by: 'por',
		cancel: 'Cancelar',
		cellMargin: 'Margem da célula',
		choose: 'Escolher',
		close: 'Fechar',
		closewindow: 'Fechar Janela',
		comment: 'Comentário',
		confirm: 'Confirmar',
		constrainProportions: 'Restrições de proporções',
		continue: 'Continuar',
		copy: 'Copiar',
		create: 'Criar',
		database: 'Banco de Dados',
		date: 'Data',
		default: 'Padrão',
		delete: 'Remover',
		deleted: 'Removido',
		deleting: 'Removendo...',
		design: 'Desenho',
		dimensions: 'Dimensões',
		down: 'Abaixo',
		download: 'Download',
		edit: 'Editar',
		edited: 'Editado',
		elements: 'Elementos',
		email: 'Email',
		error: 'Erro',
		findDocument: 'Buscar',
		height: 'Altura',
		help: 'Ajuda',
		icon: 'Ícone',
		import: 'Importar',
		innerMargin: 'Margem interna',
		insert: 'Inserir',
		install: 'Instalar',
		justify: 'Justificar',
		language: 'Idioma',
		layout: 'Esboço',
		loading: 'Carregando',
		locked: 'Travado',
		login: 'Login',
		logoff: 'Sair',
		logout: 'Logout',
		macro: 'Macro',
		move: 'Mover',
		name: 'Nome',
		new: 'Novo',
		next: 'Próximo',
		no: 'Não',
		of: 'de',
		ok: 'OK',
		open: 'Abrir',
		or: 'ou',
		password: 'Senha',
		path: 'Caminho',
		pleasewait: 'Um momento por favor...',
		previous: 'Prévio',
		properties: 'Propriedades',
		reciept: 'Email para receber dados do formulário',
		recycleBin: 'Lixeira',
		remaining: 'Remanescentes',
		rename: 'Renomear',
		renew: 'Renovar',
		retry: 'Tentar novamente',
		rights: 'Permissões',
		search: 'Busca',
		server: 'Servidor',
		show: 'Mostrar',
		showPageOnSend: 'Mostrar página durante envio',
		size: 'Tamanho',
		sort: 'Classificar',
		submit: 'Submit',
		type: 'Tipo',
		typeToSearch: 'Digite para buscar...',
		up: 'Acima',
		update: 'Atualizar',
		upgrade: 'Atualizar',
		upload: 'Subir (Upload)',
		url: 'URL',
		user: 'Usuário',
		username: 'Usuário',
		value: 'Valor',
		view: 'Ver',
		welcome: 'Bem Vindo(a)...',
		width: 'Largura',
		yes: 'Sim',
		reorder: 'Reorder',
		reorderDone: 'I am done reordering',
	},
	graphicheadline: {
		backgroundcolor: 'Cor de fundo',
		bold: 'Negrito',
		color: 'Cor do Texto',
		font: 'Fonte',
		text: 'Texto',
	},
	headers: {
		page: 'Página',
	},
	installer: {
		databaseErrorCannotConnect: 'O instalador não pôde conectar-se ao banco de dados.',
		databaseFound: 'Seu banco de dados foi encontrado e identificado como',
		databaseHeader: 'Configuração do Banco de Dados',
		databaseInstall: 'Pressione o botão <strong>instalar</strong> para instalar o banco de dados do Umbraco %0%',
		databaseInstallDone:
			'Umbraco %0% agora foi copiado para seu banco de dados. Pressione <strong>Próximo</strong> para prosseguir.',
		databaseText:
			'Para completar este passo, você deve saber algumas informações relativas ao seu servidor de banco de dados ("connection string"). <br /> Favor contatar seu provedor de internet ou hospedagem web se necessário. Se você estiver instalando em uma máquina ou servidor local é possível que você precise dessas informações por um administrador de sistema.',
		databaseUpgrade:
			'<p>\n      Pressione o botão <strong>atualizar</strong> para atualizar seu banco de dados para Umbraco %0%</p>\n      <p>\n      Não se preocupe - nenhum conteúdo será removido e tudo estará funcionando depois disto!</p>\n\n    ',
		databaseUpgradeDone:
			'Seu banco de dados foi atualizado para última versão %0%. <br />Pressione <strong>Próximo</strong> para prosseguir.',
		databaseUpToDate:
			'Seu banco de dados atual está desatualizado! Clique <strong>próximo</strong> para continuar com o assistente de configuração',
		defaultUserChangePass: '<strong>A senha do usuário padrão precisa ser alterada!</strong>',
		defaultUserDisabled:
			'<strong>O usuário padrão foi desabilitado ou não tem acesso à Umbraco!</strong></p><p>Nenhuma ação posterior precisa ser tomada. Clique <strong>Próximo</strong> para prosseguir.',
		defaultUserPassChanged:
			'<strong>A senha do usuário padrão foi alterada com sucesso desde a instalação!</strong></p><p>Nenhuma ação posterior é necessária. Clique <strong>Próximo</strong> para prosseguir.',
		defaultUserPasswordChanged: 'Senha foi alterada!',
		greatStart: 'Comece com o pé direito, assista nossos vídeos introdutórios',
		None: 'Nenhum instalado ainda.',
		permissionsAffectedFolders: 'Pastas e arquivos afetados',
		permissionsAffectedFoldersMoreInfo: 'Mais informações em como configurar permissões para Umbraco aqui',
		permissionsAffectedFoldersText:
			'Você precisa conceder permissão de modificação ASP.NET aos seguintes arquivos/pastas',
		permissionsAlmostPerfect:
			'<strong>Suas permissões estão quase perfeitas!</strong><br /><br />\nVocê pode correr Umbraco sem problemas, mas não vai ser capaz de instalar pacotes que são recomendados para tirar total vantagem de Umbraco.',
		permissionsHowtoResolve: 'Como Resolver',
		permissionsHowtoResolveLink: 'Clique aqui para ler a versão texto',
		permissionsHowtoResolveText:
			'Assista nosso <strong>vídeo tutorial</strong> sobre configuração de permissões de pastas para Umbraco ou leia a versão texto.',
		permissionsMaybeAnIssue:
			'<strong>Suas permissões podem ser um problema!</strong>\n<br/><br/>\nVocê pode correr Umbraco sem problemas mas não será capaz de criar pastas ou instalar pacotes que são recomendados para tirar total vantagem de Umbraco.',
		permissionsNotReady:
			'<strong>Suas permissões não estão prontas para Umbraco!</strong>\n<br /><br />\nPara correr Umbraco você vai precisar atualizar as configurações de permissões.',
		permissionsPerfect:
			'<strong>Suas configurações de permissões estão perfeitas!</strong> <br /><br /> Você está pronto para correr o Umbraco e instalar pacotes!',
		permissionsResolveFolderIssues: 'Resolvendo problemas de pastas',
		permissionsResolveFolderIssuesLink:
			'Siga este link para mais informações sobre problemas com ASP.NET e criação de pastas',
		permissionsSettingUpPermissions: 'Configurando permissões de pastas',
		permissionsText:
			'Umbraco necessita acesso ler/escrever à certos diretórios para que possa guardar arquivos como fotos e PDFs.\nTambém guarda informações temporárias (cache) para melhorar a performance do seu website.',
		runwayFromScratch: 'Eu quero começar do zero',
		runwayFromScratchText:
			'Seu site está completamente vazio no momento, então isso é perfeito se você deseja começar do zero e criar seus próprios documentos e modelos.\n        (<a href="https://umbraco.tv/documentation/videos/for-site-builders/foundation/document-types">learn how</a>)\n        Você ainda pode escolher instalar Runway mais tarde. Favor ir à seção Desenvolvedor e selecione pacotes.',
		runwayHeader: 'Você acabou de configurar uma plataforma Umbraco limpa. O que deseja fazer a seguir?',
		runwayInstalled: 'Runway está instalado',
		runwayInstalledText:
			'Você tem uma fundação instalada. Selecione quais módulos deseja instalar além do básico. <br/>\nEsta é nossa lista de módulos recomendados, selecione os que gostaria de instalar, ou veja a <a href="#" onclick="toggleModules(); return false;" id="toggleModuleList">lista completa de módulos</a>',
		runwayOnlyProUsers: 'Somente recomendado para usuários experientes',
		runwaySimpleSite: 'Eu quero começar com um site simples',
		runwaySimpleSiteText:
			'<p>\n      "Runway" é um website simples que provê alguns documentos básicos e modelos. O instalador pode configurar Runway automaticamente mas você pode editar facilmente, extender ou removê-lo. Não é necessário e você pode perfeitamente usar Umbraco sem ele.\nNo entanto, Runway oferece uma fundação básica sobre melhores práticas em como começar o mais rápido possível.\nSe escolher instalar Runway você pode opcionalmente selecionar blocos de construção básicos chamados módulos Runway para melhorar suas páginas Runway.</p>\n        <small>\n        <em>Incluso com Runway:</em> Página Inicial, Começando, Instalando Módulos.<br />\n        <em>Módulos Opcionais: </em> Navegação de Topo, Mapa de Site, Contato, Galeria.\n        </small>\n\n    ',
		runwayWhatIsRunway: 'O que é Runway',
		step1: 'Passo 1/5 Aceitar Licença',
		step2: 'Passo 2/5: Configuração do Banco de Dados',
		step3: 'Passo 3/5: Validando Permissões de Arquivos',
		step4: 'Passo 4/5: Checar segurança Umbraco',
		step5: 'Passo 5/5: Umbraco está pronto para ser usado',
		thankYou: 'Obrigado por escolher Umbraco',
		theEndBrowseSite: '<h3>Navegue seu site</h3>\nVocê instalou Runway, então por que não ver como é seu novo website.',
		theEndFurtherHelp:
			'<h3>Ajuda adicional e informações</h3>\nConsiga ajuda de nossa comunidade ganhadora de prêmios, navegue a documentação e assista alguns vídeos grátis sobre como construir um site simples, como usar pacotes e um guia prático sobre a terminologia Umbraco',
		theEndHeader: 'Umbraco %0% está instalado e pronto para uso',
		theEndInstallSuccess:
			'Você pode <strong>iniciar instantâneamente</strong> clicando em "Lançar Umbraco" abaixo. <br/> Se você é <strong>novo com Umbraco</strong> você pode encontrar vários recursos em nossa página para iniciantes.',
		theEndOpenUmbraco:
			'<h3>Lançar Umbraco</h3>\nPara gerenciar seu website, simplesmente abra a área administrativa do Umbraco para começar adicionando conteúdo, atualizando modelos e stylesheets e adicionando nova funcionalidade',
		Unavailable: 'Conexão ao banco falhou.',
		Version3: 'Umbraco Versão 3',
		Version4: 'Umbraco Versão 4',
		watch: 'Assistir',
		welcomeIntro:
			'Este assistente irá guiá-lo pelo processo de configuração do <strong>Umbraco %0%</strong> para uma nova instalação ou atualizando desde verão 3.0.\n<br /><br />\nPressione <strong>"próximo"</strong> para iniciar o assistente.',
	},
	language: {
		cultureCode: 'Código da Cultura',
		displayName: 'Nome da Cultura',
	},
	lockout: {
		lockoutWillOccur: 'Você está inativo e logout irá ocorrer automaticamente em',
		renewSession: 'Renovar agora para salvar seu trabalho',
	},
	login: {
		greeting0: 'Bem Vindo(a)',
		greeting1: 'Bem Vindo(a)',
		greeting2: 'Bem Vindo(a)',
		greeting3: 'Bem Vindo(a)',
		greeting4: 'Bem Vindo(a)',
		greeting5: 'Bem Vindo(a)',
		greeting6: 'Bem Vindo(a)',
		bottomText:
			'<p style="text-align:right;">&copy; 2001 - %0% <br /><a href="https://umbraco.com" style="text-decoration: none" target="_blank" rel="noopener">umbraco.com</a></p> ',
	},
	main: {
		dashboard: 'Painel',
		sections: 'Seções',
		tree: 'Conteúdo',
	},
	moveOrCopy: {
		choose: 'Escolha página acima...',
		copyDone: '%0% foi copiado para %1%',
		copyTo: 'Selecione onde o documento %0% deve ser copiado abaixo',
		moveDone: '%0% foi movido para %1%',
		moveTo: 'Selecione onde o documento %0% dever ser movido abaixo',
		nodeSelected: "foi selecionado como raíz do seu novo conteúdo, clique 'ok' abaixo.",
		noNodeSelected: "Nenhum nó selecionado, favor selecionar um nó na lista acima antes de clicar em 'ok'",
		notAllowedByContentType: 'O nó atual não é permitido embaixo do nó escolhido por causa de seu tipo',
		notAllowedByPath: 'O nó atual não pode ser movido para uma de suas sub-páginas',
		notValid:
			"TRANSLATE ME: 'The action isn't allowed since you have insufficient permissions on 1 or more child documents.'",
	},
	notifications: {
		editNotifications: 'Editar sua notificação para %0%',
		notificationsSavedFor: 'Notificações salvas para %0%',
		notifications: 'Notificações',
	},
	packager: {
		chooseLocalPackageText:
			'Selecione o pacote em sua máquina clicando no botão Navegar <br /> e localizando o pacote. Pacotes Umbraco tem extensão ".umb" ou ".zip".',
		packageAuthor: 'Autor',
		packageDocumentation: 'Documentação',
		packageMetaData: 'Dado meta do pacote',
		packageName: 'Nome do pacote',
		packageNoItemsHeader: 'Pacote não contém nenhum item',
		packageNoItemsText:
			'Este arquivo de pacote não contém nenhum item a ser desinstalado. <br /><br />\nVocê pode remover com segurança do seu sistema clicando em "desinstalar pacote" abaixo.',
		packageOptions: 'Oções do pacote',
		packageReadme: 'Leia-me do pacote',
		packageRepository: 'Repositório do pacote',
		packageUninstallConfirm: 'Confirmar desinstalação',
		packageUninstalledHeader: 'Pacote foi desinstalado',
		packageUninstalledText: 'O pacote foi desinstalado com sucesso',
		packageUninstallHeader: 'Desinstalar pacote',
		packageUninstallText:
			'Você pode de-selecionar itens que não deseja remover neste momento, abaixo. Quando clicar em "confirmar desinstalação" todos os itens selecionados serão removido. <br />\n<span style="color: Red; font-weight: bold;">Aviso:</span> quaisquer documentos, mídia, etc dependentes dos itens que forem removidos vão parar de funcionar e podem levar à instabilidade do sistema. Então desinstale com cuidado. Se tiver dúvidas, contate o autor do pacote',
		packageVersion: 'Versão do pacote',
	},
	paste: {
		doNothing: 'Colar com formatação completa (Não recomendado)',
		errorMessage:
			'O texto que você está tentando colar contém caracteres ou formatação especial. Isto pode ser causado ao copiar textos diretamente do Microsoft Word. Umbraco pode remover os caracteres ou formatação especial automaticamente para que o conteúdo colado seja mais adequado para a internet.',
		removeAll: 'Colar como texto crú sem nenhuma formatação',
		removeSpecialFormattering: 'Colar, mas remover formatação (Recomendado)',
	},
	publicAccess: {
		paAdvanced: 'Proteção baseada em função',
		paAdvancedHelp:
			'Se você deseja controlar o acesso à página usando autenticação baseada em funções, <br /> usando grupos de membros do Umbraco.',
		paAdvancedNoGroups:
			'Você precisa criar um grupo de membros antes que possa usar <br /> autenticação baseada em função.',
		paErrorPage: 'Página de Erro',
		paErrorPageHelp: 'Usado quando as pessoas estão logadas, mas não para ter acesso',
		paHowWould: 'Escolha como restringir o acesso à esta página',
		paIsProtected: '%0% agora está protegido',
		paIsRemoved: 'Proteção removida de %0%',
		paLoginPage: 'Página de Login',
		paLoginPageHelp: 'Escolha a página que tem o formulário de login',
		paRemoveProtection: 'Remover Proteção',
		paSelectPages: 'Selecione as páginas que contém o formulário de login e mensagens de erro',
		paSelectRoles: 'Escolha as funções que terão acesso à esta página',
		paSetLogin: 'Defina o login e senha para esta página',
		paSimple: 'Proteção à um usuário específico',
		paSimpleHelp: 'Se você deseja configurar proteção simples usando somente um usuário e senha',
	},
	publish: {
		contentPublishedFailedByEvent: '%0% não pode ser publicado devido à uma extensão de terceiros que cancelou a ação.',
		includeUnpublished: 'Incluir páginas filhas ainda não publicadas',
		inProgress: 'Publicação em progresso - favor aguardar...',
		inProgressCounter: '%0% de %1% páginas foram publicadas...',
		nodePublish: '%0% foi publicada',
		nodePublishAll: '%0% e sub-páginas foram publicadas',
		publishAll: 'Publicar %0% e todoas suas sub-páginas',
		publishHelp:
			'Clique em <em>ok</em> para publicar <strong>%0%</strong> e assim fazer com que seu conteúdo se torne disponível. <br /><br />\nVocê pode publicar esta página e todas suas sub-páginas ao selecionar <em>publicar todos filhos</em> abaixo.',
	},
	relatedlinks: {
		addExternal: 'Adicionar link externo',
		addInternal: 'Adicionar link interno',
		addlink: 'Adicionar',
		caption: 'Legenda',
		internalPage: 'Página interna',
		linkurl: 'URL',
		modeDown: 'Mover Abaixo',
		modeUp: 'Mover Acima',
		newWindow: 'Abrir em nova janela',
		removeLink: 'Remover Link',
	},
	rollback: {
		diffHelp:
			'Isto mostra as diferenças entre a versão atual e a versão selecionada <br />Texto <del>vermelho</del> não será mostrado na versão selecionada; <ins>verde significa adicionado</ins>',
		documentRolledBack: 'Documento foi revertido',
		htmlHelp:
			'Isto mostra a versão selecionada como html se você deseja ver as diferenças entre as 2 versões ao mesmo tempo use a visão em diff',
		rollbackTo: 'Reverter à',
		selectVersion: 'Selecione versão',
		view: 'Ver',
	},
	scripts: {
		editscript: 'Editar arquivo de script',
	},
	sections: {
		concierge: 'Porteiro',
		content: 'Conteúdo',
		courier: 'Mensageiro',
		developer: 'Desenvolvedor',
		installer: 'Assistente de Configuração Umbraco',
		media: 'Mídia',
		member: 'Membros',
		newsletters: 'Boletins Informativos',
		settings: 'Configurações',
		statistics: 'Estatísticas',
		translation: 'Tradução',
		users: 'Usuários',
	},
	settings: {
		defaulttemplate: 'Modelo padrão',
		importDocumentTypeHelp:
			'Para importar um tipo de documento encontre o arquivo ".udt" em seu computador clicando em "Navegar" e depois clicando em "Importar"(você pode confirmar na próxima tela)',
		newtabname: 'Novo Título da Guia',
		nodetype: 'Tipo de Nó',
		objecttype: 'Tipo',
		stylesheet: 'Stylesheet',
		tab: 'Guia',
		tabname: 'Título da Guia',
		tabs: 'Guias',
	},
	sort: {
		sortOrder: 'Sort order',
		sortCreationDate: 'Creation date',
		sortDone: 'Classificação concluída.',
		sortHelp:
			'Arraste os diferentes itens para cima ou para baixo para definir como os mesmos serão arranjados. Ou clique no título da coluna para classificar a coleção completa de itens',
		sortPleaseWait: 'Favor esperar. Itens estão sendo classificados, isto pode demorar um tempo.',
	},
	speechBubbles: {
		contentPublishedFailedByEvent: 'Publicação foi cancelada por add-in de terceiros',
		contentTypeDublicatePropertyType: 'Tipo de propriedade já existe',
		contentTypePropertyTypeCreated: 'Tipo de propriedade criada',
		contentTypePropertyTypeCreatedText: 'Nome: %0% <br /> Tipo de Dado: %1%',
		contentTypePropertyTypeDeleted: 'Tipo de propriedade removido',
		contentTypeSavedHeader: 'Tipo de Documento salvo',
		contentTypeTabCreated: 'Guia criada',
		contentTypeTabDeleted: 'Guia removida',
		contentTypeTabDeletedText: 'Guia com ID: %0% removida',
		cssErrorHeader: 'Stylesheet não salva',
		cssSavedHeader: 'Stylesheet salva',
		cssSavedText: 'Stylesheet salva sem nenhum erro',
		dataTypeSaved: 'Typo de Dado salvo',
		dictionaryItemSaved: 'Item de Dicionário salvo',
		editContentPublishedFailedByParent: 'Publicação falhou porque a página pai não está publicada',
		editContentPublishedHeader: 'Conteúdo publicado',
		editContentPublishedText: 'e visível no website',
		editContentSavedHeader: 'Conteúdo salvo',
		editContentSavedText: 'Lembre-se de publicar para tornar as mudanças visíveis',
		editContentSendToPublish: 'Enviado para Aprovação',
		editContentSendToPublishText: 'Alterações foram enviadas para aprovação',
		editMemberSaved: 'Membro salvo',
		editStylesheetPropertySaved: 'Propriedade de Stylesheet salva',
		editStylesheetSaved: 'Stylesheet salva',
		editTemplateSaved: 'Modelo salvo',
		editUserError: 'Erro ao salvar usuário (verificar log)',
		editUserSaved: 'Usuário Salvo',
		fileErrorHeader: 'Arquivo não salvo',
		fileErrorText: 'Arquivo não pode ser salvo. Favor checar as permissões do arquivo',
		fileSavedHeader: 'Arquivo salvo',
		fileSavedText: 'Arquivo salvo sem nenhum erro',
		languageSaved: 'Linguagem salva',
		templateErrorHeader: 'Modelo não salvo',
		templateErrorText: 'Favor confirmar que não existem 2 modelos com o mesmo apelido',
		templateSavedHeader: 'Modelo salvo',
		templateSavedText: 'Modelo salvo sem nenhum erro!',
	},
	stylesheet: {
		aliasHelp: 'Use sintaxe CSS ex: h1, .redHeader, .blueTex',
		editstylesheet: 'Editar stylesheet',
		editstylesheetproperty: 'Editar propriedade do stylesheet',
		nameHelp: 'Nome para identificar a propriedade de estilo no editor de texto rico (richtext)',
		preview: 'Prévia',
		styles: 'Estilos',
	},
	template: {
		edittemplate: 'Editar modelo',
		insertContentArea: 'Inserir área de conteúdo',
		insertContentAreaPlaceHolder: 'Inserir área de conteúdo em espaço reservado',
		insertDictionaryItem: 'Inserir item de dicionário',
		insertMacro: 'Inserir Macro',
		insertPageField: 'Inserir campo de página Umbraco',
		mastertemplate: 'Modelo mestre',
		quickGuide: 'Guia rápido para etiquetas de modelos Umbraco',
		template: 'Modelo',
	},
	grid: {
		media: 'Image',
		macro: 'Macro',
		insertControl: 'Choose type of content',
		chooseLayout: 'Choose a layout',
		addRows: 'Add a row',
		addElement: 'Add content',
		dropElement: 'Drop content',
		settingsApplied: 'Settings applied',
		contentNotAllowed: 'This content is not allowed here',
		contentAllowed: 'This content is allowed here',
		clickToEmbed: 'Click to embed',
		clickToInsertImage: 'Click to insert image',
		placeholderWriteHere: 'Write here...',
		gridLayouts: 'Grid Layouts',
		gridLayoutsDetail:
			'Layouts are the overall work area for the grid editor, usually you only need one or two different layouts',
		addGridLayout: 'Add Grid Layout',
		addGridLayoutDetail: 'Adjust the layout by setting column widths and adding additional sections',
		rowConfigurations: 'Row configurations',
		rowConfigurationsDetail: 'Rows are predefined cells arranged horizontally',
		addRowConfiguration: 'Add row configuration',
		addRowConfigurationDetail: 'Adjust the row by setting cell widths and adding additional cells',
		columns: 'Columns',
		columnsDetails: 'Total combined number of columns in the grid layout',
		settings: 'Settings',
		settingsDetails: 'Configure what settings editors can change',
		styles: 'Styles',
		stylesDetails: 'Configure what styling editors can change',
		allowAllEditors: 'Allow all editors',
		allowAllRowConfigurations: 'Allow all row configurations',
	},
	templateEditor: {
		alternativeField: 'Campo alternativo',
		alternativeText: 'Texto alternativo',
		casing: 'Letra Maíscula ou minúscula',
		chooseField: 'Escolha campo',
		convertLineBreaks: 'Converter Quebra de Linhas',
		convertLineBreaksHelp: 'Substitui quebra de linhas com a etiqueta html &lt;br&gt;',
		dateOnly: 'Sim, Data somente',
		formatAsDate: 'Formatar como data',
		htmlEncode: 'Codificar HTML',
		htmlEncodeHelp: 'Vai substituir caracteres especiais por seus equivalentes em HTML.',
		insertedAfter: 'Será inserida após o valor do campo',
		insertedBefore: 'Será inserida antes do valor do campo',
		lowercase: 'Minúscula',
		none: 'Nenhum',
		postContent: 'Inserir após campo',
		preContent: 'Inserir antes do campo',
		recursive: 'Recursivo',
		removeParagraph: 'Remover etiquetas de parágrafo',
		removeParagraphHelp: 'Removerá quaisquer &lt;P&gt; do começo ao fim do texto',
		uppercase: 'Maiúscula',
		urlEncode: 'Codificar URL',
		urlEncodeHelp: 'Vai formatar caracteres especiais em URLs',
		usedIfAllEmpty: 'Será usado somente quando os valores nos campos acima estiverem vazios',
		usedIfEmpty: 'Este campo somente será usado se o campo primário estiver em vazio',
		withTime: 'Sim, com hora. Separador:',
	},
	translation: {
		details: 'Detalhes da Tradução',
		DownloadXmlDTD: 'Download Xml DTD',
		fields: 'Campos',
		includeSubpages: 'Incluir sub-páginas',
		mailBody:
			"Olá %0%\n\n      Este é um email automatizado para informar que o documento '%1%' foi enviado para ser traduzido em '%5%' por %2%.\n\n      Vá para http://%3%/translation/details.aspx?id=%4% para editar.\n\n      Ou visite o Umbraco para ter uma visão geral das tarefas de tradução\n      http://%3%\n\n      Tenha um bom dia!\n\n      Saudações do robô Umbraco\n    ",
		noTranslators:
			'Nenhum usuário tradutor encontrado. Favor criar um usuário tradutor antes que possa começar a enviar conteúdo para tradução',
		pageHasBeenSendToTranslation: "A página '%0%' foi enviada para tradução",
		sendToTranslate: "Enviar página '%0%' para tradução",
		totalWords: 'Total de palavras',
		translateTo: 'Traduzir para',
		translationDone: 'Tradução concluída.',
		translationDoneHelp:
			'Você pode visualizar as páginas que acaba de traduzir ao clicar abaixo. Se a página original for encontrada você poderá fazer a comparação entre as 2 páginas.',
		translationFailed: 'Tradução falhou, o arquivo xml pode estar corrupto',
		translationOptions: 'Opções de Tradução',
		translator: 'Tradutor',
		uploadTranslationXml: 'Upload Xml de Tradução',
	},
	treeHeaders: {
		cacheBrowser: 'Navegador de Cache',
		contentRecycleBin: 'Lixeira',
		createdPackages: 'Pacotes criados',
		dataTypes: 'Tipo de Dado',
		dictionary: 'Dicionário',
		installedPackages: 'Pacotes instalados',
		installSkin: 'Instalar tema',
		installStarterKit: 'Instalar kit de iniciante',
		languages: 'Linguagens',
		localPackage: 'Instalar pacote local',
		macros: 'Macros',
		mediaTypes: 'Tipos de Mídia',
		member: 'Membros',
		memberGroups: 'Grupos de Membros',
		memberRoles: 'Funções',
		memberTypes: 'Tipo de Membro',
		documentTypes: 'Tipos de Documentos',
		packager: 'Pacotes',
		packages: 'Pacotes',
		repositories: 'Instalar desde o repositório',
		runway: 'Instalar Runway',
		runwayModules: 'Módulos Runway',
		scripting: 'Arquivos de Script',
		scripts: 'Scripts',
		stylesheets: 'Stylesheets',
		templates: 'Modelos',
		userPermissions: 'Permissões de usuário',
		userTypes: 'Tipos de Usuários',
		users: 'Usuários',
	},
	update: {
		updateAvailable: 'Nova atualização pronta',
		updateDownloadText: '%0% está pronto, clique aqui para download',
		updateNoServer: 'Nenhuma conexão ao servidor',
		updateNoServerError:
			'Erro ao procurar por atualização. Favor revisar os detalhes (stack-trace) para mais informações',
	},
	user: {
		administrators: 'Administrador',
		categoryField: 'Campo de Categoria',
		changePassword: 'Alterar Sua Senha',
		changePasswordDescription:
			"você pode alterar sua senha para acessar a área administrativa do Umbraco preenchendo o formulário abaixo e clicando no botão 'Alterar Senha'",
		contentChannel: 'Canal de Conteúdo',
		descriptionField: 'Campo de descrição',
		disabled: 'Desabilitar Usuário',
		documentType: 'Tipo de Documento',
		editors: 'Editor',
		excerptField: 'Campo de excerto',
		language: 'Linguagem',
		loginname: 'Login',
		mediastartnode: 'Nó Inicial na Biblioteca de Mídia',
		modules: 'Seções',
		noConsole: 'Desabilitar Acesso Umbraco',
		password: 'Senha',
		passwordChanged: 'Sua senha foi alterada!',
		passwordConfirm: 'Favor confirmar sua nova senha',
		passwordEnterNew: 'Digite sua nova senha',
		passwordIsBlank: 'Sua nova senha não pode estar em branco!',
		passwordIsDifferent: 'Há uma diferença entre a nova senha e a confirmação da senha. Favor tentar novamente!',
		passwordMismatch: 'A confirmação da senha não é igual à nova senha!',
		permissionReplaceChildren: 'Substituir permissões do nó filho',
		permissionSelectedPages: 'Vocês está modificando permissões para as páginas no momento:',
		permissionSelectPages: 'Selecione páginas para modificar suas permissões',
		searchAllChildren: 'Buscar todos filhos',
		startnode: 'Nó Inicial do Conteúdo',
		username: 'Nome de Usuário',
		userPermissions: 'Permissões de usuário',
		usertype: 'Tipo de usuário',
		userTypes: 'Tipos de usuários',
		writer: 'Escrevente',
		sortCreateDateAscending: 'Mais antigo',
		sortCreateDateDescending: 'Mais recente',
	},
	logViewer: {
		selectAllLogLevelFilters: 'Selecionar tudo',
		deselectAllLogLevelFilters: 'Desmarcar todos',
	},
} as UmbLocalizationDictionary;
