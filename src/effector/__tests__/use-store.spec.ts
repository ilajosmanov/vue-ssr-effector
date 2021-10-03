import {createEvent, createStore} from "effector"
import {mount} from "@vue/test-utils"

import {useStore} from "../use-store"

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
