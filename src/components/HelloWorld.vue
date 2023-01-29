<script setup lang="ts">
import useSWRV from "@/swrv";
const fetcher = (url: string) => fetch(url).then((r) => r.json());
const { data, error } = useSWRV("https://echo.apifox.com/uuid", fetcher);
</script>

<template>
  <div>
    <div v-if="error">failed to load</div>
    <div v-if="!data">loading...</div>
    <div v-else>hello {{ data.uuid }}</div>
  </div>
</template>
