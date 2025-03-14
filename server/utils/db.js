const _db = useDatabase()
const _cacheStat = { up: 0, down: 0, lastDown: "" }
const _cacheRecentDowns = []
const _recentSize = 10

/*
 * 创建表并读取数据到缓存
 */
export async function util_dbInit() {
  logger.debug("initiating database")
  await _db.exec(
    `create table if not exists ping(
        epoch integer, 
        epoch_str text, 
        status text, 
        ping_ms int, 
        primary key(epoch)
    )`
  )
  logger.debug("updating cache stat")
  let sqldata =
    await _db.sql`select status, count(*) as count from ping group by status`
  sqldata.rows.forEach((row) => (_cacheStat[row.status] = row.count))
  sqldata =
    await _db.sql`select epoch_str from ping where status='down' order by epoch desc limit 1`
  _cacheStat.lastDown = sqldata.rows[0]?.epoch_str || ""
  logger.debug("_cacheStat = %o", _cacheStat)

  logger.debug("updating recent downs")
  sqldata =
    await _db.sql`select epoch_str from ping where status='down' order by epoch desc`
  _cacheRecentDowns.length = 0
  sqldata.rows.forEach((row) => _cacheRecentDowns.push(row.epoch_str))
  logger.debug("_cacheRecentDowns = %o", _cacheRecentDowns)
}

/*
 *   保存ping数据到数据库
 */
export async function util_dbSavePing(ping) {
  const { epoch, epoch_str, status, ping_ms } = ping
  await _db.sql`insert into ping values(${epoch}, ${epoch_str}, ${status}, ${ping_ms})`
  _cacheStat[status]++
  if (status === "down") {
    _cacheStat.lastDown = epoch_str
    _cacheRecentDowns.unshift(epoch_str)
    _cacheRecentDowns.length = _recentSize
  }
}

/*
 *   返回缓存的统计数据
 */
export function util_dbGetStat() {
  return { ..._cacheStat }
}

/*
 *   返回缓存的最近down的时间戳
 */
export function util_dbGetRecentDowns() {
  return [..._cacheRecentDowns]
}
