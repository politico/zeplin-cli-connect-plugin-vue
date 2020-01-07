import { ConnectPlugin, ComponentConfig, ComponentData, PrismLang } from "@zeplin/cli"
import { paramCase } from "param-case";
import { pascalCase } from "pascal-case";
import path from "path";
import { parse, ComponentDoc, DocGenOptions } from 'vue-docgen-api'
import { Configuration } from 'webpack'


export default class implements ConnectPlugin {
    supportedFileExtensions = [".vue"]

    docgenOptions: DocGenOptions = {}

    supports(context: ComponentConfig): boolean {
       const fileExtension = path.extname(context.path);

       return this.supportedFileExtensions.includes(fileExtension);
    }

    init(): Promise<void> {
      const webpackConfig = this.attemptToRetrieveVueCliProjectWebpackConfig()
      if (webpackConfig && webpackConfig.resolve && webpackConfig.resolve.alias) {
        this.docgenOptions = {
          alias: webpackConfig.resolve.alias
        }
      }
      return Promise.resolve()
    }

    async process(context: ComponentConfig): Promise<ComponentData> {
       const lang = PrismLang.HTML

       const componentInfo = await parse(context.path, this.docgenOptions)
       
       const { description, displayName } = componentInfo
    
       const propLines = this.getPropLines(componentInfo)

       const eventLines = this.getEventLines(componentInfo)

       const slotLines = this.getSlotLines(componentInfo)

       const snippet = this.generateSnippet(displayName, propLines, eventLines, slotLines)

       return { description, snippet, lang };
    }

    /** 
     * Note: If we eventually want to support aliases from non-Vue CLI projects,
     * we'll likely want to add a test for this and other methods to retrieve those aliases
     * For now, it's not worth the effort to setup & maintain an entire dummy Vue CLI project,
     * with the relevant vue.config.js
     */
    attemptToRetrieveVueCliProjectWebpackConfig(): Configuration {
      let webpackConfig
      try {
        // Documentation on how @vue/cli resolves the Webpack config for this file: 
        // https://cli.vuejs.org/guide/webpack.html#using-resolved-config-as-a-file
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const vueCliWebpackConfig = require('@vue/cli-service/webpack.config.js')
        
        webpackConfig = vueCliWebpackConfig
      } catch {
        console.log('Did not resolve webpack config for Vue CLI project; proceeding without aliases for parsing components')
      }
      return webpackConfig
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
          return `<template #${slot.name}="${slotBinding}"></template>`
        }

        return `<template #${slot.name}></template>`
      }) || []
    }

    getEventLines(componentInfo: ComponentDoc): string[] {
      return componentInfo.events && componentInfo.events.map(event => {
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
