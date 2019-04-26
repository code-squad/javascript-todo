const fs = require('fs');
const data = fs.readFileSync("./data.json")
const todos = JSON.parse(data)

const IdManager = function () {

}
 

const idManager = new IdManager()

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
  },
  add : function(){
    todos.push(this)
    this.save()
  },
  update : function(id, status){
    index = todos.findIndex(element => element.id === id*1)
    if(index === -1){
      console.log('잘못된 id값입니다. 다시 확인해주세요')
    }
    let {name, tags} = todos[index]
    this.name = name
    this.tag = tags
    this.status = status
    this.id = id
    todos.splice(index, 1, this)
    this.save()
  } ,
  delete : function(id) {
      console.log('delete', id)
  },
  show : function(option) {

  },
  createId: function (name) {
      let charCode = 0
      let timeNow = new Date().getTime()
      for(let i = 0; i<name.length;i++){
          charCode += name.charCodeAt(i)
      }
      return charCode + timeNow
  },
}

Todo.getInstruction = function (userInput) {
  const test = userInput[0]
  // todo[userInput[0]](...userInput)
}


//Todo.add(name, id, tag)

module.exports.Todo = Todo;