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
       /** 
        * @TODO Determine if we can switch to `PrismLang.HTML`
        * Vue templates have no perfect analog in Prism-supported languages,
        * though they're more similar to HTML than JSX. 
        * For now, `PrismLang.Markup` is a great solution;
        * see https://github.com/zeplin/connected-components-beta-issues/issues/4#issuecomment-562738427
        */
       const lang = PrismLang.Markup
       
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
