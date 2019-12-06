# Zeplin CLI Connected Components - Vue Plugin

![Example Zeplin snippet created by the plugin](docs/example_snippet.png)

Zeplin CLI plugin, to send Vue component snippets to Zeplin

To use:

1. Follow instructions for setting up Zeplin Connected Components, and the required `components.json` file; see [Zeplin's blog post](https://blog.zeplin.io/introducing-connected-components-components-in-design-and-code-in-harmony-aa894ed5bd95) (still in beta as of Dec. 2019)
2. Once your `components.json` is ready, then:
```bash
npm i @zeplin/cli -D
npm i zeplin-cli-connect-plugin-vue

npx zeplin connect -p zeplin-cli-connect-plugin-vue
```

And that's it! In addition to any Component or Storybook links you've setup, snippets for your `.vue` components will now be available alongside your Zeplin components
