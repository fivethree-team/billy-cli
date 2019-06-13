#!/usr/bin / env node
import { CorePlugin } from '@fivethree/billy-plugin-core';
import { Context } from "@fivethree/billy-core";
export interface BillyCLI extends CorePlugin {
}
export declare class BillyCLI {
    onStart(context: Context): Promise<void>;
    create(app: any, plugin: any, context: Context): Promise<void>;
    app(app: any, context: Context): Promise<void>;
    plugin(name: string, context: Context): Promise<void>;
    build(context: Context): Promise<void>;
    clean(context: Context): Promise<void>;
    select(context: Context): Promise<void>;
}
