import { Context } from "@fivethree/billy-core";
import { Plugins } from "./plugins";
export declare class BillyCLI extends Plugins {
    run(context: Context): Promise<void>;
    create_app(name: any, context: Context): Promise<void>;
    create_plugin(plugin: any): Promise<void>;
    build(): Promise<void>;
    clean(): Promise<void>;
}
