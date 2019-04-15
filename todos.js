const todos = [
  {
    'name' : '자바스크립트 공부하기', 
    'tags' : ['programming', 'javascript'],
    'status' : 'todo',
    'id' : 12123123
  },
                {
    'name' : ' 그림 그리기', 
    'tags' : ['picture', 'favorite'],
    'status' : 'doing',
    'id' : 312323
  },
  {
    'name' : '스위프트 배우기', 
    'tags' : ['programming', 'javascript'],
    'status' : 'todo',
    'id' : 12123123
  },
  {
    'name' : '리엑트 공부하기', 
    'tags' : ['programming', 'javascript'],
    'status' : 'todo',
    'id' : 12123123
  },
  {
    'name' : '운동하기', 
    'tags' : ['programming', 'javascript'],
    'status' : 'done',
    'id' : 12123123
  },
  {
    'name' : '독서하기', 
    'tags' : ['programming', 'javascript'],
    'status' : 'done',
    'id' : 12123123
  },
  {
    'name' : '금연하기', 
    'tags' : ['programming', 'javascript'],
    'status' : 'doing',
    'id' : 12123123
  },
  {
    'name' : '알고리즘풀기', 
    'tags' : ['programming', 'javascript'],
    'status' : 'todo',
    'id' : 12123123
  }
]

const show = (objStr) => {
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

show('all')
show('todo')
show('doing')
show('done')