import { ConnectPlugin, ComponentConfig, ComponentData, PrismLang } from "@zeplin/cli";

export default class implements ConnectPlugin {

    supports(context: ComponentConfig): boolean {
        // Here goes your implementation

        /**
        * CLI invokes this method per component in .zeplin/components.json file
        * to determine if this plugin should process the component config
        */
    }

    async process(context: ComponentConfig): Promise<ComponentData> {
        // Here goes your implementation

        /**
        * CLI invokes this method per component in .zeplin/components.json file
        * and returns a description, snippet, PrismLang language info for syntax highlighting
        */

    }
}
