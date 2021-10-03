import {createPageMatcher} from "@/router"

const pageOpened = createPageMatcher({
  name: "about"
})

pageOpened.watch((result) => {
  console.log(result.name, "opened...")
})
