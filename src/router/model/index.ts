import {RouteLocationNormalizedLoaded} from "vue-router"
import {createEvent, sample} from "effector"

export const historyUpdated = createEvent<RouteLocationNormalizedLoaded>()

export function createRouteMatcher(config: {
  name: string
}) {
  return sample({
    clock: historyUpdated,
    fn: (update) => update.name === config.name ? update : null
  }).filterMap((match) => match ?? undefined)
}
