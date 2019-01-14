import { Application } from "./generated/application";
export declare class BillyCLI extends Application {
    create_app(): Promise<void>;
    create_plugin(): Promise<void>;
    install_plugin(): Promise<void>;
    remove_plugin(): Promise<void>;
    addPlugin(name: string): void;
    removePlugin(name: string): void;
    pluginInstalled(name: string): boolean;
    getContent(currentPlugins: string[]): string;
}
