import { ParamOptions, isString, isNonExistingPath } from "@fivethree/billy-core";

export const createApp: ParamOptions = {
    name: 'app',
    description: `What's the name of your app?`,
    optional: true,
    validators: [isString, isNonExistingPath]
}

export const createPlugin: ParamOptions = {
    name: 'plugin',
    description: `What's the name of your plugin?`,
    optional: true,
    validators: [isString, isNonExistingPath]
}
export const appOptions: ParamOptions = {
    name: 'app',
    description: `What's the name of your app?`,
    validators: [isString, isNonExistingPath]
}

export const pluginOptions: ParamOptions = {
    name: 'plugin',
    description: `What's the name of your plugin?`,
    validators: [isString, isNonExistingPath]
}
