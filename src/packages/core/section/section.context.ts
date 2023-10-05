import type { ManifestSection } from '@umbraco-cms/backoffice/extension-registry';
import { UmbStringState } from '@umbraco-cms/backoffice/observable-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbControllerHost, UmbBaseContext } from '@umbraco-cms/backoffice/controller-api';

export class UmbSectionContext extends UmbBaseContext {
	#manifestAlias = new UmbStringState<string | undefined>(undefined);
	#manifestPathname = new UmbStringState<string | undefined>(undefined);
	#manifestLabel = new UmbStringState<string | undefined>(undefined);
	public readonly alias = this.#manifestAlias.asObservable();
	public readonly pathname = this.#manifestPathname.asObservable();
	public readonly label = this.#manifestLabel.asObservable();

	constructor(host: UmbControllerHost, manifest: ManifestSection) {
		super(host, UMB_SECTION_CONTEXT_TOKEN);
		this.setManifest(manifest);
	}

	public setManifest(manifest?: ManifestSection) {
		this.#manifestAlias.next(manifest?.alias);
		this.#manifestPathname.next(manifest?.meta?.pathname);
		this.#manifestLabel.next(manifest ? manifest.meta?.label || manifest.name : undefined);
	}
}

export const UMB_SECTION_CONTEXT_TOKEN = new UmbContextToken<UmbSectionContext>('UmbSectionContext');
