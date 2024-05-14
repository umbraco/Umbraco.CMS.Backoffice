import type { ClassConstructor } from '../extension-api/types/utils.js';
import type { UmbControllerHost } from './controller-host.interface.js';
import type { UmbController } from './controller.interface.js';

interface UmbControllerHostBaseDeclaration extends Omit<UmbControllerHost, 'getHostElement'> {
	hostConnected(): void;
	hostDisconnected(): void;
	destroy(): void;
}

/**
 * This mixin enables a class to host controllers.
 * This enables controllers to be added to the life cycle of this element.
 *
 * @param {Object} superClass - superclass to be extended.
 * @mixin
 */
export const UmbControllerHostMixin = <T extends ClassConstructor>(superClass: T) => {
	class UmbControllerHostBaseClass extends superClass implements UmbControllerHostBaseDeclaration {
		#controllers: UmbController[] = [];

		#attached = false;

		getHostElement() {
			return undefined as any;
		}

		/**
		 * Tests if a controller is assigned to this element.
		 * @param {UmbController} ctrl
		 */
		hasUmbController(ctrl: UmbController): boolean {
			return this.#controllers.indexOf(ctrl) !== -1;
		}

		/**
		 * Retrieve controllers matching a filter of this element.
		 * @param {method} filterMethod
		 */
		getUmbControllers(filterMethod: (ctrl: UmbController) => boolean): UmbController[] {
			return this.#controllers.filter(filterMethod);
		}

		/**
		 * Append a controller to this element.
		 * @param {UmbController} ctrl
		 */
		addUmbController(ctrl: UmbController): void {
			// If this specific class is already added, then skip out.
			if (this.#controllers.indexOf(ctrl) !== -1) {
				return;
			}

			// Check if there is one already with same unique
			this.removeUmbControllerByAlias(ctrl.controllerAlias);

			this.#controllers.push(ctrl);
			if (this.#attached) {
				// If a controller is created on a already attached element, then it will be added directly. This might not be optimal. As the controller it self has not finished its constructor method jet. therefor i postpone the call: [NL]
				Promise.resolve().then(() => {
					// Extra check to see if we are still attached at this point:
					if (this.#attached) {
						ctrl.hostConnected();
					}
				});
			}
		}

		/**
		 * Remove a controller from this element.
		 * Notice this will also destroy the controller.
		 * @param {UmbController} ctrl
		 */
		removeUmbController(ctrl: UmbController): void {
			const index = this.#controllers.indexOf(ctrl);
			if (index !== -1) {
				this.#controllers.splice(index, 1);
				if (this.#attached) {
					ctrl.hostDisconnected();
				}
				ctrl.destroy();
			}
		}

		/**
		 * Remove a controller from this element by its alias.
		 * Notice this will also destroy the controller.
		 * @param {string | symbol} controllerAlias
		 */
		removeUmbControllerByAlias(controllerAlias: UmbController['controllerAlias']): void {
			if (controllerAlias) {
				this.#controllers.forEach((x) => {
					if (x.controllerAlias === controllerAlias) {
						this.removeUmbController(x);
					}
				});
			}
		}

		hostConnected(): void {
			this.#attached = true;
			// Note: this might not be optimal, as if hostDisconnected remove one of the controllers, then the next controller will be skipped.
			this.#controllers.forEach((ctrl: UmbController) => ctrl.hostConnected());
		}

		hostDisconnected(): void {
			this.#attached = false;
			// Note: this might not be optimal, as if hostDisconnected remove one of the controllers, then the next controller will be skipped.
			this.#controllers.forEach((ctrl: UmbController) => ctrl.hostDisconnected());
		}

		destroy(): void {
			let ctrl: UmbController | undefined;
			let prev = null;
			// Note: A very important way of doing this loop, as foreach will skip over the next item if the current item is removed.
			while ((ctrl = this.#controllers[0])) {
				ctrl.destroy();

				// Help developer realize that they made a mistake in code:
				if (ctrl === prev) {
					throw new Error(
						`Controller with controller alias: '${ctrl.controllerAlias?.toString()}' and class name: '${
							(ctrl as any).constructor.name
						}', does not remove it self when destroyed. This can cause memory leaks. Please fix this issue.\r\nThis usually occurs when you have a destroy() method that doesn't call super.destroy().`,
					);
				}
				prev = ctrl;
			}
			this.#controllers.length = 0;
		}
	}

	return UmbControllerHostBaseClass as unknown as ClassConstructor<UmbControllerHostBaseDeclaration> & T;
};
