import {
  createWebHistory,
  createMemoryHistory,
  createRouter as _createRouter,
} from "vue-router"

import {routes} from "./routes"
import {pageChangedFx} from "./model"

export function createRouter() {
  let history = import.meta.env.SSR ? createMemoryHistory() : createWebHistory()

  let router = _createRouter({
    routes,
    history
  })

  pageChangedFx.use(router.push)

  return router
}
