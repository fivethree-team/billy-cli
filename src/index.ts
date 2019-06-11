#!/usr/bin/env node
import { CorePlugin } from '@fivethree/billy-plugin-core';
import { App, Command, param, context, Context, ParamOptions, usesPlugins, Hook, onStart } from "@fivethree/billy-core";

const appOptions: ParamOptions = {
    name: 'app',
    description: `What's the name of your app?`
}

const pluginOptions: ParamOptions = {
    name: 'plugin',
    description: `What's the name of your plugin?`
}

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

    @Command('start a new billy cli app!')
    async create(@param(appOptions) app, @context() context: Context) {
        if (!(await this.exists(context.workingDirectory + '/' + app))) {
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

            const text = await this.readText(app + '/src/index.ts')
            const contents = text.replace('ExampleApplication', (await this.camelcase(app, true)));
            await this.writeText(app + '/src/index.ts', contents);

            console.log('Installing dependencies, this might take a while...⏳')
            await this.exec(`rm -rf ${context.workingDirectory + '/'}${app}/package-lock.json && npm install --prefix ${context.workingDirectory + '/'}${app}/`, true);
            console.log('Doing an initial build to see if everything is working. 🛠`')
            await this.exec(`${context.workingDirectory + '/'}${app}/node_modules/.bin/tsc -p ${context.workingDirectory + '/'}${app}`, true);
            console.log(`${app} is all set!✅`)
            console.log(`have fun developing! 🚀`)


        } else {
            if (app) {
                console.error(`Directory ${app} already exists. Please choose another one...`);
            }
        }

    }

    @Command('create a new plugin')
    async plugin(@param(pluginOptions) name: string, @context() context: Context) {

        if (!(await this.exists(context.workingDirectory + '/' + name))) {
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

        } else {
            if (name) {
                console.error(`Directory ${name} already exists. Please choose another one...`);
            }
        }
    }

    @Command('build your billy app')
    async build(@context() context: Context) {
        if ((await this.billy(context.workingDirectory))) {
            await this.exec(`node_modules/.bin/tsc -p ${context.workingDirectory}`, true)

        } else {
            console.error('this command only works inside of a billy app or plugin');
        }
    }

    @Command('clean install your billy app')
    async clean(@context() context: Context) {
        if ((await this.billy(context.workingDirectory))) {
            await this.exec(`rm -rf node_modules package-lock.json && npm install`, true);
        } else {
            console.error('this command only works inside of a billy app or plugin');
        }
    }

}
