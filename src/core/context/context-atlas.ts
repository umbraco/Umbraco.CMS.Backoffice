//TODO put all string literals here as static constants

export class UmbContextAtlas {
	public static readonly NodeStore = 'umbNodeStore';
	public static readonly DataTypeStore = 'umbDataTypeStore';
	public static readonly DocumentTypeStore = 'umbDocumentTypeStore';
	public static readonly SectionStore = 'umbSectionStore';

	public static readonly getAll = () => {
		const filter = Object.keys(UmbContextAtlas).filter((key: string) => {
			return key !== 'getAll';
		});

		return filter.map((key: string) => {
			return UmbContextAtlas[key]; //TODO It works, but TS is complaining, fix this
		});
	};
}
