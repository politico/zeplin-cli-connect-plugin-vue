import { ConnectPlugin, ComponentConfig, ComponentData, PrismLang } from "@zeplin/cli"
import { parse } from 'vue-docgen-api'
import path from "path";

export default class implements ConnectPlugin {
    supportedFileExtensions = [".vue"]

    supports(context: ComponentConfig): boolean {
        // Here goes your implementation

        /**
        * CLI invokes this method per component in .zeplin/components.json file
        * to determine if this plugin should process the component config
        */

       const fileExtension = path.extname(context.path);

       return this.supportedFileExtensions.includes(fileExtension);
    }

    async process(context: ComponentConfig): Promise<ComponentData> {
        // Here goes your implementation

        /**
        * CLI invokes this method per component in .zeplin/components.json file
        * and returns a description, snippet, PrismLang language info for syntax highlighting
        */

       const componentInfo = await parse(context.path)
       const lang = PrismLang.HTML
       const description = componentInfo.description

       console.log(componentInfo)
    
       const propsBlock = componentInfo.props && componentInfo.props.map(prop => {
           return `${prop.name}="${prop.type && prop.type.name || 'unknown'}"`
       }) || []
       /** @TODO Replace with real, PUG-based snippet generation */
       const snippet = `
<${componentInfo.displayName}
  ${propsBlock.join('\n  ')}
/>
        `
       return { description, snippet, lang };
    }
}
