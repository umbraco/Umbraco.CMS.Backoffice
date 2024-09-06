import type {
	UmbNotificationOptions,
	UmbNotificationColor,
	UmbNotificationDefaultData,
} from './notification.context.js';
import type { UUIToastNotificationElement } from '@umbraco-cms/backoffice/external/uui';
import { UmbId } from '@umbraco-cms/backoffice/id';

/**
 * @class UmbNotificationHandler
 */
export class UmbNotificationHandler {
	private _closeResolver: any;
	private _closePromise: Promise<any>;
	private _elementName?: string;
	private _data?: UmbNotificationDefaultData;

	private _defaultColor: UmbNotificationColor = 'default';
	private _defaultDuration = 6000;
	private _defaultLayout = 'umb-notification-layout-default';

	public key: string;
	public element: any;
	public color: UmbNotificationColor;
	public duration: number | null;

	/**
	 * Creates an instance of UmbNotificationHandler.
	 * @param {UmbNotificationOptions} options
	 * @memberof UmbNotificationHandler
	 */
	constructor(options: UmbNotificationOptions) {
		this.key = UmbId.new();
		this.color = options.color || this._defaultColor;
		this.duration = options.duration !== undefined ? options.duration : this._defaultDuration;

		this._elementName = options.elementName || this._defaultLayout;
		this._data = options.data;

		this._closePromise = new Promise((res) => {
			this._closeResolver = res;
		});

		this._createElement();
	}

	/**
	 * @private
	 * @memberof UmbNotificationHandler
	 */
	private _createElement() {
		if (!this._elementName) return;

		const notification: UUIToastNotificationElement = document.createElement('uui-toast-notification');

		notification.color = this.color;
		notification.autoClose = this.duration;

		const element: any = document.createElement(this._elementName);
		element.data = this._data;
		element.notificationHandler = this;

		notification.appendChild(element);

		this.element = notification;
	}

	/**
	 * Updates the notification
	 * @param {UmbNotificationOptions} options - The new options
	 */
	public Update(options: UmbNotificationOptions) {
		this.color = options.color || this.color;
		this.duration = options.duration !== undefined ? options.duration : this.duration;

		this._elementName = options.elementName || this._elementName;

		this._data = options.data;

		this.element.color = this.color;
		this.element.autoClose = this.duration;

		const notificationChild = this.element.children?.[0];
		if (notificationChild?.data) {
			notificationChild.data = { ...this.element.children[0].data, ...this._data };
		}
	}

	/**
	 * @param {...any} args
	 * @memberof UmbNotificationHandler
	 */
	public close(...args: any) {
		this._closeResolver(...args);
		this.element.open = false;
	}

	/**
	 * @returns {*}
	 * @memberof UmbNotificationHandler
	 */
	public onClose(): Promise<any> {
		return this._closePromise;
	}
}
