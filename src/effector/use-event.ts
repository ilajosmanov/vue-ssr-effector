import {inject} from "vue"
import {Event, Scope, scopeBind} from "effector"

export function useEvent<T>(event: Event<T>, scopeName = "root") {
  let scope: Scope | undefined = inject(scopeName)

  if (scope) {
    return scopeBind(event, {
      scope
    })
  }

  return event
}
