export class UmbMasonryItemUpdatedEvent extends Event {
	public static readonly TYPE = 'masonry-item-updated';

	public constructor() {
		// mimics the native change event
		super(UmbMasonryItemUpdatedEvent.TYPE, { bubbles: true, composed: false, cancelable: false });
	}
}
