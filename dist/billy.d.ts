import { LaneContext } from "@fivethree/billy-core";
export declare class BillyCLI {
    create_app(context: LaneContext): Promise<void>;
    create_plugin(context: LaneContext): Promise<void>;
    install_plugin({ print, parseJSON, isBilly, prompt, exec, writeJSON }: LaneContext): Promise<void>;
    remove_plugin({ print, parseJSON, isBilly, prompt, exec, writeJSON }: LaneContext): Promise<void>;
}
