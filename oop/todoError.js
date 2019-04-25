const TodoError = function(msg) {
  this.msg = msg;
};

TodoError.prototype.includeSeperator = function(str, seperator) {
  if (str.match(/\$/) === null) {
    throw new Error(this.msg.DONT_HAVE_SEPERATOR(seperator));
  }
};

module.exports = TodoError;
