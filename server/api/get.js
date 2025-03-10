import { getUpDownCount } from "../plugins/db"
export default defineEventHandler((event) => {
  return getUpDownCount()
})
