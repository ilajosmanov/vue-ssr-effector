import {isReactive, toRaw, unref} from "vue"

export function unwrap<T>(payload: T) {
  let data = unref(payload)
  let raw = isReactive(data) ? toRaw(data) : data
  return raw
}
