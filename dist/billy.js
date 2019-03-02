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
const billy_core_1 = require("@fivethree/billy-core");
const application_1 = require("./generated/application");
const nameOptions = {
    name: 'name',
    description: `What's the name of your app?`
};
const pluginOptions = {
    name: 'plugin',
    description: `What's the name of your plugin?`
};
let BillyCLI = class BillyCLI extends application_1.Application {
    run(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = context.api.getArgs().join(' ');
            if (this.billy()) {
                yield this.exec(`node . ${args}`, true);
            }
            else if (this.exists('./billy') && this.billy('./billy')) {
                yield this.exec(`node billy ${args}`, true);
            }
            else {
                yield context.api.promptLaneAndRun();
            }
        });
    }
    create_app(name, context) {
        return __awaiter(this, void 0, void 0, function* () {
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
            }
        });
    }
    create_plugin(plugin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.exists(plugin)) {
                this.print(`Ok, your plugins's name will be ${plugin}!`);
                this.print(`Cloning plugin repository⬇`);
                yield this.exec(`git clone https://github.com/fivethree-team/billy-plugin.git ${plugin}`);
                const packageJSON = this.parseJSON(`./${plugin}/package.json`);
                packageJSON.name = plugin;
                packageJSON.version = '0.0.1';
                this.writeJSON(`./${plugin}/package.json`, packageJSON);
                this.print('Installing dependencies, this might take a while...⏳');
                yield this.exec(`rm -rf ./${plugin}/package-lock.json && npm install --prefix ./${plugin}/`);
                this.print('Doing an initial build to see if everything is working. 🛠`');
                yield this.exec(`./${plugin}/node_modules/.bin/tsc -p ./${plugin}`);
                this.print(`${plugin} is all set!✅`);
                this.print(`have fun developing! 🚀`);
            }
            else {
                if (plugin) {
                    console.error(`Directory ${name} already exists. Please choose another one...`);
                }
            }
        });
    }
    // @Lane('install a plugin into your billy 👾')
    // async install_plugin() {
    //     if (this.billy()) {
    //         const name = await this.prompt("What's the name of the plugin you want to install? 🧩");
    //         if (this.pluginInstalled(name)) {
    //             throw new Error('Plugin already installed');
    //         }
    //         this.print(`Installing plugin ${name} (via npm) ⌛`)
    //         await this.exec(`npm i ${name}`)
    //         this.addPlugin(name);
    //         this.print(`Rebuilding the app for you...🛠`)
    //         await this.build_app();
    //         this.print(`All done!🎉 You can now use ${name}'s actions in your lanes.`)
    //     } else {
    //         console.error('this lane only works inside of a billy cli project');
    //     }
    // }
    // @Lane('remove a plugin from your project ♻')
    // async remove_plugin() {
    //     if (this.billy()) {
    //         const name = await this.prompt("What's the name of the plugin you like to uninstall? ⏏");
    //         if (!this.pluginInstalled(name)) {
    //             throw new Error('Plugin not installed');
    //         }
    //         this.removePlugin(name);
    //         this.print(`Unstalling plugin ${name}...⌛`)
    //         await this.clean_app();
    //         this.print(`Rebuilding the app for you...🛠`)
    //         await this.build_app();
    //         this.print(`All done!🎉  Successfully removed plugin ${name}.`)
    //     } else {
    //         console.error('this lane only works inside of a billy cli project');
    //     }
    // }
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
    billy_core_1.Lane('run your billy app 🏃'),
    billy_core_1.Hook(billy_core_1.onStart),
    __param(0, billy_core_1.context()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillyCLI.prototype, "run", null);
__decorate([
    billy_core_1.Lane('start a new billy cli app! 🚀'),
    __param(0, billy_core_1.param(nameOptions)), __param(1, billy_core_1.context()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BillyCLI.prototype, "create_app", null);
__decorate([
    billy_core_1.Lane('create a new plugin 🧩'),
    __param(0, billy_core_1.param(pluginOptions)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillyCLI.prototype, "create_plugin", null);
__decorate([
    billy_core_1.Lane('build your billy app 🏗'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillyCLI.prototype, "build", null);
__decorate([
    billy_core_1.Lane('clean install your billy app 👷'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillyCLI.prototype, "clean", null);
BillyCLI = __decorate([
    billy_core_1.App({ allowUnknownOptions: true })
], BillyCLI);
exports.BillyCLI = BillyCLI;
