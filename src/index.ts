#!/usr/bin/env node
import { CorePlugin } from '@fivethree/billy-plugin-core';
import { App, Command, param, context, Context, ParamOptions, Hook, onStart, usesPlugins } from "@fivethree/billy-core";

const nameOptions: ParamOptions = {
    name: 'name',
    description: `What's the name of your app?`
}

const pluginOptions: ParamOptions = {
    name: 'plugin',
    description: `What's the name of your plugin?`
}

export interface BillyCLI extends CorePlugin { }
@App({ allowUnknownOptions: true })
export class BillyCLI {
    @usesPlugins(CorePlugin) this;

    @Command('run your billy app 🏃')
    @Hook(onStart)
    async run(@context() context: Context) {
        const args = process.argv.slice(2).join(' ');
        if (this.billy()) {
            await this.exec(`node . ${args}`, true);
        } else if (this.exists('./billy') && this.billy('./billy')) {
            await this.exec(`node billy ${args}`, true);
        } else {
            await context.api.promptLaneAndRun();
        }
    }


    @Command('start a new billy cli app! 🚀')
    async create_app(@param(nameOptions) name, @context() context: Context) {
        if (!this.exists(name)) {
            this.print(`Ok, your app's name will be ${name}!`);
            this.print(`Cloning demo repository⬇`);
            await this.exec(`git clone https://github.com/fivethree-team/billy-app.git ${name}`);
            const packageJSON = this.parseJSON(`./${name}/package.json`);
            packageJSON.name = name;
            packageJSON.version = '0.0.1';
            packageJSON.bin = {};
            packageJSON.bin[name] = 'dist/index.js';
            packageJSON.scripts.test = `npm i -g && ${name}`;
            this.writeJSON(`./${name}/package.json`, packageJSON);

            const text = this.readText(name + '/src/billy.ts')
            console.log('pascalcase', name, this.camelcase(name, true));
            const contents = text.replace('ExampleApplication', this.camelcase(name, true));
            this.writeText(name + '/src/billy.ts', contents);

            this.print('Installing dependencies, this might take a while...⏳')
            await this.exec(`rm -rf ./${name}/package-lock.json && npm install --prefix ./${name}/`);
            this.print('Doing an initial build to see if everything is working. 🛠`')
            await this.exec(`./${name}/node_modules/.bin/tsc -p ./${name}`);
            this.print(`${name} is all set!✅`)
            this.print(`Use billy inside your project to add plugins 🧩`)

        } else {
            if (name) {
                console.error(`Directory ${name} already exists. Please choose another one...`);
            }
        }

    }

    @Command('create a new plugin 🧩')
    async create_plugin(@param(pluginOptions) plugin) {

        if (!this.exists(plugin)) {
            this.print(`Ok, your plugins's name will be ${plugin}!`);
            this.print(`Cloning plugin repository⬇`);
            await this.exec(`git clone https://github.com/fivethree-team/billy-plugin.git ${plugin}`);
            const packageJSON = this.parseJSON(`./${plugin}/package.json`);
            packageJSON.name = plugin;
            packageJSON.version = '0.0.1';
            this.writeJSON(`./${plugin}/package.json`, packageJSON);
            this.print('Installing dependencies, this might take a while...⏳')
            await this.exec(`rm -rf ./${plugin}/package-lock.json && npm install --prefix ./${plugin}/`);
            this.print('Doing an initial build to see if everything is working. 🛠`')
            await this.exec(`./${plugin}/node_modules/.bin/tsc -p ./${plugin}`);
            this.print(`${plugin} is all set!✅`)
            this.print(`have fun developing! 🚀`)

        } else {
            if (plugin) {
                console.error(`Directory ${name} already exists. Please choose another one...`);
            }
        }
    }

    @Command('build your billy app 🏗')
    async build() {
        if (this.billy()) {
            await this.exec(`node_modules/.bin/tsc -p .`)

        } else {
            console.error('this lane only works inside of a billy app or plugin');
        }
    }

    @Command('clean install your billy app 👷')
    async clean() {
        if (this.billy()) {
            await this.exec(`rm -rf node_modules package-lock.json && npm install`);
        } else {
            console.error('this lane only works inside of a billy app or plugin');
        }
    }

}
