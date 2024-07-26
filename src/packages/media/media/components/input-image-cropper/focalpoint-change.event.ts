export class UmbFocalPointChangeEvent extends Event {
	public static readonly TYPE = 'focalpoint-change';

	public top: number;
	public left: number;

	public constructor(top: number, left: number, args?: EventInit) {
		// mimics the native change event
		super(UmbFocalPointChangeEvent.TYPE, { bubbles: false, composed: false, cancelable: false, ...args });
		this.top = top;
		this.left = left;
	}
}