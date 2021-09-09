/* eslint-disable import/extensions */
/* eslint-disable node/global-require */
/* eslint-disable node/no-missing-require, node/no-unpublished-require */

const fs = require("fs")
const path = require("path")
const express = require("express")
const {createServer: _createServer} = require("vite")

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD
const PORT = process.env.PORT || 3000

async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production"
) {
  let resolve = (p) => path.resolve(process.cwd(), p)
  let indexProd = isProd
    ? fs.readFileSync(resolve("dist/client/index.html"), "utf-8")
    : ""

  let manifest = isProd ? require("./dist/client/ssr-manifest.json") : {}
  let app = express()
  let vite

  if (!isProd) {
    vite = await _createServer({
      root,
      logLevel: isTest ? "error" : "info",
      server: {
        middlewareMode: "ssr",
        watch: {usePolling: true, interval: 100}
      }
    })

    app.use(vite.middlewares)
  } else {
    app.use(require("compression")())
    app.use(
      require("serve-static")(resolve("dist/client"), {index: false})
    )
  }

  app.use("*", async (req, res) => {
    try {
      let url = req.originalUrl
      let template, render

      if (!isProd) {
        template = fs.readFileSync(resolve("index.html"), "utf-8")
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule("/src/entry-server.ts")).render
      } else {
        template = indexProd
        render = require("./dist/server/entry-server.js").render
      }

      let [
        appHtml,
        preloadLinks,
        state
       ] = await render(url, manifest)

      let html = template
        .replace("<!--preload-links-->", preloadLinks)
        .replace("<!--app-html-->", appHtml)
        .replace("'effector-state'", JSON.stringify(state))

      res.status(200).set({"Content-Type": "text/html"}).end(html)
    } catch (e) {
      vite && vite.ssrFixStacktrace(e)
      res.status(500).end(e.stack)
    }
  })

  return {app, vite}
}

if (!isTest) {
  createServer().then(({app}) => {
    app.listen(PORT, () => {
      console.log(`Listening on http://localhost:${PORT}...`)
    })
  })
}
