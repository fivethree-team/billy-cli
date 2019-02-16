import { LaneContext } from "@fivethree/billy-core";
import { Application } from "./generated/application";
export declare class BillyCLI extends Application {
    start(context: LaneContext): Promise<void>;
    create_app(name: any, context: LaneContext): Promise<void>;
    create_plugin(plugin: any): Promise<void>;
    install_plugin(): Promise<void>;
    remove_plugin(): Promise<void>;
    build_app(): Promise<void>;
    clean_app(): Promise<void>;
    run_app(): Promise<void>;
    info(): Promise<void>;
    addPlugin(name: string): void;
    removePlugin(name: string): void;
    pluginInstalled(name: string): boolean;
    getContent(currentPlugins: string[]): string;
}
