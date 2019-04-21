module.exports = MESSAGE_DICT = {
    add: (name,id)=>{console.log(`${name} 1개가 추가되었습니다. (id :${id})`)},
    update: (name,key,value) =>{console.log(`${name}의 ${key}가 ${value}로 변경되었습니다.`)
    },
    delete: (name)=> {console.log(`${name}가 목록에서 삭제되었습니다.`)},
}

