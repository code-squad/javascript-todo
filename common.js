var common = (function () {
    var STATUS_CONSTANT = {
        "todo": 0,
        "doing": 1,
        "done": 2
    };
    var messages = {
        add: function (id, title) {
            console.log("id: " + id + ", " + title + " 항목이 새로 추가됐습니다.");
        },
        showOne: function (id, title, runtime) {
            var result = "id: " + id + ", title: " + title;
            if (runtime)
                result += ", runtime: " + runtime;
            console.log(result);
        },
        showAll: function (statusCount) {
            var [todo, doing, done] = statusCount;
            console.log("현재상태 :  todo:" + todo + "개, doing:" + doing + "개, done:" + done + "개");
        },
        showShort: function (short) {
            console.log(short);
        }
    };

    return {
        STATUS_CONSTANT,
        messages
    };
})();



module.exports = common;