const fs = require('fs');
const data = fs.readFileSync("./data.json")
const todos = JSON.parse(data)

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))

const Todo = function (name, tag) {
  this.name = name
  this.tag = JSON.parse(tag)
  this.status = 'todo'
  let id = this.createId(name)
  this.id = id
}


Todo.prototype = {
  save: function (){
    let data = JSON.stringify(todos)
    fs.writeFileSync("data.json" ,data)
    return
  },
  createId: function (name) {
    let charCode = 0
    let timeNow = new Date().getTime()
    for(let i = 0; i<name.length;i++){
        charCode += name.charCodeAt(i)
    }
    return charCode + timeNow
  },
  findById: function (id){
    let index = todos.findIndex(element => element.id === id*1)
    if(index === -1){
      console.log('잘못된 id값입니다. 다시 확인해주세요')
      return -1
    }
    return index
  },
  add : async function(){
    todos.push(this)
    console.log(`${this.name} 1개가 추가됐습니다. (id : ${this.id})`)
    await sleep(1000)
    this.save()
    this.show('all')
    return
  },
  update : async function(id, statusToChange){
    let index = this.findById(id)
    if(index==-1) return 
    let {name, tags, status} = todos[index]
    if (statusToChange === status){
      console.log('바꾸려는 내용이 현재 내용과 똑같습니다.')
      return 
    }
    this.name = name
    this.tag = tags
    this.status = statusToChange
    this.id = id

    todos.splice(index, 1, this)
    await sleep(3000)
    console.log(`${name}가 ${statusToChange}로 상태가 변경되었습니다.`)
    await sleep(1000)
    this.show('all')
    this.save()
    return
  } ,
  delete : function(id) {
    let index = this.findById(id)
    if(index==-1) return 
    console.log(`${todos[index].name} ${todos[index].status}가 목록에서 삭제됩니다.`)
    await(sleep)
    this.show('all')
    todos.splice(index, 1)
    this.save()
  },
  show : function(option) {
    let todoSum = todos.filter(v => v.status === 'todo').length
    let doingSum = todos.filter(v => v.status === 'doing').length
    let doneSum = todos.length - todoSum - doingSum
    
    const props = {'todo' : todoSum, 'doing' : doingSum, 'done' : doneSum}
    
    if (option === 'all'){
      console.log(`현재상태 : todo: ${todoSum}개, doing: ${doingSum}개, done: ${doneSum}개`)
      return
    }
    result = todos.filter(v => v.status === option).map(v => v.name)
    console.log(`${option}리스트 : 총${props[option]}건 : ${result.reduce((acc, cur)=> acc + ', ' + cur)}`)

    return 
  },
  
}

module.exports.Todo = Todo;