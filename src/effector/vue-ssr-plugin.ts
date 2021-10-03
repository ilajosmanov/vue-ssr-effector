import {Scope} from "effector"
import {Plugin} from "vue"

function VueSSRPlugin(options: {scope: Scope; scopeName?: string}): Plugin {
  return {
    install(app) {
      let scopeName = options.scopeName ?? "root"

      app.config.globalProperties.scopeName = scopeName
      app.provide(app.config.globalProperties.scopeName, options.scope)
    }
  }
}


export {
  VueSSRPlugin
}