"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const billy_core_1 = require("@fivethree/billy-core");
exports.createApp = {
    name: 'app',
    description: `What's the name of your app?`,
    optional: true,
    validators: [billy_core_1.isString, billy_core_1.isNonExistingPath]
};
exports.createPlugin = {
    name: 'plugin',
    description: `What's the name of your plugin?`,
    optional: true,
    validators: [billy_core_1.isString, billy_core_1.isNonExistingPath]
};
exports.appOptions = {
    name: 'app',
    description: `What's the name of your app?`,
    validators: [billy_core_1.isString, billy_core_1.isNonExistingPath]
};
exports.pluginOptions = {
    name: 'plugin',
    description: `What's the name of your plugin?`,
    validators: [billy_core_1.isString, billy_core_1.isNonExistingPath]
};
const asyncValidator = {
    validate: (param) => __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(true);
            }, 2000);
        });
    })
};
