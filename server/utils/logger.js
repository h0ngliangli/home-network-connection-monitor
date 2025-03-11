import pino from "pino"
import pino_pretty from "pino-pretty"

// 这里要注意
export const logger = pino(
  {
    level: "debug",
  },
  pino_pretty({
    colorize: true,
  })
)

logger.info("logger initialized")

