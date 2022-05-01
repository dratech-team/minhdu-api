export function uniqDatetime(datetimes: Date[]) {
  return [...new Set(datetimes.map(datetime => datetime.getTime()))].map(e => new Date(e));
}
