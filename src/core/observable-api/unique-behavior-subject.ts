import { BehaviorSubject, distinctUntilChanged, map, Observable, shareReplay } from "rxjs";


// TODO: Should this handle array as well?
function deepFreeze<T>(inObj: T): T {
	if(typeof inObj === 'object') {
		Object.freeze(inObj);

		Object.getOwnPropertyNames(inObj)?.forEach(function (prop) {
			// eslint-disable-next-line no-prototype-builtins
			if ((inObj as any).hasOwnProperty(prop)
				&& (inObj as any)[prop] != null
				&& typeof (inObj as any)[prop] === 'object'
				&& !Object.isFrozen((inObj as any)[prop])) {
					deepFreeze((inObj as any)[prop]);
				}
		});
	}
	return inObj;
}


export function naiveObjectComparison(objOne: any, objTwo: any): boolean {
	return JSON.stringify(objOne) === JSON.stringify(objTwo);
}




type MappingFunction<T, R> = (mappable: T) => R;
type MemoizationFunction<R> = (previousResult: R, currentResult: R) => boolean;

function defaultMemoization(previousValue: any, currentValue: any): boolean {
	if (typeof previousValue === 'object' && typeof currentValue === 'object') {
	return naiveObjectComparison(previousValue, currentValue);
	}
	return previousValue === currentValue;
}

/**
 * @export
 * @method CreateObservablePart
 * @param {Observable<T>} source - RxJS Subject to use for this Observable.
 * @param {(mappable: T) => R} mappingFunction - Method to return the part for this Observable to return.
 * @param {(previousResult: R, currentResult: R) => boolean} [memoizationFunction] - Method to Compare if the data has changed. Should return true when data is different.
 * @description - Creates a RxJS Observable from RxJS Subject.
 * @example <caption>Example create a Observable for part of the data Subject.</caption>
 * public readonly myPart = CreateObservablePart(this._data, (data) => data.myPart);
 */
export function CreateObservablePart<T, R> (
	source$: Observable<T>,
		mappingFunction: MappingFunction<T, R>,
		memoizationFunction?: MemoizationFunction<R>
	): Observable<R> {
	return source$.pipe(
		map(mappingFunction),
		distinctUntilChanged(memoizationFunction || defaultMemoization),
		shareReplay(1)
	)
}


/**
 * @export
 * @class UniqueBehaviorSubject
 * @extends {BehaviorSubject<T>}
 * @description - A RxJS BehaviorSubject which deepFreezes the data to ensure its not manipulated from any implementations.
 * Additionally the Subject ensures the data is unique, not updating any Observes unless there is an actual change of the content.
 */
export class UniqueBehaviorSubject<T> extends BehaviorSubject<T> {
	constructor(initialData: T) {
		super(deepFreeze(initialData));
	}

	next(newData: T): void {
		const frozenData = deepFreeze(newData);
		// Only update data if its different than current data.
		if (!naiveObjectComparison(frozenData, this.getValue())) {
			super.next(frozenData);
		}
	}

	/**
	 * Partial update data set, only works for Objects.
	 * TODO: consider moving this into a specific class for Objects?
	 * Consider doing similar for Array?
	 */
	update(data: Partial<T>) {
		this.next({ ...this.getValue(), ...data });
	}
}
