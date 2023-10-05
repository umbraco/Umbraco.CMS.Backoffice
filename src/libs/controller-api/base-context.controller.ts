import type { UmbContextToken } from "../context-api/token/index.js";
import { UmbBaseController, UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";

export abstract class UmbBaseContextController<BaseType = any, ResultType extends BaseType = BaseType> extends UmbBaseController {
	constructor(host: UmbControllerHost, alias: string | UmbContextToken<BaseType, ResultType> ) {
		super(host, alias.toString());
		this.provideContext(alias, this as unknown as ResultType);
	}
}
