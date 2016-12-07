plugin-sharepoint
=================

A SharePoint 'Script-On-Demand' (SOD) loader plugin for SystemJS.

Installing
---

For installing with jspm, run `jspm install sharepoint`.

SP.SOD Concept
---

SharePoint provides a loading mechanism called 'Script-On-Demand' to load all of it's own JavaScript dependencies.
There are times in custom code when you must use this mechanism to ensure that specific SharePoint functionality has been loaded before your code can run.
There are various accepted methods to do this (such as SP.SOD.executeOrDelayUntilScriptLoaded), but they are generally clunky.

For SharePoint projects using system.js, this plugin allows you to load SOD dependencies using familiar syntax. 

Basic Use
---

```javascript
import 'sp.js!sharepoint';
```

JSOM Extensions
----

This package also additionally provides a set of extensions to SharePoint's JS Object Model to make development slightly less tedious.

```typescript
// A set of convenient extension methods
declare namespace SP {
    export interface ClientContext {
        /** A shorthand for context.executeQueryAsync except wrapped as a JS Promise object */        
        executeQuery: () => ExtendedPromise<SP.ClientRequestSucceededEventArgs, SP.ClientRequestFailedEventArgs>;
    }

    export interface List {
        /** A shorthand to list.getItems with just the queryText and doesn't require a SP.CamlQuery to be constructed 
        @param queryText the queryText to use for the query.set_ViewXml() call */
        get_queryResult: (queryText: string) => SP.ListItemCollection;
    }
}

// Collection methods similar to those available from lodash
declare interface IEnumerable<T> {
    /** Execute a callback for every element in the matched set.
    @param callback The function that will called for each element, and passed an index and the element itself */
    each(callback: (index?: number, item?: T) => void): void;

    /**
     * Creates an array of values by running each element in collection through iteratee.
     *
     * @param iteratee The function invoked per iteration.
     * @return Returns the new mapped array.
     */
    map<TResult>(iteratee: (item?: T, index?: number) => TResult): TResult[];

    /** Converts a collection to a regular JS array. */
    toArray(): T[];

    /** Returns the first element in the collection or null if none */
    firstOrDefault(): T;
}
```

Example Usage:
---

```javascript
System.import('sp.js!sharepoint')
.then(function() {
    var context = new SP.ClientContext();
    var web = context.get_web();
    var list = web.get_list();

    /* instead of:
    var query = new SP.CamlQuery();
    query.set_viewXml('<View><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">Hello world!</Value></Eq></Where></Query></View>');
    var items = list.getItems(query);
    */
    var items = list.get_queryResult('<View><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">Hello world!</Value></Eq></Where></Query></View>');

    context.load(items);
    
    /* instead of:
    context.executeQueryAsync(
        Function.createDelegate(this, function(sender, args) {
            ...
        }), 
        Function.createDelegate(this, function(sender, args) {
            ...
        })
    );
    */
    context.executeQuery()
    .then(function(args) {
        /* instead of:
        var transformed = [];
        var enumerator = items.getEnumerator();
        while(enumerator.moveNext()) {
            var item = enumerator.get_current();
            transformed.push({ title: item.get_title() });
        }
        */
        var transformed = items.map(function(item, i) {
            return { title: item.get_title() };
        });
        
        console.log(transformed);
    })
    .catch(function(args) {
        console.log(args.get_message());
    });
});
```