//todos.js
const originData = require('./todosList.json');
const convertedData = JSON.parse(JSON.stringify(originData)).data;
const idGenerator = () => Math.floor(Math.random() * (99999)) + 1;

const getArrByCondition = (arr, condition) => {
    return arr.reduce((acc, val) => {
        if (condition(val)) acc.push(val);
        return acc;
    }, []);
};

const showStatusLazy = () => {
    setTimeout(() => {
        showData('all');
    }, 1000);
}

const isDuplicated = (val, key, convertedData) => {
    let result = false;
    convertedData.forEach((element) => {
        if (val == element[key]) result = true;
    })
    return result;
}

const showData = (type) => {
    if (type == 'all') {
        const numOfTodos = getArrByCondition(convertedData, (val) => {return val.status == "todo"}).length;
        const numOfDoings = getArrByCondition(convertedData, (val) => {return val.status == "doing"}).length;
        const numOfDones = getArrByCondition(convertedData, (val) => {return val.status == "done"}).length;

        console.log(`현재상태 : todo: ${numOfTodos}개, doing: ${numOfDoings}개, done: ${numOfDones}개`);

    } else {
        const objArr = getArrByCondition(convertedData, (val) => {return (type == val.status)});
        let result = `${type} 리스트 : 총${objArr.length}건 :`;
        getArrByCondition(objArr, (val) => {result += `, '${val.name}, ${val.id}번'`; return true});
        console.log(`${result}`);
    }
}

const addData = (name, tags) => {
    const id = idGenerator();

    if (isDuplicated(id, "id", convertedData)) {
        return addData(name, tags);
    }

    let obj = {
        name, 
        tags, 
        status: 'todo', 
        id,
    };

    convertedData.push(obj);
    console.log(`${obj.name} 1개가 추가됐습니다.(id : ${obj.id})`);
    showStatusLazy();
}

const deleteData = (id)=> { 
    const target = getArrByCondition(convertedData, (val) => {return val.id == id})[0];
    if (!target) {console.log('일치하는 id가 없습니다'); return;}

    convertedData.splice(convertedData.indexOf(target), 1);
    console.log(`${target.name} ${target.status}가 목록에서 삭제됐습니다.`);
    showStatusLazy();
};

const updateData = (id, status)=> {
    const target = getArrByCondition(convertedData, (val) => {return val.id == id})[0];
    if (!target) {console.log('일치하는 id가 없습니다'); return;}

    target.status = status;

    setTimeout(() => {
        console.log(`${target.name}가 ${status}로 상태가 변경되었습니다`);
        showStatusLazy();
    }, 3000);
}

module.exports = {
    "show" : showData,
	"add" : addData,
	"update" : updateData,
	"delete" : deleteData,
};