import * as escapeStringRegexp from "escape-string-regexp";
import * as _ from "lodash";
/**
 * goal function: built text search by arr fields name
 * @fields {array} array fields name
 * @q {string} string query
 * @return {array}
 */
function buildTextSearch(fields = [], q = "") {
  const $or = [];

  if (!fields.length || q === "") {
    return $or;
  }

  fields.forEach(field => {
    $or.push({
      [field]: new RegExp(escapeStringRegexp(q), "i")
    });
  });

  return $or;
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function convertSelectQuery(select = "") {
  return select.split(",").join(" ");
}

export const queryHelpers = {
  buildTextSearch,
  convertSelectQuery,
  timeout
};
