import {sample} from "effector"

import {historyUpdated} from "../model"

export function createPageMatcher(config: {
  name: string
}) {
  return sample({
    clock: historyUpdated,
    fn: (update) => update.name === config.name ? update : null
  }).filterMap((match) => match ?? undefined)
}
