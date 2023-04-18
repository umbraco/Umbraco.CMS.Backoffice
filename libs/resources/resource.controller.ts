/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	UmbNotificationOptions,
	UmbNotificationContext,
	UMB_NOTIFICATION_CONTEXT_TOKEN,
} from '@umbraco-cms/backoffice/notification';
import { ApiError, CancelError, CancelablePromise } from '@umbraco-cms/backoffice/backend-api';
import { UmbController, UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import { UmbContextConsumerController } from '@umbraco-cms/backoffice/context-api';
import type { DataSourceResponse } from '@umbraco-cms/backoffice/repository';

export class UmbResourceController extends UmbController {
	#promise: Promise<any>;

	#notificationContext?: UmbNotificationContext;

	constructor(host: UmbControllerHostElement, promise: Promise<any>, alias?: string) {
		super(host, alias);

		this.#promise = promise;

		new UmbContextConsumerController(host, UMB_NOTIFICATION_CONTEXT_TOKEN, (_instance) => {
			this.#notificationContext = _instance;
		});
	}

	hostConnected(): void {
		// Do nothing
	}

	hostDisconnected(): void {
		this.cancel();
	}

	/**
	 * Extract the ProblemDetailsModel object from an ApiError.
	 *
	 * This assumes that all ApiErrors contain a ProblemDetailsModel object in their body.
	 */
	static toProblemDetailsModel(error: unknown): ProblemDetailsModel | undefined {
		if (error instanceof ApiError) {
			try {
				if (error.body) {
					const errorDetails = (
						typeof error.body === 'string' ? JSON.parse(error.body) : error.body
					) as ProblemDetailsModel;
					return { status: 0, ...errorDetails };
				} else {
					// Generic error
					return {
						title: error.name,
						detail: error.message,
						status: error.status,
						statusText: error.statusText,
						request: error.request,
						stack: error.stack,
					} as ProblemDetailsModel;
				}
			} catch {
				return {
					title: error.name,
					detail: error.message,
					status: 0,
				};
			}
		} else if (error instanceof Error) {
			return {
				title: error.name,
				detail: error.message,
				stack: error.stack,
				status: 0,
			};
		}

		return undefined;
	}

	/**
	 * Base execute function with a try/catch block and return a tuple with the result and the error.
	 */
	static async tryExecute<T>(promise: Promise<T>): Promise<DataSourceResponse<T>> {
		try {
			return { data: await promise };
		} catch (error) {
			if (error instanceof ApiError || error instanceof CancelError) {
				return { error };
			}

			console.error('Unknown error', error);
			throw new Error('Unknown error');
		}
	}

	/**
	 * Wrap the {tryExecute} function in a try/catch block and return the result.
	 * If the executor function throws an error, then show the details in a notification.
	 */
	async tryExecuteAndNotify<T>(): Promise<DataSourceResponse<T>> {
		const { data, error } = await UmbResourceController.tryExecute<T>(this.#promise);

		if (error) {
			/**
			 * Determine if we want to show a notification or just log the error to the console.
			 * If the error is not a recognizable system error (i.e. a HttpError), then we will show a notification
			 * with the error details using the default notification options.
			 */
			if (error instanceof CancelError) {
				// Cancelled - do nothing
			} else {
				// ApiError - body could hold a ProblemDetailsModel from the server
				(error as any).body = typeof error.body === 'string' ? JSON.parse(error.body) : error.body;

				// Go through the error status codes and act accordingly
				switch (error.status ?? 0) {
					case 401:
						// Unauthorized
						console.log('Unauthorized');
						break;
					default:
						// Other errors
						this.#notifications$.next({
							headline: error.body.title ?? error.name ?? 'Server Error',
							message: error.body.detail ?? error.message ?? 'Something went wrong',
						});
				}
			}
		}

		return { data, error };
	}

	/**
	 * Cancel all resources that are currently being executed by this controller if they are cancelable.
	 *
	 * This works by checking if the promise is a CancelablePromise and if so, it will call the cancel method.
	 *
	 * This is useful when the controller is being disconnected from the DOM.
	 *
	 * @see CancelablePromise
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortController
	 */
	cancel() {
		if (this.#promise instanceof CancelablePromise) {
			this.#promise.cancel();
		}
	}

	destroy() {
		super.destroy();
		this.cancel();
	}
}
