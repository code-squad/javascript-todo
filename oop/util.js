function countByProp(arr, prop) {
  const groupByProp =  arr.reduce((groups, element) => {
    var value = element[prop];
    groups[value] = groups[value] || [];
    groups[value].push(value);
    return groups;
  }, {});

  return Object.keys(groupByProp).reduce((groups, prop) => {
    groups[prop] = (Array.isArray(groupByProp[prop]) ? groupByProp[prop].length : 1 );
    return groups; 
  }, {});
};


module.exports = {
  countByProp,
}