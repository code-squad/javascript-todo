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

module.exports = TodoError;
