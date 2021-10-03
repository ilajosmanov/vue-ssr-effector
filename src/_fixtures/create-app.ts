import {createSSRApp} from "vue"
import {Scope} from "effector"

import {VueSSRPlugin} from "../effector/vue-ssr-plugin"

export function createApp<T>(scope: Scope, el: T) {
  let app = createSSRApp({
    template: "<component is=\"el\"/>",
    components: {
      el
    }
  })

  app.use(VueSSRPlugin({
    scope,
    scopeName: "root"
  }))

  return {app}
}
