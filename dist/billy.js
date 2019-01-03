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
let BillyCLI = class BillyCLI {
    create_app(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { print, prompt, exec, exists, run, lane, app, parseJSON, writeJSON, readText, writeText } = context;
            const name = yield prompt(`What's the name of your app?`);
            if (!exists(name)) {
                print(`Ok, your app's name will be ${name}!`);
                print(`Cloning demo repository⬇`);
                yield exec(`git clone https://github.com/fivethree-team/billy-app.git ${name}`);
                const packageJSON = parseJSON(`./${name}/package.json`);
                packageJSON.name = name;
                packageJSON.version = '0.0.1';
                packageJSON.bin = {};
                packageJSON.bin[name] = 'dist/index.js';
                packageJSON.scripts.test = `npm i -g && ${name}`;
                writeJSON(`./${name}/package.json`, packageJSON);
                const text = readText(name + '/src/billy.ts');
                const contents = text.replace('ExampleApplication', 'Demo');
                writeText(name + '/src/billy.ts', contents);
                print('Installing dependencies, this might take a while...⏳');
                yield exec(`rm -rf ./${name}/package-lock.json && npm install --prefix ./${name}/`);
                print('Doing an initial build to see if everything is working. 🛠`');
                yield exec(`./${name}/node_modules/.bin/tsc -p ./${name}`);
                print(`${name} is all set!✅`);
                print(`Use billy inside your project to add plugins 🧩`);
            }
            else {
                if (name) {
                    console.error(`Directory ${name} already exists. Please choose another one...`);
                }
                run(app, lane);
            }
        });
    }
    create_plugin(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { print, prompt, exec, exists, run, lane, app, parseJSON, writeJSON } = context;
            const name = yield prompt(`What's the name of your plugin?`);
            if (!exists(name)) {
                print(`Ok, your plugins's name will be ${name}!`);
                print(`Cloning plugin repository⬇`);
                yield exec(`git clone https://github.com/fivethree-team/billy-plugin.git ${name}`);
                const packageJSON = parseJSON(`./${name}/package.json`);
                packageJSON.name = name;
                packageJSON.version = '0.0.1';
                writeJSON(`./${name}/package.json`, packageJSON);
                print('Installing dependencies, this might take a while...⏳');
                yield exec(`rm -rf ./${name}/package-lock.json && npm install --prefix ./${name}/`);
                print('Doing an initial build to see if everything is working. 🛠`');
                yield exec(`./${name}/node_modules/.bin/tsc -p ./${name}`);
                print(`${name} is all set!✅`);
                print(`have fun developing! 🚀`);
            }
            else {
                if (name) {
                    console.error(`Directory ${name} already exists. Please choose another one...`);
                }
                run(app, lane);
            }
        });
    }
    install_plugin({ print, parseJSON, billy, prompt, exec, writeJSON }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (billy()) {
                const name = yield prompt("What's the name of the plugin you want to install? 🧩");
                const plugins = parseJSON('./plugins.json');
                if (plugins.plugins.find(plugin => plugin === name)) {
                    throw new Error('plugin already added');
                }
                print(`Installing plugin ${name} (via npm) ⌛`);
                yield exec(`npm i ${name}`);
                plugins.plugins.push(name);
                writeJSON(`./plugins.json`, plugins);
                print(`Rebuilding the app for you...🛠`);
                yield exec(`node_modules/.bin/tsc -p .`);
                print(`All done!🎉 You can now use ${name}'s actions in your lanes.`);
            }
            else {
                console.error('this lane only works inside of a billy cli project');
            }
        });
    }
    remove_plugin({ print, parseJSON, billy, prompt, exec, writeJSON }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (billy()) {
                const name = yield prompt("What's the name of the plugin you like to uninstall? ⏏");
                const plugins = parseJSON('./plugins.json');
                const packageJSON = parseJSON('./package.json');
                if (!plugins.plugins.find(plugin => plugin === name)) {
                    throw new Error('plugin not installed');
                }
                plugins.plugins = plugins.plugins.filter(plugin => plugin !== name);
                writeJSON(`./plugins.json`, plugins);
                delete packageJSON.dependencies[name];
                writeJSON(`./package.json`, packageJSON);
                print(`Unstalling plugin ${name}...⌛`);
                yield exec(`rm -rf node_modules package-lock.json && npm install`);
                print(`Rebuilding the app for you...🛠`);
                yield exec(`node_modules/.bin/tsc -p .`);
                print(`All done!🎉  Successfully removed plugin ${name}.`);
            }
            else {
                console.error('this lane only works inside of a billy cli project');
            }
        });
    }
};
__decorate([
    billy_core_1.Lane('start a new billy cli app! 🚀'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillyCLI.prototype, "create_app", null);
__decorate([
    billy_core_1.Lane('create a new plugin 🧩'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillyCLI.prototype, "create_plugin", null);
__decorate([
    billy_core_1.Lane('install a plugin into your billy 👾'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillyCLI.prototype, "install_plugin", null);
__decorate([
    billy_core_1.Lane('remove a plugin from your project'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillyCLI.prototype, "remove_plugin", null);
BillyCLI = __decorate([
    billy_core_1.App()
], BillyCLI);
exports.BillyCLI = BillyCLI;
