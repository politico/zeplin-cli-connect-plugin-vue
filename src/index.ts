import { ConnectPlugin, ComponentConfig, ComponentData, PrismLang } from "@zeplin/cli"
import { parse } from 'vue-docgen-api'
import path from "path";

export default class implements ConnectPlugin {
    supportedFileExtensions = [".vue"]

    supports(context: ComponentConfig): boolean {
       const fileExtension = path.extname(context.path);

       return this.supportedFileExtensions.includes(fileExtension);
    }

    async process(context: ComponentConfig): Promise<ComponentData> {
       const lang = PrismLang.HTML
       
       const componentInfo = await parse(context.path)
       
       const description = componentInfo.description
    
       const propsBlock = componentInfo.props && componentInfo.props.map(prop => {
           return `${prop.name}="${prop.type && prop.type.name || 'unknown'}"`
       }) || []

       /** @TODO Determine if we need pug or other templating tools to help with things like slots & events  */
       const snippet = 
`<${componentInfo.displayName}
  ${propsBlock.join('\n  ')}
/>`
       return { description, snippet, lang };
    }
}
