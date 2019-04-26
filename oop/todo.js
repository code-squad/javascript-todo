const Todo = function (todos) {
  this.todos;
}
const IdManager = function () {

}
 

const idManager = new IdManager()

Todo.prototype = {
  add : function(name, tag){
      console.log('add', name, tag)
      let id = this.createId(name)
      this.todos.push( {name: name, id: id, tag: tag.match(/[a-z0-9]+/g)})
  },
  update : function(id, status){
      console.log('update', id, status )
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

const instance = new Todo();

//Todo.add(name, id, tag)

module.exports.Todo = Todo;