import { Application } from './application';
import { App, Lane } from "@fivethree/billy-core";

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
            packageJSON.bin[name] = 'dist/index.js';
            packageJSON.scripts.test = `npm i -g && ${name}`;
            this.writeJSON(`./${name}/package.json`, packageJSON);

            const text = this.readText(name + '/src/billy.ts')
            const contents = text.replace('ExampleApplication', 'Demo');
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
            const packageJSON = this.parseJSON('./package.json');

            delete packageJSON.dependencies[name];
            this.writeJSON(`./package.json`, packageJSON);
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
        const plugin = require(name).default.name;
        const application = this.readText('./src/application.ts');
        const match = application.match(/\(([^)]+)\)/)[0];
        const currentPlugins = match.substring(1, match.length - 1).replace(' ', '').split(',');
        const imports: string[] = application.match(/import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w/_-]+)["'\s].*;$/gm);

        currentPlugins.push(plugin);
        imports.push(`import { ${plugin} } from \'${name}\';`);

        const content = this.getContent(imports, currentPlugins);
        this.writeText('./src/application.ts', content);
    }

    removePlugin(name: string) {
        const plugin = require(name).default.name;
        const application = this.readText('./src/application.ts');
        const match = application.match(/\(([^)]+)\)/)[0];
        let currentPlugins = match.substring(1, match.length - 1).replace(' ', '').split(',');
        let imports: string[] = application.match(/import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w/_-]+)["'\s].*;$/gm);

        currentPlugins = currentPlugins.filter(p => p !== plugin);
        imports = imports.filter(i => !(i.includes(plugin) && i.includes(name)))
        const content = this.getContent(imports, currentPlugins);
        this.writeText('./src/application.ts', content);
    }

    getContent(imports: string[], currentPlugins: string[]): string {
        let content = `/**
 * auto generated by billy-cli
 */\n`;
        imports.forEach(i => content += i + '\n');
        content += '\n';
        content += '//we need this line for intellisense :)\n';
        content += `export interface Application extends ${currentPlugins.join(', ')} {}\n`;
        content += `
export class Application {
    @usesPlugins(${currentPlugins.join(', ')}) this;
}
        `
        return content;
    }

}
