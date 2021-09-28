import moment from "moment";

/**
 * @param {date|moment} start The start date
 * @param {date|moment} end The end date
 * @param {string} type The range type. eg: 'days', 'hours' etc
 */
export function getRange(
  startDate: Date,
  endDate: Date,
  type: "days" | "hours" | "months"
): Date[] {
  let fromDate = moment(startDate);
  let toDate = moment(endDate);
  let diff = toDate.diff(fromDate, type);
  let range = [];
  for (let i = 0; i < diff; i++) {
    range.push(moment(startDate).add(i, type));
  }
  return range;
}
