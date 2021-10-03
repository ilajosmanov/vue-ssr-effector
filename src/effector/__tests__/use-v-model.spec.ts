import {mount} from "@vue/test-utils"
import {createEvent, createStore} from "effector"

import {useVModel} from "../use-v-model"

describe("use-v-model.ts", () => {
  it("updated value of input if store changed from outside", async () => {
    let updated = createEvent()
    let $user = createStore({
      skills: [
        {name: "HTML", points: 10}
      ]
    })
    $user
    .on(updated, (state) => ({...state, skills: [{name: "HTML", points: 20}]}))

    let wrapper = mount({
      template: `
        <div>
          <input v-model="user.skills[0].points" data-test="skills.points">
        </div>
      `,
      setup() {
        let user = useVModel($user)
        return {user}
      }
    })
    await wrapper.find("[data-test=\"skills.points\"]").setValue(15)
    expect($user.getState()).toEqual({
      skills: [{name: "HTML", points: "15"}]
    })
    updated()

    await wrapper.vm.$nextTick()
    // @ts-ignore
    expect(wrapper.find("[data-test=\"skills.points\"]").element.value).toBe("20")
  })

  it("[v-model] works correct with scalar values", async () => {
    let $username = createStore("")
    let wrapper = mount({
      template: `
        <div><input v-model="username" data-test="field"></div>
      `,
      setup() {
        let username = useVModel($username)
        return {username}
      }
    })
    await wrapper.find("[data-test=\"field\"]").setValue("John Doe")
    expect($username.getState()).toBe("John Doe")
  })

  it("[v-model] works correct with objects", async () => {
    let $user = createStore({
      name: "",
      surname: "",
    })

    let wrapper = mount({
      template: `
        <div>
          <input v-model="user.name" data-test="name">
          <input v-model="user.surname" data-test="surname">
        </div>
      `,
      setup() {
        let user = useVModel($user)
        return {user}
      }
    })

    await wrapper.find("[data-test=\"name\"]").setValue("John")
    await wrapper.find("[data-test=\"surname\"]").setValue("Doe")
    expect($user.getState()).toEqual({
      name: "John",
      surname: "Doe",
    })
  })

  it("reset useVModel", async () => {
    let model = {
      name: "",
      surname: "",
    }
    let reset = createEvent()
    let $user = createStore(model).reset(reset)

    let wrapper = mount({
      template: `
        <div>
          <input v-model="user.name" data-test="name">
          <input v-model="user.surname" data-test="surname">
        </div>
      `,
      setup() {
        let user = useVModel($user)
        return {user}
      }
    })

    await wrapper.find("[data-test=\"name\"]").setValue("John")
    await wrapper.find("[data-test=\"surname\"]").setValue("Doe")
    reset()
    await wrapper.vm.$nextTick()
    expect($user.getState()).toEqual(model)
  })

  it("[v-model] works correct with checkboxes (like vue-3 way)", async () => {
    let $skills = createStore([])

    let wrapper = mount({
      template: `
        <input type="checkbox" v-model="skills" data-test="skills" value="HTML">
        <input type="checkbox" v-model="skills" data-test="skills" value="CSS">
        <input type="checkbox" v-model="skills" data-test="skills" value="JS">
      `,
      setup() {
        let skills = useVModel($skills)
        return {skills}
      }
    })

    await wrapper.findAll("[data-test=\"skills\"]")[0].setValue()
    await wrapper.findAll("[data-test=\"skills\"]")[1].setValue()
    await wrapper.findAll("[data-test=\"skills\"]")[2].setValue()
    expect($skills.getState()).toEqual(["HTML", "CSS", "JS"])
  })

  it("[v-model] works correct with radio (like vue-3 way)", async () => {
    let $gender = createStore("male")

    let wrapper = mount({
      template: `
        <input type="radio" name="gender" v-model="gender" data-test="gender" value="female">
        <input type="radio" name="gender" v-model="gender" data-test="gender" value="male">
      `,
      setup() {
        let gender = useVModel($gender)
        return {gender}
      }
    })

    await wrapper.find("[data-test=\"gender\"]").setValue()
    expect($gender.getState()).toEqual("female")
  })

})
