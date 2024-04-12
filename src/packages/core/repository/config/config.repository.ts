import { ServerService } from '@umbraco-cms/backoffice/external/backend-api';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';
import type { ServertimeOffset } from '@umbraco-cms/backoffice/models';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

export class UmbConfigRepository {
	#host;

	constructor(host: UmbControllerHost) {
		this.#host = host;
	}

	async getServertimeOffset(): Promise<ServertimeOffset> {
		// TODO: [LK] Add the server info to a store for reuse, wire up the umb version, etc.
		const { data } = await tryExecuteAndNotify(this.#host, ServerService.getServerInformation());

		if (!data) return { offset: 0 };

		const [h, m] = data.baseUtcOffset.split(':');
		const hours = Number.parseInt(h);
		const minutes = Number.parseInt(m);
		const offset = hours * 60 + (hours < 0 ? -minutes : minutes);

		return { offset };
	}
}
