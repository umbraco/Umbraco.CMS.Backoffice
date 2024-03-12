export interface UmbEntityDeselectedEventArgs {
	unique: string | null;
	entityType: string;
}

export class UmbEntityDeselectedEvent extends Event {
	public static readonly TYPE = 'entity-deselected';
	#args: UmbEntityDeselectedEventArgs;

	public constructor(args: UmbEntityDeselectedEventArgs) {
		// mimics the native change event
		super(UmbEntityDeselectedEvent.TYPE, { bubbles: true, composed: false, cancelable: false });
		this.#args = args;
	}

	getEntityType(): string {
		return this.#args.entityType;
	}

	getUnique(): string | null {
		return this.#args.unique;
	}
}
