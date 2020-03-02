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

exports.formatComments = (comments, articleRef) => {
  if (comments.length === 0) return [];
  const newArray = comments.map(item => {
    copyItem = { ...item };
    copyItem.author = copyItem.created_by;
    copyItem.article_id = articleRef[copyItem.belongs_to];
    copyItem.created_at = new Date(copyItem.created_at);
    delete copyItem.created_by;
    delete copyItem.belongs_to;
    return copyItem;
  });
  return newArray;
};
