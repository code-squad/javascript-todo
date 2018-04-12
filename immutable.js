// 삽입, 수정, 삭제된 객체를 반환(immutable하게 작동)

function getDeletedPropertyObject({source, targetProp, initVal = {}}){
  return Object.keys(source).reduce((obj, key) =>{
    if(key !== targetProp) obj[key] = source[key];
    return obj;
  }, initVal)
}

function getDeletedIndexArray({source, targetIdx, alterVal = []}){
  return source.slice(0, targetIdx).concat(alterVal, source.slice(targetIdx+1));
}

module.exports = {
  object : getDeletedPropertyObject,
  array : getDeletedIndexArray
}