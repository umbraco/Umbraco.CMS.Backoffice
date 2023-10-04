import type { UmbContextToken } from "../token/index.js";
import { UmbBaseController, UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";

export abstract class UmbBaseContext<BaseType = any, ResultType extends BaseType = BaseType> extends UmbBaseController {
	constructor(host: UmbControllerHost, alias: string | UmbContextToken<BaseType, ResultType> ) {
		super(host, alias.toString());
		this.provideContext(alias, this as unknown as ResultType);
	}
}
