import { util_pingStart } from "../utils/ping"

export default defineNitroPlugin(async (nitro) => {
  await util_dbInit()
  util_pingStart()
  nitro.hooks.hookOnce("close", () => {
    logger.debug("closing nitro server")
    util_pingStop()
  })
})
