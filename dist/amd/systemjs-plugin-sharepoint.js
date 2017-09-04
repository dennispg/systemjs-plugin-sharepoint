define("sharepoint", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.build = false;
    function locate(load) {
        var match = load.address.match(/\/([^\/]+\.js)$/);
        if (match)
            return match[1];
        return null;
    }
    exports.locate = locate;
    ;
    var sodBaseAddress = null;
    var getSodBaseAddress = function () {
        if (sodBaseAddress)
            return sodBaseAddress;
        if (_v_dictSod['sp.js']) {
            sodBaseAddress = _v_dictSod['sp.js'].url.replace(/sp\.js(\?.+)?$/, '');
        }
        else {
            var scripts = document.getElementsByTagName('script');
            for (var s = 0; s < scripts.length; s++)
                if (scripts[s].src && scripts[s].src.match(/\/sp\.js(\?.+)?$/)) {
                    sodBaseAddress = scripts[s].src.replace(/sp\.js(\?.+)?$/, '');
                    return sodBaseAddress;
                }
            sodBaseAddress = "/_layouts/15/";
        }
        return sodBaseAddress;
    };
    var sodDeps = {};
    function RegisterSodDependency(sod, dep) {
        if (_v_dictSod[sod]) {
            RegisterSodDep(sod, dep);
            return;
        }
        if (!sodDeps[sod])
            sodDeps[sod] = [];
        sodDeps[sod].push(dep);
    }
    exports.RegisterSodDependency = RegisterSodDependency;
    ;
    function fetch(load, fetch) {
        return new Promise(function (resolve, reject) {
            if (load.address)
                load.address = load.address.toLowerCase();
            if (!_v_dictSod[load.address] && load.address != 'sp.ribbon.js') {
                SP.SOD.registerSod(load.address, getSodBaseAddress() + load.address);
                for (var d = 0; sodDeps[load.address] && d < sodDeps[load.address].length; d++)
                    RegisterSodDep(load.address, sodDeps[load.address][d]);
            }
            SP.SOD.executeOrDelayUntilScriptLoaded(function () { resolve(''); }, load.address);
            SP.SOD.executeFunc(load.address, null, null);
        });
    }
    exports.fetch = fetch;
    ;
    function instantiate(load) {
        if (load.address == 'sp.js')
            addSPJsomExtensions();
        return {};
    }
    exports.instantiate = instantiate;
    ;
    function addSPJsomExtensions() {
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
        if (!SP.ClientObjectCollection.prototype['toArray'])
            SP.ClientObjectCollection.prototype['toArray'] = function () {
                var collection = [];
                this.each(function (i, item) {
                    collection.push(item);
                });
                return collection;
            };
        if (!SP.ClientObjectCollection.prototype['firstOrDefault'])
            SP.ClientObjectCollection.prototype['firstOrDefault'] = function (iteratee) {
                var enumerator = this.getEnumerator();
                if (enumerator.moveNext()) {
                    var current = enumerator.get_current();
                    if (iteratee) {
                        if (iteratee(current))
                            return current;
                    }
                    else
                        return current;
                }
                return null;
            };
        if (!SP.List.prototype['get_queryResult'])
            SP.List.prototype['get_queryResult'] = function (queryText) {
                var query = new SP.CamlQuery();
                query.set_viewXml(queryText);
                return this.getItems(query);
            };
        if (!SP.ClientContext.prototype['executeQuery'])
            SP.ClientContext.prototype['executeQuery'] = function () {
                var context = this;
                return new Promise(function (resolve, reject) {
                    context.executeQueryAsync(function (sender, args) { resolve(args); }, function (sender, args) { reject(args); });
                });
            };
        if (!SP.Guid['generateGuid'])
            SP.Guid['generateGuid'] = function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            };
    }
});
