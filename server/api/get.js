import { getStat } from "../plugins/db"
export default defineEventHandler((event) => {
  return getStat()
})
