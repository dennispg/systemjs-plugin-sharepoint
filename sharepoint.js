import {registerSodDependency, importSod} from 'sharepoint-utilities';

export const build = false;

export function locate(load) {
    var match = load.address.match(/\/([^\/]+\.js)$/);
    if (match)
        return match[1];
    return null;
}

export function RegisterSodDependency(sod, dep) {
    registerSodDependency(sod, dep);
}

export function fetch(load, fetch) {
    return importSod(load.address);
}

export function instantiate(load) {
    return {};
}