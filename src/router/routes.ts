import {RouteRecordRaw} from "vue-router"

const routes: RouteRecordRaw[] = [
  {
    name: "home",
    path: "/",
    component: () => import("@/app/pages/home/index.vue")
  },
  {
    name: "about",
    path: "/about",
    component: () => import("@/app/pages/about/index.vue")
  },
]

export {
  routes
}
