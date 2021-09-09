import {
  createWebHistory,
  createMemoryHistory,
  createRouter as _createRouter,
} from "vue-router"

import {routes} from "./routes"

export function createRouter() {
  let history = import.meta.env.SSR ? createMemoryHistory() : createWebHistory()

  let router = _createRouter({
    routes,
    history
  })

  return router
}
