export interface UmbEntitySelectedEventArgs {
	unique: string | null;
	entityType: string;
}

export class UmbEntitySelectedEvent extends Event {
	public static readonly TYPE = 'entity-deselected';
	#args: UmbEntitySelectedEventArgs;

	public constructor(args: UmbEntitySelectedEventArgs) {
		// mimics the native change event
		super(UmbEntitySelectedEvent.TYPE, { bubbles: true, composed: false, cancelable: false });
		this.#args = args;
	}

	getEntityType(): string {
		return this.#args.entityType;
	}

	getUnique(): string | null {
		return this.#args.unique;
	}
}
