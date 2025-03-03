import express from "express"
import { exec } from "child_process"

const app = express()
const pingResult = []

setInterval(() => {
  // ping google.com
  const timestamp = new Date().toISOString()
  exec(`ping -c 1 google.com`, (err, stdout, stderr) => {
    const status =
      stdout.includes("1 packets transmitted, 1 received") && !stderr
        ? "up"
        : "down"
    pingResult.push({ time: timestamp, status })
    console.log({ time: timestamp, status })
  })
}, 1000)

// serve static files from ui/dist
app.use(express.static("ui/dist"))

app.get("/api/get-ping", (req, res) => {
  res.json(pingResult)
})

app.get("/api/get-stats", (req, res) => {
  res.json({
    up: pingResult.filter((r) => r.status === "up").length,
    down: pingResult.filter((r) => r.status === "down").length,
  })
})

app.listen(3000)
