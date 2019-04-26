class Log {
  constructor(){
    this.queue = [],
    this.index = -1
  }


  push(stinrg action, obj prevdata, obj nextData){
    if queue.length >4){
      shift();
    }
    queue.push(action, prevData, nextData)
    index = queue.length-1
  }

  shift(){
    queue.shift()
  }

  undo(){
    if( index < 0)
    error 되돌릴수 없습니다


    index -> queue{ 
      action
      prevData
      nextData
    }

    prevData -> todolist 
    
    //delete일때
    console.log( id, name, nextstatus, prevstatus)
    
    index --;

  }

  redo(){
    if index >= length-1
    error redo 할수 없습니다

    index++
    
    nextData -> todolist
    console.log( id, name, prevData , nextData);


  }


  
}
