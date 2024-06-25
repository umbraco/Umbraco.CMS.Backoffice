import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import { UMB_BADGE_CONTEXT } from './badge.context-token.js';

export abstract class UmbBadgeContext extends UmbContextBase<UmbBadgeContext> {
	public unique?: string;

	constructor(host: UmbControllerHost) {
		super(host, UMB_BADGE_CONTEXT.toString());
	}
}

export { UmbBadgeContext as api };
