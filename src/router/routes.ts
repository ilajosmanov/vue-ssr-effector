import {RouteRecordRaw} from "vue-router"

const routes: RouteRecordRaw[] = [
  {
    name: "home",
    path: "/",
    component: () => import("@/app/pages/home/index.vue")
  },
]

export {
  routes
}
