import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';

export const UMB_BADGE_CONTEXT = 'UMB_BADGE_CONTEXT';

export abstract class UmbBadgeContext extends UmbContextBase<UmbBadgeContext> {
	public unique?: string;

	constructor(host: UmbControllerHost) {
		super(host, UMB_BADGE_CONTEXT.toString());
	}
}

export { UmbBadgeContext as api };
