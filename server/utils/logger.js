import pino from "pino"
import pino_pretty from "pino-pretty"

// 这里要注意pino函数的参数是两个，第一个是配置对象，第二个是可选的传输对象
export const logger = pino(
  {
    level: "debug",
  },
  pino_pretty({
    colorize: true,
  })
)

logger.info("logger initialized")

