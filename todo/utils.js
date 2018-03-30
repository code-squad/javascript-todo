
const enumCheck = function(checkData, enumData) {
    return !!enumData[checkData]
}
const notNumber = function(number) {
    return isNaN(Number(number))
}  

module.exports = Object.freeze({
     enumCheck,
     notNumber,
  });