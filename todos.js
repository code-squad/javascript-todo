const tools = require('./todoTools'); // 세미콜론이 없으면 뒤에 iife에서 오류나는 언어가 있다?

const main = async () => {
  let argu = ''
  console.log('안녕!이라고 입력하면 사용법을 알려줍니다.')
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
      console.log('자료를 저장하고 프로그램을 종료합니다.')
      break

      default:
      console.log('=======사용법==================================================================')
      console.log('명령어: show, add, update, delete, exit')
      console.log('show$옵션 >> 옵션 all, todo, doing 또는 done을 통해 해당 기록을 볼 수 있습니다.')
      console.log('add$할일$["태그",] >> 할일을 todo 상태로 생성합니다.')
      console.log('update$아이디$상태 >> 해당 아이디의 할일의 상태를 바꿔줍니다.')
      console.log('delete$아이디 >> 해당 아이디의 할일을 지웁니다.')
      console.log('================================================================================')
    }
    if(getOut === true){
      break
    }
  }
  tools.shutdownRl()
  tools.saveFile()
}
main()