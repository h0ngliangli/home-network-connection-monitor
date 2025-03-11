import { exec } from "child_process"
import { addPing } from "./db"

const pingTimeout = 3
const pingCli = `ping -c 1 -W ${pingTimeout} google.com`

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
    const now = new Date()
    const epoch = now.getTime()
    const timestamp = now.toLocaleString()
    let status = ""
    ping()
      .then((stdout) => {
        status = "up"
      })
      .catch((err) => {
        status = "down"
        console.error("Error pinging google.com", err)
      })
      .finally(() => {
        addPing(epoch, timestamp, status)
        console.log({ epoch, timestamp })
      })
  }, 1000)
})
