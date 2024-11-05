"use strict";
const fetch = (typeof globalThis.fetch !== 'undefined') ? globalThis.fetch : require('node-fetch');

Object.defineProperty(exports, "__esModule", { value: true });
exports.Indexer = void 0;
function buildFetchFunction(templateUrl) {
    return async (params = {}) => {
        const url = templateUrl.replace(/{(\w+)}/g, (_, key) => {
            const value = params[key];
            if (!value)
                throw Error('Missing required parameter', key);
            delete params[key];
            return encodeURIComponent(value);
        });
        const optionalParams = Object.entries(params)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        const response = await fetch(`${url}?${optionalParams}`);
        if (!response.ok) {
            throw new Error(`Error fetching data from indexer: ${response.statusText}`);
        }
        return await response.json();
    };
}
class Indexer {
    url;
    constructor(url) {
        this.url = url;
    }
    get getKRC20TokenList() {
        return buildFetchFunction(`${this.url}/v1/krc20/tokenlist`);
    }
    get getKRC20Info() {
        return buildFetchFunction(`${this.url}/v1/krc20/token/{tick}`);
    }
    get getKRC20Balances() {
        return buildFetchFunction(`${this.url}/v1/krc20/address/{address}/tokenlist`);
    }
    get getKRC20Balance() {
        return buildFetchFunction(`${this.url}/v1/krc20/address/{address}/token/{tick}`);
    }
}
exports.Indexer = Indexer;
