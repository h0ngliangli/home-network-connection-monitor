import { exec } from "child_process"
import { util_dbSavePing } from "./db"

const _pingTimeout = 3
const _pingCli = `ping -c 1 -W ${_pingTimeout} google.com`
let _pingIntervalHandle = null

export function util_pingStart() {
  _pingIntervalHandle = setInterval(() => {
    const now = new Date()
    const epoch = now.getTime()
    const epoch_str = now.toLocaleString()
    let status = "up"
    let ping_ms = 0
    exec(_pingCli, (err, stdout, stderr) => {
      if (err) {
        status = "down"
      } else {
        ping_ms = Math.floor(Number(stdout.match(/time=(\d+\.\d+)/)[1]) + 0.5)
        logger.info(
          `${epoch_str} ${status == "up" ? "⬆️" : "❌"} ${
            ping_ms ? ping_ms + "ms" : ""
          }`
        )
        util_dbSavePing({ epoch, epoch_str, status, ping_ms })
      }
    })
  }, 1000)
}

export function util_pingStop() {
  clearInterval(_pingIntervalHandle)
}
