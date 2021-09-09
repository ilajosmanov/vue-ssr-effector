import {Store, Scope, is} from "effector"
import {onUnmounted, ref, inject, watch} from "vue"

import {unwrap} from "./lib/unwrap"
import {copy} from "./lib/copy"
import {stateReader} from "./lib/state-reader"

export function useVModel<T>(store: Store<T>, scopeName = "root") {
  if (!is.store(store)) throw Error("expect useStore argument to be a store")

  let scope: Scope | undefined = inject(scopeName)

  let _ = ref(copy(stateReader(store, scope)))

  let isSelfUpdate = false
  let fromEvent = false

  let unwatch = store.updates.watch(payload => {
    if (isSelfUpdate) {
      return
    }

    fromEvent = true
    _.value = ref(copy(payload)).value
  })

  onUnmounted(() => {
    unwatch()
  })

  watch(
    () => _.value,
    value => {
      isSelfUpdate = true

      if (!fromEvent) {
        let raw = ref(unwrap(value)).value
        // @ts-ignore
        store.setState(copy(raw))
      }

      fromEvent = false
      isSelfUpdate = false
    },
    {deep: true, immediate: false},
  )

  return _
}