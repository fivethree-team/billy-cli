import { Context } from "@fivethree/billy-core";
import { Application } from "./generated/application";
export declare class BillyCLI extends Application {
    run(context: Context): Promise<void>;
    create_app(name: any, context: Context): Promise<void>;
    create_plugin(plugin: any): Promise<void>;
    build(): Promise<void>;
    clean(): Promise<void>;
}
