import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import { UmbArrayState } from '@umbraco-cms/backoffice/observable-api';
import { UMB_BADGE_CONTEXT } from './badge.context-token.js';
import type { UmbBadge } from './index.js';

export class UmbBadgeContext<BadgeType extends UmbBadge = UmbBadge> extends UmbContextBase<UmbBadgeContext> {
	#badges = new UmbArrayState<BadgeType>([], (x) => x.unique);
	public badges = this.#badges.asObservable();

	public addBadge(badge: BadgeType) {
		this.#badges.appendOne(badge);
	}

	public removeBadge(unique: string) {
		this.#badges.removeOne(unique);
	}

	public setBadges(badges: Array<BadgeType>) {
		this.#badges.setValue(badges);
	}

	constructor(host: UmbControllerHost) {
		super(host, UMB_BADGE_CONTEXT.toString());

		console.log('UmbBadgeContext', this);
	}
}

export { UmbBadgeContext as api };
