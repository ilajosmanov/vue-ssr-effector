import {fork} from "effector"

import {createApp} from "./app"

const values = {
  ...(typeof window !== "undefined" && window.__INITIAL_STATE__),
}

const scope = fork({
  values,
})

const {app, router} = createApp(scope)

router.isReady().then(() => {
  app.mount("#app", true)
})
