<script setup>
import { ref } from "vue"

const pingStat = ref({
  up: 0,
  down: 0,
  lastDown: "",
})

// setInverval需要在onMounted中使用
onMounted(() => {
  setInterval(async () => {
    fetch("/api/stat")
      .then((res) => res.json())
      .then((data) => {
        pingStat.value.up = data.up
        pingStat.value.down = data.down
        pingStat.value.lastDown = data.lastDown
      })
  }, 1000)
})

// 计算上线率
const upRate = computed(() => {
  if (pingStat.value.up === 0 && pingStat.value.down === 0) {
    return 0
  }
  return (
    (pingStat.value.up / (pingStat.value.up + pingStat.value.down)) *
    100
  ).toFixed(2)
})

const hoursElapsed = computed(() =>
  Math.floor((pingStat.value.up + pingStat.value.down) / 60 / 60 + 0.5)
)
</script>

<template>
  <div class="center">
    <h1>Ping Stats</h1>
    <p>Up: {{ pingStat.up }} （~ {{ hoursElapsed }} hours）</p>
    <p>Down: {{ pingStat.down }}</p>
    <p>Last Down: {{ pingStat.lastDown }}</p>
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
