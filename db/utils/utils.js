exports.formatDates = list => {
  const changedlist = list.map(item => {
    const itemCopy = { ...item };
    itemCopy.created_at = new Date(itemCopy.created_at);
    return itemCopy;
  });
  return changedlist;
};

exports.makeRefObj = list => {
  if (list.length === 0) return {};
  const refObj = {};
  list.forEach(item => {
    const copyItem = { ...item };
    refObj[copyItem.title] = copyItem.article_id;
  });
  return refObj;
};
