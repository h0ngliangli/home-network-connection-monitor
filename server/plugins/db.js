const db = useDatabase()

// 启动时从数据库读取数据，之后的更新操作都会更新这个对象，不再从数据库读取
// 以减少数据库读取次数，提高性能
const upDownCount = { up: 0, down: 0 }
// 初始化数据库、建立表、读取数据
export default defineNitroPlugin(async (nitro) => {
  await db.exec("create table if not exists ping(timestamp text, status text)")
  await readUpDownCount()
})

export async function readUpDownCount() {
  const { rows } =
    await db.sql`select status, count(*) as count from ping group by status`
  rows.reduce((acc, row) => {
    acc[row.status] = row["count"]
    return acc
  }, upDownCount)
}

export function addPing(timestamp, status) {
  if (timestamp instanceof Date) {
    timestamp = timestamp.toLocaleString()
  }
  if (!["up", "down"].includes(status)) {
    throw new Error(`Invalid status value: ${status}`)
  }
  upDownCount[status]++
  db.sql`insert into ping values(${timestamp}, ${status})`
    .then(() => {
      console.log({timestamp, status})
    })
    .catch((err) => {
      console.error(`Error adding ping: ${timestamp} ${status}`, err)
    })
}


export function getUpDownCount() {
  return upDownCount
}
