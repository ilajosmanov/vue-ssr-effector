import {createEffect, createEvent} from "effector"
import {NavigationFailure, RouteLocationNormalizedLoaded, RouteLocationRaw} from "vue-router"

export const pageChangedFx = createEffect<RouteLocationRaw, Promise<void | NavigationFailure | undefined>, Error>()
export const historyUpdated = createEvent<RouteLocationNormalizedLoaded>()
