const sorting = (query: any, agg = false): any => {
  const { sort_by = null, sort_dir = "asc" } = query;
  const sort_order = sort_dir == "asc" ? 1 : -1;
  const sort: Record<string, unknown> = {};
  sort[`${sort_by}`] = sort_order;
  if (agg) {
    return sort_by ? [{ $sort: sort }] : [];
  }
  return sort_by ? { sort: sort } : null;
};

const pagination = (
  query: any,
  agg = false
): any => {
  const { per_page = null, current_page = null } = query;
  if (agg) {
    return per_page && current_page
      ? [
          { $skip: (parseInt(current_page) - 1) * parseInt(per_page) },
          { $limit: parseInt(per_page) },
        ]
      : [];
  }
  return per_page && current_page
    ? {
        skip: (parseInt(current_page) - 1) * parseInt(per_page),
        limit: parseInt(per_page),
      }
    : null;
};

const paginationAndSortAggregate = (query: any) => {
  const paginateObj = pagination(query, true);
  const orderObj = sorting(query, true);
  return {
    $facet: {
      total_count: [
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ],
      paginated_data: [...paginateObj, ...orderObj],
    },
  };
};

export { sorting, pagination, paginationAndSortAggregate };
