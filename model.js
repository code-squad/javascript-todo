next_id = 1;
task_list = [];

let show_current_status = function() {
    let counts = {
        todo: 0,
        doing: 0,
        done: 0
    }

    task_list.forEach((task) => {
        let status = task.status;
        counts[status]++;
    });

    console.log(`현재상태 : todo:${counts.todo}개, doing:${counts.doing}개, done:${counts.done}개`);
}

exports.show = function (status) {
    let tasks = task_list.filter((task) => task.status === status);

    if (tasks.length === 0) {
        throw `${status}상태의 task가 존재하지 않습니다.`;
    } else if (status === 'done'){
        //완료 시간 계산
        tasks.forEach((task) => {
            let time_diff = null;

            if (task.start_at === undefined) {
                time_diff = task.done_at - task.created_at;
            } else {
                time_diff = task.done_at - task.start_at;
            }

            let task_clear_time = Math.floor(time_diff / 1000 / 60 / 60);

            console.log(`${task.id}, ${task.content}, ${task_clear_time}시간`);
        });
    } else {
        tasks.forEach((task) => console.log(`${task.id}, ${task.content}`));
    }
};
exports.add = function (content) {
    let new_task = {
        id: next_id++,
        status: 'todo',
        content: content,
        created_at: new Date()
    }

    task_list.push(new_task);

    console.log(`id: ${new_task.id},  "${new_task.content}" 항목이 새로 추가됐습니다.`);
    show_current_status();
};

exports.update = function (id, status) {
    id = parseInt(id);
    let target_task = task_list.find((task) => task.id === id);

    if (target_task === undefined) {
        throw `id가 ${id}인 task가 존재하지 않습니다.`;
    } else if (target_task.status === status) {
        throw `해당하는 task가 이미 ${status}상태입니다.`;
    } else {
        //상태 변경
        target_task.status = status;

        //작업 시작/완료시각 저장
        if (status === 'doing') {
            target_task.start_at = new Date();
        } else if (status === 'done') {
            target_task.done_at = new Date();
        }

        //3초 후에 결과 출력
        setTimeout(show_current_status, 3000);
    }
};
