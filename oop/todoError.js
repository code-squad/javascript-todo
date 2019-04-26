const msg = require('./msg');
const TodoError = function() {};

TodoError.prototype.includeSeperator = function(str, seperator) {
  if (str.match(/\$/) === null) {
    throw new Error(msg.DONT_HAVE_SEPERATOR(seperator));
  }
};

TodoError.prototype.compareStatus = function(originStr, changingStr) {
  if (originStr === changingStr) {
    throw new Error(msg.SAME_STATUS(originStr, changingStr));
  }
};

TodoError.prototype.invalidId = function(id) {
  if (id === undefined) {
    throw new Error(msg.INVALID_ID());
  }
};

TodoError.prototype.invalidInst = function(obj, inst) {
  if (obj[inst] === undefined) {
    throw new Error(msg.INVALID_INST());
  }
};

TodoError.prototype.invalidStatus = function(conditionArr, condition) {
  if (conditionArr.includes(condition) === false) {
    throw new Error(msg.INVALID_STATUS());
  }
};

TodoError.prototype.isArray = function(inputStr) {
  const regex = /\[[\"\'\,\s\w\d]+\]/; // [로 시작하고 ]로 끝나면 통과
  if (inputStr.match(regex) === null) {
    throw new Error(msg.NOT_ARRAY(inputStr));
  }
};

module.exports = TodoError;
