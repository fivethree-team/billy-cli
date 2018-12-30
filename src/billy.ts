import { App, Lane, LaneContext } from "@fivethree/billy-core";

@App()
export class ExampleApplication {

    @Lane('This is an example lane.\nThe only thing it really does is output Hello World! 👾')
    hello_world({ print }: LaneContext) {
        print('Hello World');
    }

}
