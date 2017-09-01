/// <reference types="sharepoint" />
declare module 'systemjs-plugin-sharepoint' {
    export function RegisterSodDependency(sod: string, dep: string);
}

declare var _v_dictSod : { [address: string]: string };

declare function LoadSodByKey(key: string, fn?: () => void, bSync?: boolean);

declare interface IEnumerable<T> {
    getEnumerator(): IEnumerator<T>;

    /** Execute a callback for every element in the matched set.
    @param callback The function that will called for each element, and passed an index and the element itself */
    each?(callback: (index?: number, item?: T) => void): void;

    /**
     * Creates an array of values by running each element in collection through iteratee.
     *
     * @param iteratee The function invoked per iteration.
     * @return Returns the new mapped array.
     */
    map?<TResult>(iteratee: (item?: T, index?: number) => TResult): TResult[];

    /** Converts a collection to a regular JS array. */
    toArray?(): T[];


    /** Returns the first element in the collection or null if none
     * @param iteratee An optional function to filter by
     * @return Returns the first item in the collection
     */
    firstOrDefault?(iteratee?: (item?: T) => boolean): T;
}

declare namespace SP {
    export interface ClientObjectCollection<T> extends IEnumerable<T> {
    }

    export interface ClientContext {
        /** A shorthand for context.executeQueryAsync except wrapped as a JS Promise object */        
        executeQuery: () => ExtendedPromise<SP.ClientRequestSucceededEventArgs, SP.ClientRequestFailedEventArgs>;
    }

    export interface List {
        /** A shorthand to list.getItems with just the queryText and doesn't require a SP.CamlQuery to be constructed 
        @param queryText the queryText to use for the query.set_ViewXml() call */
        get_queryResult: (queryText: string) => SP.ListItemCollection;
    }

    namespace Guid {
        function generateGuid(): string;
    }
}

interface PromiseConstructor {
    /**
     * Creates a new Promise.
     * @param executor A callback used to initialize the promise. This callback is passed two arguments:
     * a resolve callback used resolve the promise with a value or the result of another promise,
     * and a reject callback used to reject the promise with a provided reason or error.
     */
    new <TResolved, TRejected>(executor: (resolve: (value?: TResolved | PromiseLike<TResolved>) => void, reject: (reason?: TRejected) => void) => void): ExtendedPromise<TResolved, TRejected>;
}

/**
 * Represents the completion of an asynchronous operation
 */
interface ExtendedPromise<TResolved, TRejected> extends Promise<TResolved> {
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1, TResult2>(onfulfilled: (value: TResolved) => TResult1 | PromiseLike<TResult1>, onrejected: (reason: TRejected) => TResult2 | PromiseLike<TResult2>): ExtendedPromise<TResult1 | TResult2, TRejected>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult>(onfulfilled: (value: TResolved) => TResult | PromiseLike<TResult>, onrejected: (reason: TRejected) => TResult | PromiseLike<TResult>): ExtendedPromise<TResult,TRejected>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult>(onfulfilled: (value: TResolved) => TResult | PromiseLike<TResult>): ExtendedPromise<TResult, TRejected>;

    /**
     * Creates a new Promise with the same internal state of this Promise.
     * @returns A Promise.
     */
    then(): ExtendedPromise<TResolved, TRejected>;

    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult>(onrejected: (reason: TRejected) => TResult | PromiseLike<TResult>): ExtendedPromise<TResolved | TResult, TRejected>;

    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch(onrejected: (reason: TRejected) => TResolved | PromiseLike<TResolved>): ExtendedPromise<TResolved, TRejected>;
}