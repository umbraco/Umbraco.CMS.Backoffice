import { UmbCultureServerDataSource } from './sources/culture.server.data';
import { UmbControllerHostInterface } from '@umbraco-cms/backoffice/controller';
import { UmbContextConsumerController } from '@umbraco-cms/backoffice/context-api';
import { UmbNotificationContext, UMB_NOTIFICATION_CONTEXT_TOKEN } from '@umbraco-cms/backoffice/notification';

export class UmbCultureRepository {
	#init!: Promise<unknown>;
	#host: UmbControllerHostInterface;

	#dataSource: UmbCultureServerDataSource;

	#notificationContext?: UmbNotificationContext;

	constructor(host: UmbControllerHostInterface) {
		this.#host = host;

		this.#dataSource = new UmbCultureServerDataSource(this.#host);

		this.#init = Promise.all([
			new UmbContextConsumerController(this.#host, UMB_NOTIFICATION_CONTEXT_TOKEN, (instance) => {
				this.#notificationContext = instance;
			}),
		]);
	}

	requestCultures({ skip, take } = { skip: 0, take: 1000 }) {
		return this.#dataSource.getCollection({ skip, take });
	}
}
