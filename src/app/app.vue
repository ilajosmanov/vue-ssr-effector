<script lang="ts" setup>
import {BrowserView} from "@/router"
</script>

<template>
  <nav>
    <ul>
      <li>
        <router-link :to="{name: 'home'}">
          Home
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'about'}">
          About
        </router-link>
      </li>
    </ul>
  </nav>
  <browser-view />
</template>
