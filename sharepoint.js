export const build = false;

export function locate(load) {
    var match = load.address.match(/\/([^\/]+\.js)$/);
    if (match)
        return match[1];
    return null;
}
;
export function fetch(load, fetch) {
    return new Promise((resolve, reject) => {
        if (!_v_dictSod[load.address] && load.address != 'sp.ribbon.js') {
            // if its not registered, we can only assume it must be registered from the _layouts folder
            SP.SOD.registerSod(load.address, '/_layouts/15/' + load.address);
        }
        SP.SOD.executeOrDelayUntilScriptLoaded(() => { resolve(''); }, load.address);
        LoadSodByKey(load.address);
    });
}
;
export function instantiate(load) {
    if (load.address == 'sp.js')
        addSPJsomExtensions();
    return {};
}
;
function addSPJsomExtensions() {
    /** Execute a callback for every element in the matched set.
    @param {function(number, Object)} callback The function that will called for each element, and passed an index and the element itself */
    if (!SP.ClientObjectCollection.prototype['each'])
        SP.ClientObjectCollection.prototype['each'] = function (callback) {
            var index = 0, enumerator = this.getEnumerator();
            while (enumerator.moveNext()) {
                if (callback(index++, enumerator.get_current()) === false)
                    break;
            }
        };
    if (!SP.ClientObjectCollection.prototype['map'])
        SP.ClientObjectCollection.prototype['map'] = function (iteratee) {
            var index = -1, enumerator = this.getEnumerator(), result = [];
            while (enumerator.moveNext()) {
                result[++index] = iteratee(enumerator.get_current(), index);
            }
            return result;
        };
    /** Converts a collection to a regular JS array. */
    if (!SP.ClientObjectCollection.prototype['toArray'])
        SP.ClientObjectCollection.prototype['toArray'] = function () {
            var collection = [];
            this.each((i, item) => {
                collection.push(item);
            });
            return collection;
        };
    if (!SP.ClientObjectCollection.prototype['firstOrDefault'])
        SP.ClientObjectCollection.prototype['firstOrDefault'] = function (iteratee) {
            var enumerator = this.getEnumerator();
            if (enumerator.moveNext()) {
                var current = enumerator.get_current();
                if(iteratee) {
                    if(iteratee(current))
                        return current;
                }
                else
                    return current;
            }
            return null;
        };
    if(!SP.ClientObjectCollection.prototypes['any'])
        SP.ClientObjectCollection.prototype['any'] = function(iteratee) {
            var enumerator = this.getEnumerator();
            if (enumerator.moveNext()) {
                if(iteratee(enumerator.get_current()))
                return 
            }
            return null;
        };
    if (!SP.List.prototype['get_queryResult'])
        SP.List.prototype['get_queryResult'] = function (queryText) {
            var query = new SP.CamlQuery();
            query.set_viewXml(queryText);
            return this.getItems(query);
        };
    /** Executes an asynchronous query and returns a JS Promise object */
    if (!SP.ClientContext.prototype['executeQuery'])
        SP.ClientContext.prototype['executeQuery'] = function () {
            var context = this;
            return new Promise((resolve, reject) => {
                context.executeQueryAsync((sender, args) => { resolve(args); }, (sender, args) => { reject(args); });
            });
        };
    if (!SP.Guid['generateGuid'])
        SP.Guid['generateGuid'] = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
}
