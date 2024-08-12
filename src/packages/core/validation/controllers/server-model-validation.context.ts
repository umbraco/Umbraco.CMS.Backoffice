import type { UmbValidationMessageTranslator } from '../translators/validation-message-path-translator.interface.js';
import type { UmbValidator } from '../interfaces/validator.interface.js';
import { UmbDataPathPropertyValueFilter } from '../utils/data-path-property-value-filter.function.js';
import { UMB_VALIDATION_CONTEXT } from '../context/validation.context-token.js';
import { UMB_VALIDATION_EMPTY_LOCALIZATION_KEY } from '../const.js';
import { UMB_SERVER_MODEL_VALIDATION_CONTEXT } from './server-model-validation.context-token.js';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import type { UmbDataSourceResponse } from '@umbraco-cms/backoffice/repository';

/** This should ideally be generated by the server, but we currently don't generate error-model-types. */
interface ValidateErrorResponseBodyModel {
	detail: string;
	errors: Record<string, Array<string>>;
	missingProperties: Array<string>;
	operationStatus: string;
	status: number;
	title: string;
	type: string;
}

export class UmbServerModelValidationContext
	extends UmbContextBase<UmbServerModelValidationContext>
	implements UmbValidator
{
	#init: Promise<typeof UMB_VALIDATION_CONTEXT.TYPE>;

	#validatePromise?: Promise<void>;
	#validatePromiseResolve?: () => void;

	#context?: typeof UMB_VALIDATION_CONTEXT.TYPE;
	#isValid = true;

	#data: any;
	getData(): any {
		return this.#data;
	}

	constructor(host: UmbControllerHost) {
		super(host, UMB_SERVER_MODEL_VALIDATION_CONTEXT);
		this.#init = this.consumeContext(UMB_VALIDATION_CONTEXT, (context) => {
			if (this.#context) {
				this.#context.removeValidator(this);
			}
			this.#context = context;
			context.addValidator(this);

			// Run translators?
		}).asPromise();
	}

	async askServerForValidation(data: unknown, requestPromise: Promise<UmbDataSourceResponse<string>>): Promise<void> {
		this.#context?.messages.removeMessagesByType('server');

		this.#isValid = false;
		//this.#validatePromiseReject?.();
		this.#validatePromise = new Promise<void>((resolve) => {
			this.#validatePromiseResolve = resolve;
		});

		// Store this state of the data for translator look ups:
		this.#data = data;
		// Ask the server for validation...
		const { error } = await requestPromise;

		this.#isValid = error ? false : true;

		if (!this.#isValid) {
			if (!this.#context) {
				throw new Error('No context available for translation.');
			}

			// We are missing some typing here, but we will just go wild with 'as any': [NL]
			const errorBody = (error as any).body as ValidateErrorResponseBodyModel;
			// Check if there are validation errors, since the error might be a generic ApiError
			if (errorBody?.errors) {
				Object.keys(errorBody.errors).forEach((path) => {
					//serverFeedback.push({ path, messages: errorBody.errors[path] });
					this.#context!.messages.addMessages('server', path, errorBody.errors[path]);
				});
			}
			// Check if there are missing properties:
			if (errorBody?.missingProperties) {
				// Retrieve the variants of he send data, as those are the once we will declare as missing properties:
				// Temporary fix for missing properties, as we currently get one for each variant, but we do not know which variant it is for: [NL]
				const uniqueMissingProperties = [...new Set(errorBody.missingProperties)];
				uniqueMissingProperties.forEach((alias) => {
					this.#data.variants.forEach((variant: any) => {
						const path = `$.values[${UmbDataPathPropertyValueFilter({
							alias: alias,
							culture: variant.culture,
							segment: variant.segment,
						})}].value`;
						// TODO: Make a const that holds this translation-key:
						this.#context!.messages.addMessages('server', path, [UMB_VALIDATION_EMPTY_LOCALIZATION_KEY]);
					});
				});
			}
		}

		this.#validatePromiseResolve?.();
		this.#validatePromiseResolve = undefined;
	}

	async addTranslator(translator: UmbValidationMessageTranslator) {
		await this.#init;
		this.#context!.messages.addTranslator(translator);
	}

	async removeTranslator(translator: UmbValidationMessageTranslator) {
		await this.#init;
		this.#context!.messages.removeTranslator(translator);
	}

	get isValid(): boolean {
		return this.#isValid;
	}
	async validate(): Promise<void> {
		if (this.#validatePromise) {
			await this.#validatePromise;
		}
		return this.#isValid ? Promise.resolve() : Promise.reject();
	}

	reset(): void {}

	focusFirstInvalidElement(): void {}

	override hostConnected(): void {
		super.hostConnected();
		if (this.#context) {
			this.#context.addValidator(this);
		}
	}
	override hostDisconnected(): void {
		super.hostDisconnected();
		if (this.#context) {
			this.#context.removeValidator(this);
			this.#context = undefined;
		}
	}

	override destroy(): void {
		// TODO: make sure we destroy things properly:
		super.destroy();
	}
}