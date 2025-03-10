<script setup>
import { ref } from "vue"

const pingStats = ref({
  up: 0,
  down: 0,
})
onMounted(() => {
  setInterval(async () => {
    fetch("/api/get")
      .then((res) => res.json())
      .then((data) => {
        pingStats.value.up = data.up
        pingStats.value.down = data.down
      })
  }, 1000)
})
</script>

<template>
  <div>
    <h1>Ping Stats</h1>
    <p>Up: {{ pingStats.up }}</p>
    <p>Down: {{ pingStats.down }}</p>
  </div>
</template>

<style scoped></style>
