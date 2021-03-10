const responseHelper = {
  sendItems
};

function sendItems(items, total = 0, skip = 0, limit = 0, query: any = {}) {
  return {
    skip: parseInt(query.skip || 0),
    limit: parseInt(query.limit || 10),
    total: total,
    items: items
  };
}
