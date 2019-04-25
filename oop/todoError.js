const TodoError = function(msg) {
  this.msg = msg;
};

TodoError.prototype.includeSeperator = function(str, seperator) {
  if (str.match(/\$/) === null) {
    throw new Error(this.msg.DONT_HAVE_SEPERATOR(seperator));
  }
};

TodoError.prototype.compareStatus = function(originStr, changingStr) {
  if (originStr === changingStr) {
    throw new Error(this.msg.SAME_STATUS(originStr, changingStr));
  }
};

TodoError.prototype.invalidId = function(id) {
  if (id === undefined) {
    throw new Error(this.msg.INVALID_ID());
  }
};

module.exports = TodoError;
