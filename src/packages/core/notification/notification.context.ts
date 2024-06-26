import { UmbNotificationHandler } from './notification-handler.js';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import { UmbArrayState, UmbBasicState } from '@umbraco-cms/backoffice/observable-api';

/**
 * The default data of notifications
 * @export
 * @interface UmbNotificationDefaultData
 */
export interface UmbNotificationDefaultData {
	message: string;
	headline?: string;
}

/**
 * @export
 * @interface UmbNotificationOptions
 * @template UmbNotificationData
 */
export interface UmbNotificationOptions<UmbNotificationData = UmbNotificationDefaultData> {
	color?: UmbNotificationColor;
	duration?: number | null;
	elementName?: string;
	data?: UmbNotificationData;
	group?: string;
}

export type UmbNotificationColor = '' | 'default' | 'positive' | 'warning' | 'danger';

export class UmbNotificationContext extends UmbContextBase<UmbNotificationContext> {
	// Notice this cannot use UniqueBehaviorSubject as it holds a HTML Element. which cannot be Serialized to JSON (it has some circular references)
	private _notifications = new UmbBasicState(<Array<UmbNotificationHandler>>[]);
	public readonly notifications = this._notifications.asObservable();

	#toasts = new UmbArrayState<UmbNotificationOptions>([], (x) => x);

	constructor(host: UmbControllerHost) {
		super(host, UMB_NOTIFICATION_CONTEXT);
	}

	/**
	 * @private
	 * @param {UmbNotificationOptions<UmbNotificationData>} options
	 * @return {*}  {UmbNotificationHandler}
	 * @memberof UmbNotificationContext
	 */
	private _open(options: UmbNotificationOptions): UmbNotificationHandler {
		const notificationHandler = new UmbNotificationHandler(options);
		notificationHandler.element.addEventListener('closed', () => this._handleClosed(notificationHandler));

		this._notifications.setValue([...this._notifications.getValue(), notificationHandler]);

		return notificationHandler;
	}

	/**
	 * @private
	 * @param {string} key
	 * @memberof UmbNotificationContext
	 */
	private _close(key: string) {
		this._notifications.setValue(this._notifications.getValue().filter((notification) => notification.key !== key));
	}

	/**
	 * @private
	 * @param {string} key
	 * @memberof UmbNotificationContext
	 */
	private _handleClosed(notificationHandler: UmbNotificationHandler) {
		notificationHandler.element.removeEventListener('closed', () => this._handleClosed(notificationHandler));
		this._close(notificationHandler.key);
	}

	/**
	 * Opens a notification that automatically goes away after 6 sek.
	 * @param {UmbNotificationColor} color
	 * @param {UmbNotificationOptions<UmbNotificationData>} options
	 * @return {*}
	 * @memberof UmbNotificationContext
	 */
	public peek(color: UmbNotificationColor, options: UmbNotificationOptions): UmbNotificationHandler {
		return this._open({ color, ...options });
	}

	/**
	 * Appends a notification to a group that can be opened later.
	 * @param {UmbNotificationOptions<UmbNotificationData>} options
	 * @return {*}
	 * @memberof UmbNotificationContext
	 */
	public append(options: UmbNotificationOptions) {
		this.#toasts.appendOne(options);
	}

	/**
	 * Opens all notifications from a specific group that automatically goes away after 6 sek.
	 * @param {string} group
	 * @return {*}
	 * @memberof UmbNotificationContext
	 */
	public peekAll(group: string) {
		const toasts = this.#toasts.getValue().filter((toast) => toast.group === group);

		const builtNotifications: Array<UmbNotificationOptions> = [];

		toasts.forEach((toast) => {
			// We only group matching colors.
			const mergeIndex = builtNotifications.findIndex((notification) => notification.color === toast.color);

			if (mergeIndex === -1) {
				// Not found. Create new toast.
				builtNotifications.push(toast);
			} else {
				// Same color found, merge toasts.
				const original = builtNotifications[mergeIndex];

				let headline = original.data?.headline;
				let message = original.data!.message!;

				headline = toast.data?.headline ? headline + ' \n' + toast.data.headline : headline;
				message = toast.data?.message ? message + ' \n' + toast.data.message : message;

				builtNotifications[mergeIndex] = { ...original, data: { headline, message } };
			}

			this.#toasts.removeOne(toast);
		});

		builtNotifications.forEach((notification) => this.peek(notification.color!, notification));
	}

	/**
	 * Opens a notification that stays on the screen until dismissed by the user or custom code
	 * @param {UmbNotificationColor} color
	 * @param {UmbNotificationOptions<UmbNotificationData>} options
	 * @return {*}
	 * @memberof UmbNotificationContext
	 */
	public stay(color: UmbNotificationColor, options: UmbNotificationOptions): UmbNotificationHandler {
		return this._open({ ...options, color, duration: null });
	}
}

export const UMB_NOTIFICATION_CONTEXT = new UmbContextToken<UmbNotificationContext>('UmbNotificationContext');
