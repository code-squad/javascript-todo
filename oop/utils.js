module.exports = class Utils {
    constructor(data, order) {
        this._data = data;
        this.dollor = order.match(/\$/g);
        this.appWord = order.match(/[a-z]*(?=\$)/);
        this.status = order.match(/(?<=show\$)[a-z]*$/);
        this.id = order.match(/(?<=\$)\d*/);
        this.tag = order.match(/(?<=\[\")\w*(?=\"\])/);
    }
    dollors() {
        if(!this.dollor) {throw new Error('$가 없습니다.')}
        return true
    }
    appWords(){
        const appWordList = ['show', 'add', 'delete', 'update'];
        if(appWordList.indexOf(this.appWord[0]) === -1) {
            console.log('잘못된 appWord입니다.')
            return false
        }
        return true
    }
    tags(){
        if(this.tag[0]){
            console.log('가능한 tag가 아닙니다.')
            return false
        }
        return true
    }
    ids(){
        if(!this._data.some((el) => el['id'] === this.id[0])) {
            console.log('존재하지 않는 id입니다.')
            return false
        }
        return true
    }
    statuses(){
        const statusList = ['all', 'todo', 'doing','done'];
        if(statusList.indexOf(this.status[0]) === -1) {
            console.log('잘못된 status입니다.')
            return false
        }
        return true
    }
    validator() {
        this.dollors();
        if(!this.appWords()) {
            console.log('sdfsadf') 
            return false
        }

        if(this.appWord[0] === 'show'){
            if(!this.statuses()) return false;
        }else if(this.appWord[0] === 'add'){
            if(!this.tags()) return false;
        }else if(this.appWord[0] === 'delete'){
            if(!this.ids()) return false;
        }else if(this.appWord[0] === 'update') {
            if(!this.ids()) return false;
            if(!this.statuses()) return false;
        }
    }
}


// const validator = new Validator(todosData,'delete$7788');
// console.log(validator.checkValidTag());