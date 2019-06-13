"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util/util");
exports.isNumber = (param) => !isNaN(param);
exports.isNumberArray = (param) => {
    const validator = {
        validate: (mapped) => mapped.filter(p => !exports.isNumber(p)),
        map: mapList(param)
    };
    return validator;
};
exports.isBoolean = (param) => ['false', 'true'].some(s => s === param);
exports.isString = (param) => !exports.isBoolean(param) && !exports.isNumber(param) && typeof param === 'string';
exports.isStringArray = (param) => {
    const validator = {
        validate: (mapped) => mapped.filter(p => !exports.isString(p)),
        map: mapList(param)
    };
    return validator;
};
exports.isPath = (param) => util_1.exists(param);
const mapList = (list) => list.replace(', ', ',').split(',');
