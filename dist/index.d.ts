#!/usr/bin/env node
import { CorePlugin } from '@fivethree/billy-plugin-core';
import { Context } from "@fivethree/billy-core";
export interface BillyCLI extends CorePlugin {
}
export declare class BillyCLI {
    this: any;
    run(context: Context): Promise<void>;
    create_app(name: any, context: Context): Promise<void>;
    create_plugin(plugin: any): Promise<void>;
    build(): Promise<void>;
    clean(): Promise<void>;
}
