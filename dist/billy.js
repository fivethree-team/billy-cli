"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const application_1 = require("./generated/application");
let BillyCLI = class BillyCLI extends application_1.Application {
    create_app() {
        return __awaiter(this, void 0, void 0, function* () {
            const name = yield this.prompt(`What's the name of your app?`);
            if (!this.exists(name)) {
                this.print(`Ok, your app's name will be ${name}!`);
                this.print(`Cloning demo repository⬇`);
                yield this.exec(`git clone https://github.com/fivethree-team/billy-app.git ${name}`);
                const packageJSON = this.parseJSON(`./${name}/package.json`);
                packageJSON.name = name;
                packageJSON.version = '0.0.1';
                packageJSON.bin = {};
                packageJSON.bin[name] = 'dist/generated/index.js';
                packageJSON.scripts.test = `npm i -g && ${name}`;
                this.writeJSON(`./${name}/package.json`, packageJSON);
                const text = this.readText(name + '/src/billy.ts');
                console.log('pascalcase', name, this.camelcase(name, true));
                const contents = text.replace('ExampleApplication', this.camelcase(name, true));
                this.writeText(name + '/src/billy.ts', contents);
                this.print('Installing dependencies, this might take a while...⏳');
                yield this.exec(`rm -rf ./${name}/package-lock.json && npm install --prefix ./${name}/`);
                this.print('Doing an initial build to see if everything is working. 🛠`');
                yield this.exec(`./${name}/node_modules/.bin/tsc -p ./${name}`);
                this.print(`${name} is all set!✅`);
                this.print(`Use billy inside your project to add plugins 🧩`);
            }
            else {
                if (name) {
                    console.error(`Directory ${name} already exists. Please choose another one...`);
                }
                this.create_app();
            }
        });
    }
    create_plugin() {
        return __awaiter(this, void 0, void 0, function* () {
            const name = yield this.prompt(`What's the name of your plugin?`);
            if (!this.exists(name)) {
                this.print(`Ok, your plugins's name will be ${name}!`);
                this.print(`Cloning plugin repository⬇`);
                yield this.exec(`git clone https://github.com/fivethree-team/billy-plugin.git ${name}`);
                const packageJSON = this.parseJSON(`./${name}/package.json`);
                packageJSON.name = name;
                packageJSON.version = '0.0.1';
                this.writeJSON(`./${name}/package.json`, packageJSON);
                this.print('Installing dependencies, this might take a while...⏳');
                yield this.exec(`rm -rf ./${name}/package-lock.json && npm install --prefix ./${name}/`);
                this.print('Doing an initial build to see if everything is working. 🛠`');
                yield this.exec(`./${name}/node_modules/.bin/tsc -p ./${name}`);
                this.print(`${name} is all set!✅`);
                this.print(`have fun developing! 🚀`);
            }
            else {
                if (name) {
                    console.error(`Directory ${name} already exists. Please choose another one...`);
                }
                this.create_plugin();
            }
        });
    }
    install_plugin() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.billy()) {
                const name = yield this.prompt("What's the name of the plugin you want to install? 🧩");
                if (this.pluginInstalled(name)) {
                    throw new Error('Plugin already installed');
                }
                this.print(`Installing plugin ${name} (via npm) ⌛`);
                yield this.exec(`npm i ${name}`);
                this.addPlugin(name);
                this.print(`Rebuilding the app for you...🛠`);
                yield this.build_app();
                this.print(`All done!🎉 You can now use ${name}'s actions in your lanes.`);
            }
            else {
                console.error('this lane only works inside of a billy cli project');
            }
        });
    }
    remove_plugin() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.billy()) {
                const name = yield this.prompt("What's the name of the plugin you like to uninstall? ⏏");
                if (!this.pluginInstalled(name)) {
                    throw new Error('Plugin not installed');
                }
                this.removePlugin(name);
                this.print(`Unstalling plugin ${name}...⌛`);
                yield this.clean_app();
                this.print(`Rebuilding the app for you...🛠`);
                yield this.build_app();
                this.print(`All done!🎉  Successfully removed plugin ${name}.`);
            }
            else {
                console.error('this lane only works inside of a billy cli project');
            }
        });
    }
    build_app() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.billy()) {
                yield this.exec(`node_modules/.bin/tsc -p .`);
            }
            else {
                console.error('this lane only works inside of a billy cli project');
            }
        });
    }
    clean_app() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.billy()) {
                yield this.exec(`rm -rf node_modules package-lock.json && npm install`);
            }
            else {
                console.error('this lane only works inside of a billy cli project');
            }
        });
    }
    run_app() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.billy()) {
                this.exec(`node .`, true);
            }
            else {
                console.error('this lane only works inside of a billy cli project');
            }
        });
    }
    addPlugin(name) {
        const packageJSON = this.parseJSON(process.cwd() + '/package.json');
        const currentPlugins = packageJSON.billy.plugins;
        if (currentPlugins.some(plugin => plugin === name)) {
            throw new Error('Plugin already added...');
        }
        currentPlugins.push(name);
        packageJSON.billy.plugins = currentPlugins;
        const content = this.getContent(currentPlugins);
        this.writeText('./src/generated/application.ts', content);
        this.writeJSON(process.cwd() + '/package.json', packageJSON);
    }
    removePlugin(name) {
        const packageJSON = this.parseJSON(process.cwd() + '/package.json');
        delete packageJSON.dependencies[name];
        packageJSON.billy.plugins = packageJSON.billy.plugins.filter(plugin => plugin !== name);
        const currentPlugins = packageJSON.billy.plugins.filter(plug => plug !== name);
        const content = this.getContent(currentPlugins);
        this.writeText('./src/generated/application.ts', content);
        this.writeJSON(process.cwd() + '/package.json', packageJSON);
    }
    pluginInstalled(name) {
        const packageJSON = this.parseJSON(process.cwd() + '/package.json');
        return packageJSON.billy.plugins.some(plugin => plugin === name) && packageJSON.dependencies[name];
    }
    getContent(currentPlugins) {
        const plugins = [];
        const imports = [];
        currentPlugins
            .forEach(plug => {
            const name = require(process.cwd() + '/node_modules/' + plug).default.name;
            plugins.push(name);
            imports.push(`import { ${name} } from \'${plug}\';`);
        });
        imports.push(`import { usesPlugins } from '@fivethree/billy-core';`);
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
        `;
        return content;
    }
};
__decorate([
    billy_core_1.Lane('start a new billy cli app! 🚀'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillyCLI.prototype, "create_app", null);
__decorate([
    billy_core_1.Lane('create a new plugin 🧩'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillyCLI.prototype, "create_plugin", null);
__decorate([
    billy_core_1.Lane('install a plugin into your billy 👾'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillyCLI.prototype, "install_plugin", null);
__decorate([
    billy_core_1.Lane('remove a plugin from your project ♻'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillyCLI.prototype, "remove_plugin", null);
__decorate([
    billy_core_1.Lane('build your billy app 🏗'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillyCLI.prototype, "build_app", null);
__decorate([
    billy_core_1.Lane('clean install your billy app 👷'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillyCLI.prototype, "clean_app", null);
__decorate([
    billy_core_1.Lane('run your billy app 🏃'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillyCLI.prototype, "run_app", null);
BillyCLI = __decorate([
    billy_core_1.App()
], BillyCLI);
exports.BillyCLI = BillyCLI;
