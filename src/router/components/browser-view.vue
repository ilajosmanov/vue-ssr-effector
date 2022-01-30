<script lang="ts" setup>
import {watch} from "vue"
import {useRoute} from "vue-router"
import {useEvent} from "effector-vue/ssr"

import {historyUpdated} from "../model"

const route = useRoute()
const updated = useEvent(historyUpdated)

watch(route, (currentRoute) => {
  updated(currentRoute)
})
</script>

<template>
  <Suspense>
    <template #default>
      <router-view />
    </template>

    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>
