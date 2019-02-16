import { App, Lane, param, context, LaneContext, ParamOptions, Hook } from "@fivethree/billy-core";
import { Application } from "./generated/application";

const nameOptions: ParamOptions = {
    name: 'name',
    description: `What's the name of your app?`
}

const pluginOptions: ParamOptions = {
    name: 'plugin',
    description: `What's the name of your app?`
}

@App()
export class BillyCLI extends Application {

    @Hook('ON_START')
    async start(@context() context: LaneContext) {
        if (this.billy()) {
            this.exec(`node .`, true);
        } else if (this.exists('./billy')) {
            this.exec(`node billy`, true);
        } else {
            await context.api.promptLaneAndRun();
        }

    }


    @Lane('start a new billy cli app! 🚀')
    async create_app(@param(nameOptions) name, @context() context: LaneContext) {
        if (!this.exists(name)) {
            this.print(`Ok, your app's name will be ${name}!`);
            this.print(`Cloning demo repository⬇`);
            await this.exec(`git clone https://github.com/fivethree-team/billy-app.git ${name}`);
            const packageJSON = this.parseJSON(`./${name}/package.json`);
            packageJSON.name = name;
            packageJSON.version = '0.0.1';
            packageJSON.bin = {};
            packageJSON.bin[name] = 'dist/generated/index.js';
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

    @Lane('create a new plugin 🧩')
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

    @Lane('install a plugin into your billy 👾')
    async install_plugin() {
        if (this.billy()) {

            const name = await this.prompt("What's the name of the plugin you want to install? 🧩");
            if (this.pluginInstalled(name)) {
                throw new Error('Plugin already installed');
            }
            this.print(`Installing plugin ${name} (via npm) ⌛`)
            await this.exec(`npm i ${name}`)
            this.addPlugin(name);
            this.print(`Rebuilding the app for you...🛠`)
            await this.build_app();
            this.print(`All done!🎉 You can now use ${name}'s actions in your lanes.`)
        } else {
            console.error('this lane only works inside of a billy cli project');
        }

    }

    @Lane('remove a plugin from your project ♻')
    async remove_plugin() {
        if (this.billy()) {
            const name = await this.prompt("What's the name of the plugin you like to uninstall? ⏏");
            if (!this.pluginInstalled(name)) {
                throw new Error('Plugin not installed');
            }
            this.removePlugin(name);
            this.print(`Unstalling plugin ${name}...⌛`)
            await this.clean_app();

            this.print(`Rebuilding the app for you...🛠`)
            await this.build_app();
            this.print(`All done!🎉  Successfully removed plugin ${name}.`)
        } else {
            console.error('this lane only works inside of a billy cli project');
        }
    }

    @Lane('build your billy app 🏗')
    async build_app() {
        if (this.billy()) {
            await this.exec(`node_modules/.bin/tsc -p .`)

        } else {
            console.error('this lane only works inside of a billy cli project');
        }
    }

    @Lane('clean install your billy app 👷')
    async clean_app() {
        if (this.billy()) {
            await this.exec(`rm -rf node_modules package-lock.json && npm install`);
        } else {
            console.error('this lane only works inside of a billy cli project');
        }
    }

    @Lane('run your billy app 🏃')
    async run_app() {
        if (this.billy()) {
            this.exec(`node .`, true);
        } else {
            console.error('this lane only works inside of a billy cli project');
        }
    }

    @Lane('info about this application')
    async info() {
        this.print('info');
    }

    addPlugin(name: string) {
        const packageJSON = this.parseJSON(process.cwd() + '/package.json');
        const currentPlugins: string[] = packageJSON.billy.plugins;
        if (currentPlugins.some(plugin => plugin === name)) {
            throw new Error('Plugin already added...');
        }
        currentPlugins.push(name);
        packageJSON.billy.plugins = currentPlugins;
        const content = this.getContent(currentPlugins);
        this.writeText('./src/generated/application.ts', content);
        this.writeJSON(process.cwd() + '/package.json', packageJSON);
    }

    removePlugin(name: string) {
        const packageJSON = this.parseJSON(process.cwd() + '/package.json');
        delete packageJSON.dependencies[name];
        packageJSON.billy.plugins = packageJSON.billy.plugins.filter(plugin => plugin !== name);
        const currentPlugins: string[] = packageJSON.billy.plugins.filter(plug => plug !== name);
        const content = this.getContent(currentPlugins);
        this.writeText('./src/generated/application.ts', content);
        this.writeJSON(process.cwd() + '/package.json', packageJSON);
    }

    pluginInstalled(name: string): boolean {
        const packageJSON = this.parseJSON(process.cwd() + '/package.json');
        return packageJSON.billy.plugins.some(plugin => plugin === name) && packageJSON.dependencies[name];
    }

    getContent(currentPlugins: string[]): string {

        const plugins: string[] = [];
        const imports: string[] = [];
        currentPlugins
            .forEach(plug => {
                const name = require(process.cwd() + '/node_modules/' + plug).default.name;
                plugins.push(name);
                imports.push(`import { ${name} } from \'${plug}\';`);
            })
        imports.push(`import { usesPlugins } from '@fivethree/billy-core';`)

        let content = `/**
 * auto generated by billy-cli
 */\n`;
        imports.forEach(i => content += i + '\n');
        content += '\n';
        content += '//we need this line for intellisense :)\n';
        content += `export interface Application extends ${plugins.join(', ')} {}\n`;
        content += `
export class Application {
    @usesPlugins(${plugins.join(', ')}) this;
}
        `
        return content;
    }

}
