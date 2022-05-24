import * as _ from "lodash";
import dateFns from "date-fns";

export const datimeUniq = (intervals: { start: Date, end: Date, id: number }[]) => {
  return _.sortBy(_.uniqBy(_.flattenDeep(intervals?.map(e => {
    const range = dateFns.eachDayOfInterval({
      start: e.start,
      end: e.end
    });
    return range.map(datetime => {
      return Object.assign({}, e, {datetime});
    });
  })), (e) => e.datetime.getTime()), (e) => e.datetime);
};
