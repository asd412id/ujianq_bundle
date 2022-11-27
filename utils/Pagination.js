module.exports.getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

module.exports.getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: datas } = data;
  const currentPage = page ? +page : 0;
  const total = Array.isArray(totalItems) ? totalItems.length : totalItems;
  const totalPages = Math.ceil(total / limit);

  return { totalItems: total, datas, totalPages, currentPage };
};