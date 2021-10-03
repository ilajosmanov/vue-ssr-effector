import {Store, is} from "effector"
import {onUnmounted, ref, watch} from "vue"

import {unwrap} from "./lib/unwrap"
import {copy} from "./lib/copy"
import {stateReader} from "./lib/state-reader"
import {createWatch} from "./lib/create-watch"
import {getScope} from "./lib/get-scope"

export function useVModel<T>(store: Store<T>) {
  if (!is.store(store)) throw Error("expect useStore argument to be a store")

  let {scope} = getScope()

  let _ = ref(
    copy(stateReader(store, scope))
  )

  let isSelfUpdate = false
  let fromEvent = false

  let stop = createWatch(
    store,
    (payload) => {
      if (isSelfUpdate) {
        return
      }

      fromEvent = true
      _.value = ref(copy(payload)).value
    },
    scope
  )

  onUnmounted(() => {
    stop()
  })

  watch(
    () => _.value,
    (value) => {
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
