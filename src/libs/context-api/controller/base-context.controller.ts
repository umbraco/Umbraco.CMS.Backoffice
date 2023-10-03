import type { UmbContextToken } from "../token/index.js";
import { UmbBaseController, UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";

export abstract class UmbBaseContext extends UmbBaseController {
	constructor(host: UmbControllerHost, alias: string | UmbContextToken) {
		super(host);
		this.provideContext(alias, this);
	}
}
