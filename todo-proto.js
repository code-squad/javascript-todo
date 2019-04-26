const todoError = require('./todo-error')
const errorCheck = new todoError();

class TodoMain {
    constructor() {
        this.data = [];
        this.deletedData = [];
    }
       
    checkInput(input, inputReadline) {
        const [action, ...restInput] = input.split(',');
        const that = this;
        try {
            errorCheck.printError(input, that);
            if(action === 'show') {
                this.showItem(...restInput, inputReadline);
                return
            }
            if(action === 'undo' || action === 'redo') {
                this.sortItem2(action, inputReadline);
                return
            }
            const updatedList = this.sortItem(action, restInput, inputReadline);
            this.printUpdate({action, updatedList, inputReadline, showAllMsgTimeout: 1000, updateMsgTimeout: 3000})
        } catch (e) {
            console.log(e.message);
            inputReadline.prompt();
        } 
    }

    sortItem(action, restInput) {
        const obj = {
            "add" : "addItem",
            "delete" : "deleteItem",
            "update" : "updateItem",
        }
    
        return this[obj[action]](...restInput);
    }

    sortItem2(action, inputReadline) {
        const obj = {
            "redo" : "reDo",
            "undo" : "unDo"
        }
        return this[obj[action]](inputReadline);
    }
    
    addItem(name, tag) {
        const id = this.createId(name)
        let newTodo = {
            name,
            tag,
            status : "todo",
            id
        }
        this.data.push(newTodo);
        return newTodo;
     }

    createId(inputString) {
        let hashNumber = 0;
        for( let i=0; i < inputString.length ; i++) {
            hashNumber += inputString.charCodeAt(i);
        };
        return hashNumber;
    };
     
    checkID(id) {
        const matchedListById = this.data.filter(list => {
            return list.id === id
        })
        return matchedListById
    }
    
    deleteItem(id) {
        const validId = parseInt(id);
        const [matchedListById] = this.checkID(validId);
        const matchedIndex = this.data.indexOf(matchedListById);
        const [deletedList] = this.data.splice(matchedIndex, 1);
        deletedList.wasDeleted = true;
        this.deletedData.push(deletedList);
        this.setDeletedList ();
        return matchedListById;
     }
    
    updateItem(id, inputStatus) {
        const validId = parseInt(id);
        const [matchedListById] = this.checkID(validId);
        // 같은 상태로 업데이트 하려고 할때( ex. 이미 doing 상태인데 다시 doing으로 바꾸려고 할때)
        const matchedIndex = this.data.indexOf(matchedListById);
        this.data[matchedIndex].status = inputStatus
        return matchedListById;
     }
    
    showItem(status, inputReadline) {
        status === 'all' ? this.showAll(inputReadline) : this.showTodo(status, inputReadline)
    }
    
    showAll(inputReadline) {
        let allList = {
            'todo' : [],
            'doing' : [],
            'done' : []
        };

        this.data.reduce( (acc, cur) => {
            acc[cur['status']].push(cur);
            return acc;
        }, allList)

        console.log(`현재상태 : todo: ${allList.todo.length}개, doing: ${allList.doing.length}, done: ${allList.done.length}`);
        inputReadline.prompt();
    }
    
    showTodo(status, inputReadline) {
        const result = this.data.filter(v => v.status === status).map(v => v.name);
        console.log(`${status}리스트 :  총 ${result.length} 건 : ${result}`);
        inputReadline.prompt();
    }
    
    printUpdate(params) {
        const {action, updatedList, inputReadline, showAllMsgTimeout, updateMsgTimeout} = params;
        if (action === "update") {
            setTimeout(() => {
                console.log(`${updatedList.name} ${updatedList.status}으로 상태가 변경되었습니다.`)
                setTimeout(() => {
                    this.showItem('all', inputReadline);
                }, showAllMsgTimeout);
            }, updateMsgTimeout);
            return
        }
    
        if (action === "add") {
            console.log(`${updatedList.name} 1개가 추가됐습니다. (id : ${updatedList.id})`);
        }
        
        if (action === "delete") {
            console.log(`${updatedList.name} ${updatedList.status}가 목록에서 삭제됐습니다.`);
        }
    
    setTimeout(() => {
        this.showItem('all', inputReadline);
    }, showAllMsgTimeout);   
    }

    setDeletedList () {
        if( this.deletedData.length <= 3) {
            return 
        }
        if( this.deletedData.length > 3 ) {
            this.deletedData.shift();
            setDeletedList();
        } 
    }

    unDo (inputReadline) {
        const that = this;
        errorCheck.deletedItemCheck(that);
        const undoItem = this.deletedData.pop();
        console.log(undoItem, this.deletedData);
        this.data.push(undoItem);
        console.log(`${undoItem.id}번항목 ${undoItem.name}가 삭제에서 ${undoItem.status}상태로 변경되었습니다.`);
        inputReadline.prompt();
    }
    
    reDo (inputReadline) {
        const that = this;
        errorCheck.wasdeletedItemCheck(that);
        const redoItem = this.data.pop();
        this.deletedData.push(redoItem);
        console.log(`${redoItem.id}번항목 ${redoItem.name}가 ${redoItem.status}상태에서 삭제되었습니다.`);
        inputReadline.prompt();
    }

}    




module.exports = TodoMain;
    
    
    
 // Test Case:
 // add,sleep,['very urgent']
 // update,537,done
 // show,done
 // show,all
 // delete,537
