var util = {

    cmdChecker: function (cmd) {
        var state = ["todo", "doing", "done"];
        if (cmd[1] === undefined || cmd[1] === '') {
            console.log("인자갯수 부족!");
            return false;
        }
        else if (cmd[0] === "show") {
            if (state.indexOf(cmd[1]) === -1) {
                console.log("잘못된 상태값 : ", cmd[1]);
                return false;
            }
        }
        else if (cmd[0] === "update") {
            if (cmd[1] == null) {//흠
                console.log("없는 id : ", cmd[1]);
                return false;
            }
            else if (state.indexOf(cmd[2]) === -1) {
                console.log("잘못된 상태값 : ", cmd[2]);
                return false;
            }
        }
        return true;
    },
}
module.exports = util;