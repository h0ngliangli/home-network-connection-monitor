const db = useDatabase()

// 启动时从数据库读取数据，之后的更新操作都会更新这个对象，不再从数据库读取
// 以减少数据库读取次数，提高性能
const stat = { up: 0, down: 0, lastDown: "" }
// 初始化数据库、建立表、读取数据
export default defineNitroPlugin(async (nitro) => {
  await db.exec(
    "create table if not exists ping(epoch integer, timestamp text, status text, primary key(epoch))"
  )
  await updateStat()
})

export async function updateStat() {
  const { rows } =
    await db.sql`select status, count(*) as count from ping group by status`
  rows.reduce((acc, row) => {
    acc[row.status] = row["count"]
    return acc
  }, stat)
  const { rows: lastDown } =
    await db.sql`select epoch, timestamp from ping where status='down' order by epoch desc limit 1`
  stat.lastDown = lastDown[0]?.timestamp
}

export function addPing(epoch, timestamp, status) {
  if (!Number.isInteger(epoch)) {
    throw new Error(`Invalid epoch value: ${epoch}`)
  }
  if (typeof timestamp != "string") {
    throw new Error(`Invalid timestamp value: ${timestamp}`)
  }
  if (!["up", "down"].includes(status)) {
    throw new Error(`Invalid status value: ${status}`)
  }
  stat[status]++
  if (status === "down") {
    stat.lastDown = timestamp
  }
  db.sql`insert into ping values(${epoch}, ${timestamp}, ${status})`
    .catch((err) => {
      logger.error(`Error adding ping: ${epoch} ${timestamp} ${status} ${err}`)
    })
}

export function getStat() {
  return stat
}
