import { App, Lane, LaneContext, Pluginfile } from "@fivethree/billy-core";

@App()
export class BillyCLI {

    @Lane('start a new billy cli app! 🚀')
    async create_app(context: LaneContext) {
        const { print, prompt, exec, exists, run, lane, app, parseJSON, writeJSON } = context;
        const name = await prompt(`What's the name of your app?`);

        if (!exists(name)) {
            print(`Ok, your app's name will be ${name}!`);
            print(`Cloning demo repository⬇`);
            await exec(`git clone https://github.com/fivethree-team/billy-app.git ${name}`);
            const packageJSON = parseJSON(`./${name}/package.json`);
            packageJSON.name = name;
            packageJSON.version = '0.0.1';
            packageJSON.bin = {};
            packageJSON.bin[name] = 'dist/index.js';
            packageJSON.scripts.test = `npm i -g && ${name}`;
            writeJSON(`./${name}/package.json`, packageJSON);
            print('Installing dependencies, this might take a while...⏳')
            await exec(`rm -rf ./${name}/package-lock.json && npm install --prefix ./${name}/`);
            print('Doing an initial build to see if everything is working. 🛠`')
            await exec(`./${name}/node_modules/.bin/tsc -p ./${name}`);
            print(`${name} is all set!✅`)
            print(`Use billy inside your project to add plugins 🧩`)

        } else {
            if (name) {
                console.error(`Directory ${name} already exists. Please choose another one...`);
            }
            run(app, lane)
        }

    }

    @Lane('create a new plugin 🧩')
    async create_plugin(context: LaneContext) {
        const { print, prompt, exec, exists, run, lane, app, parseJSON, writeJSON } = context;
        const name = await prompt(`What's the name of your plugin?`);

        if (!exists(name)) {
            print(`Ok, your plugins's name will be ${name}!`);
            print(`Cloning plugin repository⬇`);
            await exec(`git clone https://github.com/fivethree-team/billy-plugin.git ${name}`);
            const packageJSON = parseJSON(`./${name}/package.json`);
            packageJSON.name = name;
            packageJSON.version = '0.0.1';
            writeJSON(`./${name}/package.json`, packageJSON);
            print('Installing dependencies, this might take a while...⏳')
            await exec(`rm -rf ./${name}/package-lock.json && npm install --prefix ./${name}/`);
            print('Doing an initial build to see if everything is working. 🛠`')
            await exec(`./${name}/node_modules/.bin/tsc -p ./${name}`);
            print(`${name} is all set!✅`)
            print(`have fun developing! 🚀`)

        } else {
            if (name) {
                console.error(`Directory ${name} already exists. Please choose another one...`);
            }
            run(app, lane)
        }
    }

    @Lane('install a plugin into your billy 👾')
    async install_plugin({ print, parseJSON, isBilly, prompt, exec, writeJSON }: LaneContext) {
        if (isBilly()) {
            const name = await prompt("What's the name of the plugin you want to install? 🧩");
            const plugins: Pluginfile = parseJSON('./plugins.json');
            if (plugins.plugins.find(plugin => plugin === name)) {
                throw new Error('plugin already added');
            }
            print(`Installing plugin ${name} (via npm) ⌛`)
            await exec(`npm i ${name}`)
            plugins.plugins.push(name);
            writeJSON(`./plugins.json`, plugins);
            print(`Rebuilding the app for you...🛠`)
            await exec(`node_modules/.bin/tsc -p .`)
            print(`All done!🎉 You can now use ${name}'s actions in your lanes.`)
        } else {
            console.error('this lane only works inside of a billy cli project');
        }

    }

    @Lane('remove a plugin from your project')
    async remove_plugin({ print, parseJSON, isBilly, prompt, exec, writeJSON }: LaneContext) {
        if (isBilly()) {
            const name = await prompt("What's the name of the plugin you like to uninstall? ⏏");
            const plugins: Pluginfile = parseJSON('./plugins.json');
            const packageJSON = parseJSON('./package.json');

            if (!plugins.plugins.find(plugin => plugin === name)) {
                throw new Error('plugin not installed');
            }
            plugins.plugins = plugins.plugins.filter(plugin => plugin !== name);
            writeJSON(`./plugins.json`, plugins);

            delete packageJSON.dependencies[name];
            writeJSON(`./package.json`, packageJSON);

            print(`Unstalling plugin ${name}...⌛`)
            await exec(`rm -rf node_modules package-lock.json && npm install`);

            print(`Rebuilding the app for you...🛠`)
            await exec(`node_modules/.bin/tsc -p .`)
            print(`All done!🎉  Successfully removed plugin ${name}.`)
        } else {
            console.error('this lane only works inside of a billy cli project');
        }
    }

}
