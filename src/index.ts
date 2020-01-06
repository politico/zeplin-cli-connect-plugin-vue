import { ConnectPlugin, ComponentConfig, ComponentData, PrismLang } from "@zeplin/cli"
import { paramCase } from "param-case";
import { pascalCase } from "pascal-case";
import { parse, ComponentDoc } from 'vue-docgen-api'
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
       
       const { description, displayName } = componentInfo
    
       const propLines = this.getPropLines(componentInfo)

       const eventLines = this.getEventLines(componentInfo)

       const slotLines = this.getSlotLines(componentInfo)

       const snippet = this.generateSnippet(displayName, propLines, eventLines, slotLines)

       return { description, snippet, lang };
    }

    getPropLines(componentInfo: ComponentDoc): string[] {
      return componentInfo.props && componentInfo.props.map(prop => 
        `${paramCase(prop.name)}="${prop.type && prop.type.name || 'unknown'}"`
    ) || []
    }
    
    getSlotLines(componentInfo: ComponentDoc): string[] {
      return componentInfo.slots && componentInfo.slots.map(slot => {
        if (slot.name === 'default') return `<!-- content -->`

        if (slot.scoped) {
          let slotBinding = 'scopedBinding'
          if (slot.bindings && slot.bindings[0] && slot.bindings[0].name) slotBinding = slot.bindings[0].name
          return `<template v-slot:${slot.name}="${slotBinding}"></template>`
        }

        return `<template v-slot:${slot.name}></template>`
      }) || []
    }

    getEventLines(componentInfo: ComponentDoc): string[] {
      return componentInfo.events && componentInfo.events.map(event => {
        console.log(JSON.stringify(event))
        return `@${event.name}="handle${pascalCase(event.name)}"`
      }) || []
    }

    generateSnippet(displayName: string, propLines: string[], eventLines: string[], slotLines: string[]): string {
      let snippet =''

      const combinedPropEventLines = [...propLines, ...eventLines]

      if (!combinedPropEventLines.length && !slotLines.length) {

        snippet = `<${displayName} />`

      } else if (combinedPropEventLines.length && !slotLines.length) {

        snippet =
`<${displayName}
  ${combinedPropEventLines.join('\n  ')}
/>`

      } else if (!combinedPropEventLines.length && slotLines.length) {

        snippet =
`<${displayName}>
  ${slotLines.join('\n  ')}
</${displayName}>`

      } else {

        snippet =
`<${displayName}
  ${combinedPropEventLines.join('\n  ')}
>
  ${slotLines.join('\n  ')}
</${displayName}>`

      } 

      return snippet
    }
}
