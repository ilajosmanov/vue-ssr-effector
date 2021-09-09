import {RouteRecordRaw} from "vue-router"

const routes: RouteRecordRaw[] = [
  {
    name: "home",
    path: "/",
    component: () => import("@/app/pages/home.vue")
  },
]

export {
  routes
}
