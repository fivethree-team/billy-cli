import { App, Lane } from "@fivethree/billy-core";
import { Application } from "./generated/application";

@App()
export class BillyCLI extends Application {

    @Lane('start a new billy cli app! 🚀')
    async create_app() {
        const name = await this.prompt(`What's the name of your app?`);
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
            this.create_app();
        }

    }

    @Lane('create a new plugin 🧩')
    async create_plugin() {
        const name = await this.prompt(`What's the name of your plugin?`);

        if (!this.exists(name)) {
            this.print(`Ok, your plugins's name will be ${name}!`);
            this.print(`Cloning plugin repository⬇`);
            await this.exec(`git clone https://github.com/fivethree-team/billy-plugin.git ${name}`);
            const packageJSON = this.parseJSON(`./${name}/package.json`);
            packageJSON.name = name;
            packageJSON.version = '0.0.1';
            this.writeJSON(`./${name}/package.json`, packageJSON);
            this.print('Installing dependencies, this might take a while...⏳')
            await this.exec(`rm -rf ./${name}/package-lock.json && npm install --prefix ./${name}/`);
            this.print('Doing an initial build to see if everything is working. 🛠`')
            await this.exec(`./${name}/node_modules/.bin/tsc -p ./${name}`);
            this.print(`${name} is all set!✅`)
            this.print(`have fun developing! 🚀`)

        } else {
            if (name) {
                console.error(`Directory ${name} already exists. Please choose another one...`);
            }
            this.create_plugin();
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
            await this.exec(`node_modules/.bin/tsc -p .`)
            this.print(`All done!🎉 You can now use ${name}'s actions in your lanes.`)
        } else {
            console.error('this lane only works inside of a billy cli project');
        }

    }

    @Lane('remove a plugin from your project')
    async remove_plugin() {
        if (this.billy()) {
            const name = await this.prompt("What's the name of the plugin you like to uninstall? ⏏");
            if (!this.pluginInstalled(name)) {
                throw new Error('Plugin not installed');
            }
            this.removePlugin(name);
            this.print(`Unstalling plugin ${name}...⌛`)
            await this.exec(`rm -rf node_modules package-lock.json && npm install`);

            this.print(`Rebuilding the app for you...🛠`)
            await this.exec(`node_modules/.bin/tsc -p .`)
            this.print(`All done!🎉  Successfully removed plugin ${name}.`)
        } else {
            console.error('this lane only works inside of a billy cli project');
        }
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
