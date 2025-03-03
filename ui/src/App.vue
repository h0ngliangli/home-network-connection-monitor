<script setup>
import { computed, ref } from "vue"
const pingStats = ref({
  up: 0,
  down: 0,
})
computed
function getPingStats() {
  fetch("/api/get-stats")
    .then((res) => res.json())
    .then((data) => {
      pingStats.value = data
    })
}
setInterval(getPingStats, 1000)
</script>

<template>
  <div>
    <h1>Ping Stats</h1>
    <p>Up: {{ pingStats.up }}</p>
    <p>Down: {{ pingStats.down }}</p>
  </div>
</template>

<style scoped></style>
