module.exports = class Validator {
    constructor(data, order) {
        this._data = data;
        this.dollor = order.match(/\$/g);
        this.appWord = order.match(/[a-z]*(?=\$)/);
        this.status = order.match(/(?<=\$)[a-z]*$/);
        this.id = order.match(/(?<=\$)\d*/);
        this.tag = order.match(/(?<=\[\")\w*(?=\"\])/);
    }

    dollors() {
        console.log('명령어를 $로 구분해주세요.')
        return true;
    }

    appWords(){
        console.log('잘못된 appWords 입니다.')
        return true;
    }

    tags(){
        if(!this.tag){
            console.log('가능한 tag가 아닙니다.');
            return true
        }
        return false;
    }

    ids(){
        if(!this._data.some((el) => el['id'] === Number(this.id[0]))) {
            console.log('존재하지 않는 id입니다.');
            return true;
        }
        return false;
    }

    statuses(){
        const statusList = ['all', 'todo', 'doing','done'];
        if(statusList.indexOf(this.status[0]) === -1) {
            console.log('잘못된 status입니다.');
            return true;
        }
        return false;
    }

    excute() {
        if(!this.dollor){
            return this.dollors();
        }else if (this.appWord[0] === 'show') {
            return this.statuses();
        } else if (this.appWord[0] === 'add') {
            return this.tags();
        } else if (this.appWord[0] === 'delete') {
            return this.ids();
        } else if (this.appWord[0] === 'update') {
            return this.ids() || this.statuses();
        } else {
            return this.appWords();
        }
    }
}