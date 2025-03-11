<script setup>
import { ref } from "vue"

const pingStats = ref({
  up: 0,
  down: 0,
  lastDown: "",
})

// setInverval需要在onMounted中使用
onMounted(() => {
  setInterval(async () => {
    fetch("/api/get")
      .then((res) => res.json())
      .then((data) => {
        pingStats.value.up = data.up
        pingStats.value.down = data.down
        pingStats.value.lastDown = data.lastDown
      })
  }, 1000)
})

// 计算上线率
const upRate = computed(() => {
  if (pingStats.value.up === 0 && pingStats.value.down === 0) {
    return 0
  }
  return ((pingStats.value.up / (pingStats.value.up + pingStats.value.down)) * 100).toFixed(2)
})
</script>

<template>
  <div class="center">
    <h1>Ping Stats</h1>
    <p>Up: {{ pingStats.up }}</p>
    <p>Down: {{ pingStats.down }}</p>
    <p>Last Down: {{ pingStats.lastDown }}</p>
    <p>Uptime: {{ upRate }}%</p>
  </div>
</template>

<style>
body {
  background-color: black;
  color: white;
}
.center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
