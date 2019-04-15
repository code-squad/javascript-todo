const todos = [
    {
        'name': '자바스크립트 공부하기',
        'tags': ['programming', 'javascript'],
        'status': 'todo',
        'id': 12123123
    },
    {
        'name': '그림 그리기',
        'tags': ['picture', 'favorite'],
        'status': 'doing',
        'id': 312323
    },
    {
        'name': '라면 끓여먹기',
        'tags': ['food', 'favorite'],
        'status': 'doing',
        'id': 1541515132
    },
    {
        'name': '칼퇴하기',
        'tags': ['wolibal', 'favorite'],
        'status': 'todo',
        'id': 15132213251
    },
    {
        'name': '알고리즘풀기',
        'tags': ['study', 'hell'],
        'status': 'done',
        'id': 123123312323
    },
    {
        'name': '운동하기',
        'tags': ['workout', 'hell'],
        'status': 'todo',
        'id': 3121234323
    }
];
const show = (status) => {
    
    const count = () => {
        const arr = [0,0,0];

        todos.forEach(function (element) {
            if (element.status === 'todo') {
                arr[0]++;
            } else if (element.status === 'doing') {
                arr[1]++;
            } else if (element.status === 'done') {
                arr[2]++;
            }
        });
        return arr;
    }

    const getNames = (status) => {
        const namesArr = [];
        todos.forEach(
            function (element) {
                if (status === element.status) namesArr.push(element.name);
            }
        );
        return namesArr;
    }

    const printAll = (countArr) => {
        console.log(`현재상태 : todo : ${countArr[0]}개, doing : ${countArr[1]}, done : ${countArr[2]}`);
    }

    const printList = (namesArr, status) => {
        let resultStr =  `${status} 리스트 : 총 ${namesArr.length}건 : `
        namesArr.forEach(function (element, index) {
            resultStr += `'${element}'`
            if (index < namesArr.length - 1) {
                resultStr += `, `
            }
        })
        console.log(resultStr);
    }


    if (status === 'all') {
        const countArr = count();
        printAll(countArr);
    } else if (status === 'doing' || status === 'done' || status === 'todo') {
        const namesArr = getNames(status);
        printList(namesArr, status);
    } else {
        console.log(`show 의 인자는 doing ,todo, done, all 만 가능합니다.`);
        return;
    }
}



show('all');
show('todo');
show('doing');
show('done');
show('too');