#!/usr/bin/env node
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const billy_plugin_core_1 = require("@fivethree/billy-plugin-core");
const billy_core_1 = require("@fivethree/billy-core");
const appOptions = {
    name: 'app',
    description: `What's the name of your app?`
};
const pluginOptions = {
    name: 'plugin',
    description: `What's the name of your plugin?`
};
let BillyCLI = class BillyCLI {
    create(app, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.exists(context.workingDirectory + '/' + app))) {
                console.log(`Ok, your app's name will be ${app}!`);
                console.log(`Cloning demo repository⬇`);
                yield this.exec(`git clone https://github.com/fivethree-team/billy-app.git ${app}`);
                const packageJSON = yield this.parseJSON(`${context.workingDirectory + '/'}${app}/package.json`);
                packageJSON.name = app;
                packageJSON.version = '0.0.1';
                packageJSON.bin = {};
                packageJSON.bin[app] = 'dist/index.js';
                packageJSON.scripts.test = `npm i -g && ${app}`;
                yield this.writeJSON(`${context.workingDirectory + '/'}${app}/package.json`, packageJSON);
                const text = yield this.readText(app + '/src/index.ts');
                console.log('pascalcase', app, (yield this.camelcase(app, true)));
                const contents = text.replace('ExampleApplication', (yield this.camelcase(app, true)));
                yield this.writeText(app + '/src/index.ts', contents);
                console.log('Installing dependencies, this might take a while...⏳');
                yield this.exec(`rm -rf ${context.workingDirectory + '/'}${app}/package-lock.json && npm install --prefix ${context.workingDirectory + '/'}${app}/`);
                console.log('Doing an initial build to see if everything is working. 🛠`');
                yield this.exec(`${context.workingDirectory + '/'}${app}/node_modules/.bin/tsc -p ${context.workingDirectory + '/'}${app}`);
                console.log(`${app} is all set!✅`);
                console.log(`Use billy inside your project to add plugins 🧩`);
            }
            else {
                if (app) {
                    console.error(`Directory ${app} already exists. Please choose another one...`);
                }
            }
        });
    }
    create_plugin(plugin, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.exists(plugin)) {
                console.log(`Ok, your plugins's name will be ${plugin}!`);
                console.log(`Cloning plugin repository⬇`);
                yield this.exec(`git clone https://github.com/fivethree-team/billy-plugin.git ${plugin}`);
                const packageJSON = this.parseJSON(`${context.workingDirectory + '/'}${plugin}/package.json`);
                packageJSON.name = plugin;
                packageJSON.version = '0.0.1';
                this.writeJSON(`${context.workingDirectory + '/'}${plugin}/package.json`, packageJSON);
                console.log('Installing dependencies, this might take a while...⏳');
                yield this.exec(`rm -rf ${context.workingDirectory + '/'}${plugin}/package-lock.json && npm install --prefix ${context.workingDirectory + '/'}${plugin}/`);
                console.log('Doing an initial build to see if everything is working. 🛠`');
                yield this.exec(`${context.workingDirectory + '/'}${plugin}/node_modules/.bin/tsc -p ${context.workingDirectory + '/'}${plugin}`);
                console.log(`${plugin} is all set!✅`);
                console.log(`have fun developing! 🚀`);
            }
            else {
                if (plugin) {
                    console.error(`Directory ${name} already exists. Please choose another one...`);
                }
            }
        });
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.billy()) {
                yield this.exec(`node_modules/.bin/tsc -p .`);
            }
            else {
                console.error('this lane only works inside of a billy app or plugin');
            }
        });
    }
    clean() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.billy()) {
                yield this.exec(`rm -rf node_modules package-lock.json && npm install`);
            }
            else {
                console.error('this lane only works inside of a billy app or plugin');
            }
        });
    }
};
__decorate([
    billy_core_1.usesPlugins(billy_plugin_core_1.CorePlugin),
    billy_core_1.Command('start a new billy cli app! 🚀'),
    __param(0, billy_core_1.param(appOptions)), __param(1, billy_core_1.context()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BillyCLI.prototype, "create", null);
__decorate([
    billy_core_1.Command('create a new plugin 🧩'),
    __param(0, billy_core_1.param(pluginOptions)), __param(1, billy_core_1.context()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BillyCLI.prototype, "create_plugin", null);
__decorate([
    billy_core_1.Command('build your billy app 🏗'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillyCLI.prototype, "build", null);
__decorate([
    billy_core_1.Command('clean install your billy app 👷'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillyCLI.prototype, "clean", null);
BillyCLI = __decorate([
    billy_core_1.App({ allowUnknownOptions: true })
], BillyCLI);
exports.BillyCLI = BillyCLI;
