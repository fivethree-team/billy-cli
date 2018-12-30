import { App, Lane, LaneContext } from "@fivethree/billy-core";

@App()
export class BillyCLI {

    @Lane('start a new billy! 🚀')
    create_app({ print }: LaneContext) {
        print('Create App here');
    }

    @Lane('create a new plugin 🧩')
    create_plugin({ print }: LaneContext) {
        print('Create plugin here');
    }

    @Lane('install a plugin into your billy 👾')
    install_plugin({ print }: LaneContext) {
        print('install existing plugin here');
    }

    @Lane('remove a plugin from your project')
    remove_plugin({ print }: LaneContext) {
        print('remove installed plugin here');
    }

}
