"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const billy_core_1 = require("@fivethree/billy-core");
exports.createApp = {
    name: '-a, --app',
    description: `What's the name of your app?`,
    optional: true,
    validators: [billy_core_1.isString, billy_core_1.isNonExistingPath]
};
exports.createPlugin = {
    name: '-p, --plugin',
    description: `What's the name of your plugin?`,
    optional: true,
    validators: [billy_core_1.isString, billy_core_1.isNonExistingPath]
};
exports.appOptions = {
    name: 'app',
    gitStyle: true,
    description: `What's the name of your app?`,
    validators: [billy_core_1.isString, billy_core_1.isNonExistingPath]
};
exports.pluginOptions = {
    name: 'plugin',
    gitStyle: true,
    description: `What's the name of your plugin?`,
    validators: [billy_core_1.isString, billy_core_1.isNonExistingPath]
};
