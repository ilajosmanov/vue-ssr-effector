import {renderToString} from "@vue/server-renderer"
import {
  fork,
  serialize,
  allSettled,
} from "effector"

import {createApp} from "./app"
import {historyUpdated} from "./router/model"

type Manifest = Record<string, string[] | undefined>
type Modules = string[]

function renderPreloadLink(file: string) {
  if (file.endsWith(".js")) {
    return `<link rel="modulepreload" crossorigin href="${file}">`
  } if (file.endsWith(".css")) {
    return `<link rel="stylesheet" href="${file}">`
  }
  return ""
}

function renderPreloadLinks(modules: Modules, manifest: Manifest) {
  let links = ""
  let seen = new Set()

  modules.forEach((id) => {
    let files = manifest[id]
    if (files) {
      files.forEach((file) => {
        if (!seen.has(file)) {
          seen.add(file)
          links += renderPreloadLink(file)
        }
      })
    }
  })

  return links
}

export async function render(url: string, manifest: Manifest) {
  let scope = fork()
  let {app, router} = createApp(scope)

  try {
    await allSettled(historyUpdated.prepend(() => router.resolve(url)), {
      scope,
    })

    let state = serialize(scope)
    router.push(url)

    await router.isReady()

    let to = router.currentRoute
    if (to.value.matched.length === 0) {
      return ""
    }

    let ctx: Record<string, Modules> = {}
    let html = await renderToString(app, ctx)
    let preloadLinks = renderPreloadLinks(ctx.modules, manifest)

    return [html, preloadLinks, state]
  } catch (e) {
    return e
  }
}
