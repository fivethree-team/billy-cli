import { ParamOptions, isString, isNonExistingPath } from "@fivethree/billy-core";

export const createApp: ParamOptions = {
    name: '-a, --app',
    description: `What's the name of your app?`,
    optional: true,
    validators: [isString, isNonExistingPath]
}

export const createPlugin: ParamOptions = {
    name: '-p, --plugin',
    description: `What's the name of your plugin?`,
    optional: true,
    validators: [isString, isNonExistingPath]
}
export const appOptions: ParamOptions = {
    name: 'app',
    gitStyle: true,
    description: `What's the name of your app?`,
    validators: [isString, isNonExistingPath]
}

export const pluginOptions: ParamOptions = {
    name: 'plugin',
    gitStyle: true,
    description: `What's the name of your plugin?`,
    validators: [isString, isNonExistingPath]
}
