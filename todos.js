const tools = require('./todoTools')




// tools.show('all')
// tools.show('todo')
// tools.show('doing')
// tools.show('done')

//todos.push({name: '자스노드자스노드', tags: ['nodejs', 'javacoffee'], status: 'todo', id: 12421521341235234})
const main =  async () => {
  let argu = ''
  while(1){
    argu = await tools.input('명령해주세요! >> ')
    let getOut = false
    let props = argu.split('$')
    switch(props[0]) {
      case 'show':
      tools.show(props[1])
      break

      case 'add':
      await tools.add(props[1], props[2])
      break

      case 'update':
      await tools.update(props[1], props[2])
      break

      case 'delete':
      await tools.delete(props[1])
      break

      case 'exit':
      getOut = true
      break
      
      case 'test':
      break
      
      default:
      console.log('사용법에 대해서 설명하기')
    }
    if(getOut === true){
      break
    }
  }

  tools.shutdownRl()
  tools.saveFile()
}

main()