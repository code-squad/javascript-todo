module.exports = {
  generateId: (function makeGenerateId() {
    var id = 0;

    return function() {
      id += 1;
      return id;
    };
  })(),

  log(message) {
    console.log(message);
  }
};
