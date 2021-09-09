import {createSSRApp} from "vue"
import {Scope} from "effector"

import App from "./app.vue"

import {createRouter} from "@/router"

export function createApp(scope: Scope) {
  let router = createRouter()
  let app = createSSRApp(App)

  app.provide("root", scope)
  app.use(router)

  return {
    app,
    router,
  }
}
