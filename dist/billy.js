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
Object.defineProperty(exports, "__esModule", { value: true });
const billy_core_1 = require("@fivethree/billy-core");
let BillyCLI = class BillyCLI {
    create_app({ print }) {
        print('Create App here');
    }
    create_plugin({ print }) {
        print('Create plugin here');
    }
    install_plugin({ print }) {
        print('install existing plugin here');
    }
    remove_plugin({ print }) {
        print('remove installed plugin here');
    }
};
__decorate([
    billy_core_1.Lane('start a new billy! 🚀'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BillyCLI.prototype, "create_app", null);
__decorate([
    billy_core_1.Lane('create a new plugin 🧩'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BillyCLI.prototype, "create_plugin", null);
__decorate([
    billy_core_1.Lane('install a plugin into your billy 👾'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BillyCLI.prototype, "install_plugin", null);
__decorate([
    billy_core_1.Lane('remove a plugin from your project'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BillyCLI.prototype, "remove_plugin", null);
BillyCLI = __decorate([
    billy_core_1.App()
], BillyCLI);
exports.BillyCLI = BillyCLI;
