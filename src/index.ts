#!/usr/bin/env node
import { CorePlugin } from '@fivethree/billy-plugin-core';
import {
    App, Command, param, context, Context, usesPlugins, Hook, onStart, Webhook, body, onError, error, afterAll
} from "@fivethree/billy-core";
import { createApp, createPlugin, appOptions, pluginOptions } from './params';


export interface BillyCLI extends CorePlugin { }
@App({ allowUnknownOptions: true })
export class BillyCLI {
    @usesPlugins(CorePlugin)

    @Hook(onStart)
    async onStart(@context() context: Context) {
        if (this.billy(context.workingDirectory)) {
            await this.exec(`node . ${process.argv.slice(2).join(' ')}`, true);
        } else {
            await context.api.promptLaneAndRun();
        }
    }

    @Command('Create a billy app or plugin.')
    async create(@param(createApp) app, @param(createPlugin) plugin, @context() context: Context) {

        if (app) {
            return await this.app(app, context);
        }
        if (plugin) {
            return await this.plugin(plugin, context);
        }
        console.log((await this.colorize('red', 'Either specify an app or plugin name using --app or --plugin')));
    }

    @Command('Start a new billy app.')
    async app(@param(appOptions) app, @context() context: Context) {
        console.log(`Ok, your app's name will be ${app}!`);
        console.log(`Cloning demo repository⬇`);
        await this.exec(`git clone https://github.com/fivethree-team/billy-app.git ${app}`, true);
        const packageJSON = await this.parseJSON(`${context.workingDirectory + '/'}${app}/package.json`);
        packageJSON.name = app;
        packageJSON.version = '0.0.1';
        packageJSON.bin = {};
        packageJSON.bin[app] = 'dist/index.js';
        packageJSON.scripts.test = `npm i -g && ${app}`;
        await this.writeJSON(`${context.workingDirectory + '/'}${app}/package.json`, packageJSON);

        const text = await this.readFile(app + '/src/index.ts')
        const contents = text.replace('ExampleApplication', (await this.camelcase(app, true)));
        await this.writeFile(app + '/src/index.ts', contents);

        console.log('Installing dependencies, this might take a while...⏳')
        await this.exec(`rm -rf ${context.workingDirectory + '/'}${app}/package-lock.json && npm install --prefix ${context.workingDirectory + '/'}${app}/`, true);
        console.log('Doing an initial build to see if everything is working. 🛠`')
        await this.exec(`${context.workingDirectory + '/'}${app}/node_modules/.bin/tsc -p ${context.workingDirectory + '/'}${app}`, true);
        console.log(`${app} is all set!✅`)
        console.log(`have fun developing! 🚀`)

    }

    @Command('Create a new plugin.')
    async plugin(@param(pluginOptions) name: string, @context() context: Context) {

        console.log(`Ok, your plugins's name will be ${name}!`);
        console.log(`Cloning plugin repository⬇`);
        await this.exec(`git clone https://github.com/fivethree-team/billy-plugin.git ${name}`, true);
        const packageJSON = this.parseJSON(`${context.workingDirectory + '/'}${name}/package.json`);
        packageJSON.name = name;
        packageJSON.version = '0.0.1';
        this.writeJSON(`${context.workingDirectory + '/'}${name}/package.json`, packageJSON);
        console.log('Installing dependencies, this might take a while...⏳')
        await this.exec(`rm -rf ${context.workingDirectory + '/'}${name}/package-lock.json && npm install --prefix ${context.workingDirectory + '/'}${name}/`, true);
        console.log('Doing an initial build to see if everything is working. 🛠`')
        await this.exec(`${context.workingDirectory + '/'}${name}/node_modules/.bin/tsc -p ${context.workingDirectory + '/'}${name}`, true);
        console.log(`${name} is all set!✅`)
        console.log(`have fun developing! 🚀`)

    }

    @Command('Build your billy app.')
    async build(@context() context: Context) {
        if ((await this.billy(context.workingDirectory))) {
            await this.exec(`node_modules/.bin/tsc -p ${context.workingDirectory}`, true)

        } else {
            console.error('this command only works inside of a billy app or plugin');
        }
    }

    @Command('Clean install your billy app. [DEV]')
    async clean(@context() context: Context) {
        if ((await this.billy(context.workingDirectory))) {
            await this.exec(`rm -rf node_modules package-lock.json && npm install`, true);
        } else {
            console.error('this command only works inside of a billy app or plugin');
        }
    }

    @Command('Present the command selection screen.')
    async select(@context() context: Context) {
        await context.api.promptLaneAndRun();
    }
}
