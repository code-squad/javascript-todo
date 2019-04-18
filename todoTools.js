const fs = require('fs')
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// bootstrap
var data = fs.readFileSync('./todos.json')
var todos = JSON.parse(data)

module.exports.input = (query) => {
  return new Promise((resolve, reject) => {
    rl.question(query, (answer) => {
      resolve(answer)
    })
  })
}

// help operations
const createId = (name) => {
  let charCode = 0
  let timeNow = new Date().getTime()
  for(let i =0;i<name.length;i++){
    charCode += name.charCodeAt(i)
  }
  const uniqueId = charCode + timeNow
  return uniqueId
}
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))



// operations(add, update, delete, show)
module.exports.show = (objStr) => {
  let todoSum = todos.filter(v => v.status === 'todo').length
  let doingSum = todos.filter(v => v.status === 'doing').length
  let doneSum = todos.length - todoSum - doingSum
	
  const props = {'todo' : todoSum, 'doing' : doingSum, 'done' : doneSum}
  
  if (objStr === 'all'){
    console.log(`현재상태 : todo: ${todoSum}개, doing: ${doingSum}개, done: ${doneSum}개`)
    return
  }
  result = todos.filter(v => v.status === objStr).map(v => v.name)
  console.log(`${objStr}리스트 : 총${props[objStr]}건 : ${result.reduce((acc, cur)=> acc + ', ' + cur)}`)

  return 
}

module.exports.add = async (name, tags) => {
  tags = JSON.parse(tags)
  uniqueId = createId(name)
  todos.push({'name' : name, 'tags': tags, 'status': 'todo', 'id': uniqueId})
  console.log(`${name} 1개가 추가됐습니다. (id : ${uniqueId})`)

  await sleep(1000)
  this.show('all')
  return 
}

module.exports.update = async (id, status) => {
  id*=1
  todoIndex = todos.findIndex(element => element.id === id)
  const {name, tags} = todos[todoIndex]
  todos.splice(todoIndex, 1, {name: name, id: id, tags: tags, status: status})
  await sleep(3000)
  console.log(`${name}가 ${status}로 상태가 변경되었습니다.`)
  
  await sleep(1000)
  this.show('all')
  return
}

module.exports.delete = async (id) => {
  id*=1
  todoIndex = todos.findIndex(element => element.id === id)
  console.log(`${todos[todoIndex]}가 목록에서 삭제됩니다.`)
  todos.splice(todoIndex, 1)
  
  await sleep(1000)
  this.show('all')
  return
}






// terminate program
module.exports.shutdownRl = async () => {
  await rl.close()
  return
}
module.exports.saveFile = async () => {
  todos = JSON.stringify(todos)
  fs.writeFileSync("todos.json" ,todos)
}