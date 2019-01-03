import { LaneContext } from "@fivethree/billy-core";
export declare class BillyCLI {
    create_app(context: LaneContext): Promise<void>;
    create_plugin(context: LaneContext): Promise<void>;
    install_plugin({ print, parseJSON, billy, prompt, exec, writeJSON }: LaneContext): Promise<void>;
    remove_plugin({ print, parseJSON, billy, prompt, exec, writeJSON }: LaneContext): Promise<void>;
    test({ readText, writeText, pascalcase }: LaneContext): Promise<void>;
}
