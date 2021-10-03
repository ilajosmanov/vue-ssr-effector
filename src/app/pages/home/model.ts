import {createPageMatcher} from "@/router"

const pageOpened = createPageMatcher({
  name: "home"
})

pageOpened.watch((result) => {
  console.log(result.name, "opened...")
})
