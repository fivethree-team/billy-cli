#!/usr/bin/env node
import { CorePlugin } from '@fivethree/billy-plugin-core';
import { Context } from "@fivethree/billy-core";
export interface BillyCLI extends CorePlugin {
}
export declare class BillyCLI {
    this: any;
    create(app: any, context: Context): Promise<void>;
    create_plugin(plugin: string, context: Context): Promise<void>;
    build(): Promise<void>;
    clean(): Promise<void>;
}
