/* eslint-disable vue/one-component-per-file */
import {createEvent, createStore, fork, allSettled, createEffect} from "effector"
import {mount} from "@vue/test-utils"
import {defineComponent} from "vue"
import {renderToString} from "@vue/server-renderer"

import {useStore} from "../use-store"
import {prettyHtml} from "../../_fixtures/pretty"
import {createApp} from "../../_fixtures/create-app"

describe("use-store.ts", () => {
  it("list of primitive values rendered correct", () => {
    let length = 3
    let $numbers = createStore(Array.from({length}, (_, idx) => idx))
    let wrapper = mount({
      template: `
        <ul id="app">
          <li v-for="(n, key) in numbers" :key="key" data-test="item">{{n}}</li>
        </ul>
      `,
      setup() {
        let numbers = useStore($numbers)
        return {numbers}
      }
    })

    expect(wrapper.findAll("[data-test=\"item\"]")).toHaveLength(length)
  })

  it("add new item and re-render list", async () => {
    let userAdded = createEvent()
    let $users = createStore([{name: "John", surname: "Doe"}])

    $users.on(userAdded, (state) => [...state, {name: "Alan", surname: "Doe"}])

    let wrapper = mount({
      template: `
        <ul id="app">
          <li v-for="(item, key) in users" :key="key" data-test="item">{{item.name}}</li>
        </ul>
      `,
      setup() {
        let users = useStore($users)
        return {users}
      }
    })

    userAdded()

    await wrapper.vm.$nextTick()
    expect(wrapper.findAll("[data-test=\"item\"]")).toHaveLength(2)
  })
})

describe("use-store.ts [ssr]", () => {
  it("initial render works correct", async () => {
    let name$ = createStore("John Doe")
    let scope = fork()
    let wrapper = defineComponent({
      setup() {
        let name = useStore(name$)
        return {name}
      },
      template: "<div>{{name}}</div>"
    })

    let {app} = createApp(scope, wrapper)
    let html = await renderToString(app)
    expect(prettyHtml(html)).toMatchInlineSnapshot(`
      "
      <div>John Doe</div>
      "
    `)
  })

  it("store changed before app rendered", async () => {
    let result = "Alan Doe"
    let updated = createEvent()
    let name$ = createStore("John Doe")
    name$.on(updated, () => result)

    let scope = fork()
    await allSettled(updated, {scope})

    let wrapper = defineComponent({
      setup() {
        let name = useStore(name$)
        return {name}
      },
      template: "<div>{{name}}</div>"
    })

    let {app} = createApp(scope, wrapper)
    let html = await renderToString(app)
    expect(prettyHtml(html)).toMatchInlineSnapshot(`
      "
      <div>${result}</div>
      "
    `)
  })

  it("store changed after effect before app rendered", async () => {
    let result = "Alan Doe"
    let updated = createEffect(() => {
      // eslint-disable-next-line promise/param-names
      return new Promise<void>((r) => {
        setTimeout(() => { r() }, 1000)
      })
    })
    let name$ = createStore("John Doe")
    name$.on(updated.doneData, () => result)

    let scope = fork()
    await allSettled(updated, {scope})

    let wrapper = defineComponent({
      setup() {
        let name = useStore(name$)
        return {name}
      },
      template: "<div>{{name}}</div>"
    })

    let {app} = createApp(scope, wrapper)
    let html = await renderToString(app)
    expect(prettyHtml(html)).toMatchInlineSnapshot(`
      "
      <div>${result}</div>
      "
    `)
  })
})
