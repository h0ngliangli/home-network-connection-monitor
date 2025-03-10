import { exec } from "child_process"
import { addPing } from "./db"

const pingCli = "ping -c 1 -W 3 google.com"

// exec pingCli
const ping = async () => {
  return new Promise((resolve, reject) => {
    exec(pingCli, (err, stdout, stderr) => {
      if (err) {
        reject(err)
      }
      resolve(stdout)
    })
  })
}

// call ping every second
export default defineNitroPlugin((nitro) => {
  setInterval(async () => {
    ping()
      .then((stdout) => {
        addPing(new Date(), "up")
      })
      .catch((err) => {
        addPing(new Date(), "down")
      })
  }, 1000)
})
