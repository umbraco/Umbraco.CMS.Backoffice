/**
 * Change the collection of Contexts into a simplified array of data
 * 
 * @param contexts This is a map of the collected contexts from umb-debug
 * @returns An array of simplified context data 
 */
export function contextData(contexts:Map<any, any>): Array<DebugContextData> {
    const contextData = new Array<DebugContextData>;
    for (const [alias, instance] of contexts) {

        const data:DebugContextItemData = contextItemData(instance);
        contextData.push({ alias: alias, type: typeof instance, data });
    }
    return contextData;
}

/**
 * Used to find the methods and properties of a context
 * 
 * @param contextInstance The instance of the context
 * @returns A simplied object contain the properties and methods of the context
 */
function contextItemData(contextInstance:any):DebugContextItemData {
    let  contextItemData:DebugContextItemData = { type: 'unknown' };

    if (typeof contextInstance === 'function') {
        contextItemData = { ...contextItemData, type: 'function'};
    } else if (typeof contextInstance === 'object') {
        contextItemData = { ...contextItemData, type: 'object' };

        const methodNames = getClassMethodNames(contextInstance);
        if (methodNames.length) {
            contextItemData = { ...contextItemData, methods: methodNames };

            const props = [];
            for (const key in contextInstance) {
                if (key.startsWith('_')) {
                    continue;
                }

                const value = contextInstance[key];
                if (typeof value === 'string' || typeof value === 'boolean') {
                    props.push({ key: key, value: value, type: typeof value });
                } else {
                    props.push({ key: key, type: typeof value });
                }
            }

            contextItemData = { ...contextItemData, properties: props };
        }
    }
    else{
        contextItemData =  {...contextItemData, type: 'primitive', value: contextInstance };
    }

    return contextItemData;
};

/**
 * Gets a list of methods from a class
 * 
 * @param klass The class to get the methods from
 * @returns An array of method names as strings
 */
function getClassMethodNames(klass: any) {
    const isGetter = (x: any, name: string): boolean => !!(Object.getOwnPropertyDescriptor(x, name) || {}).get;
    const isFunction = (x: any, name: string): boolean => typeof x[name] === 'function';
    const deepFunctions = (x: any): any =>
        x !== Object.prototype &&
        Object.getOwnPropertyNames(x)
            .filter((name) => isGetter(x, name) || isFunction(x, name))
            .concat(deepFunctions(Object.getPrototypeOf(x)) || []);
    const distinctDeepFunctions = (klass: any) => Array.from(new Set(deepFunctions(klass)));

    const allMethods =
        typeof klass.prototype === 'undefined'
            ? distinctDeepFunctions(klass)
            : Object.getOwnPropertyNames(klass.prototype);
    return allMethods.filter((name: any) => name !== 'constructor' && !name.startsWith('_'));
}


export interface DebugContextData {
	/**
     * The alias of the context
     *
     * @type {string}
     * @memberof DebugContextData
     */
    alias: string;

    /**
     * The type of the context such as object or string
     *
     * @type {("string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function")}
     * @memberof DebugContextData
     */
    type: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
	
    /**
     * Data about the context that includes method and property names
     *
     * @type {DebugContextItemData}
     * @memberof DebugContextData
     */
    data: DebugContextItemData;
}

export interface DebugContextItemData {
	type: string;
	methods?: Array<unknown>;
	properties?: Array<DebugContextItemPropertyData>;
	value?: unknown;
}

export interface DebugContextItemPropertyData {
    /**
     * The name of the property
     *
     * @type {string}
     * @memberof DebugContextItemPropertyData
     */
    key: string;

    /**
     * The type of the property's value such as string or number
     *
     * @type {("string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function")}
     * @memberof DebugContextItemPropertyData
     */
    type: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";

     /**
     * Simple types such as string or number can have their value displayed stored inside the property
     *
     * @type {("string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function")}
     * @memberof DebugContextItemPropertyData
     */
	value?: unknown;
}