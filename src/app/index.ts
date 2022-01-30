import {createSSRApp} from "vue"
import {Scope} from "effector"
import {VueSSRPlugin} from "effector-vue/ssr"

import App from "./app.vue"

import {createRouter} from "@/router"

export function createApp(scope: Scope) {
  let router = createRouter()
  let app = createSSRApp(App)

  app.use(VueSSRPlugin({
    scope,
    scopeName: "root"
  }))
  app.use(router)

  return {
    app,
    router,
  }
}
