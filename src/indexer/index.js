"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Indexer = void 0;
function buildFetchFunction(templateUrl) {
    return (...args_1) => __awaiter(this, [...args_1], void 0, function* (params = {}) {
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
        const response = yield fetch(`${url}?${optionalParams}`);
        if (!response.ok) {
            throw new Error(`Error fetching data from indexer: ${response.statusText}`);
        }
        return yield response.json();
    });
}
class Indexer {
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
