import {is, Scope, Store} from "effector"
import {onUnmounted, readonly, shallowRef, inject} from "vue"

import {createWatch} from "./lib/create-watch"
import {stateReader} from "./lib/state-reader"
import {throwError} from "./lib/throw"

export function useStore<T>(store: Store<T>, scopeName = "root") {
  if (!is.store(store)) throwError("expect useStore argument to be a store")

  let scope: Scope | undefined = inject(scopeName)
  let state = stateReader(store, scope)
  let _ = shallowRef(state)

  let stop = createWatch(
    store,
    (value) => {
      _.value = shallowRef(value).value
    },
    scope
  )

  onUnmounted(() => {
    stop()
  })

  return readonly(_)
}
