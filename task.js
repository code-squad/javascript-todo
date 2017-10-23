var statusConstant = require('./common').statusConstant;

var getTimeDiff = (function() {
    var postfixes = ['년', '개월', '주', '일', '시간', '분', '초'];
    var functions = [
        function getDiffYears(start, end) {
            var start = new Date(start);
            var end = new Date(end);

            start.setFullYear(start.getFullYear() + 1);

            var timeStart = start.getTime();
            var timeEnd = end.getTime();

            if ((timeEnd - timeStart) < 0) {
              return 0;
            } else {
              return getDiffYears(start, end) + 1;
            }
        },
        function getDiffMonths(start, end) {
            var start = new Date(start);
            var end = new Date(end);

            start.setMonth(end.getMonth() + 1);

            var timeStart = start.getTime();
            var timeEnd = end.getTime();

            if ((timeEnd - timeStart) < 0) {
              return 0;
            } else {
              return getDiffMonths(start, end) + 1;
            }
        },
        function getDiffWeeks(start, end) {
            var timeStart = start.getTime();
            var timeEnd = end.getTime();

            return parseInt((timeEnd - timeStart) / (1000 * 60 * 60 * 24 * 7));
        },
        function getDiffDays(start, end) {
            var timeStart = start.getTime();
            var timeEnd = end.getTime();

            return parseInt((timeEnd - timeStart) / (1000 * 60 * 60 * 24));
        },
        function getDiffHours(start, end) {
            var timeStart = start.getTime();
            var timeEnd = end.getTime();

            return parseInt((timeEnd - timeStart) / (1000 * 60 * 60));
        },
        function getDiffMinutes(start, end) {
            var timeStart = start.getTime();
            var timeEnd = end.getTime();

            return parseInt((timeEnd - timeStart) / (1000 * 60));
        },
        function getDiffSeconds(start, end) {
            var timeStart = start.getTime();
            var timeEnd = end.getTime();

            return parseInt((timeEnd - timeStart) / (1000));
        }
    ];

    return function (start, end) {
        for (var i = 0; i < functions.length; i++) {
            var getDiff = functions[i];
            var diff = getDiff(start, end);

            if (diff > 0) {
                return String(diff) + postfixes[i];
            }
        }
    }
})();

function Task(content) {
    this.id = this.getNextId();
    this.status = statusConstant.TODO;
    this.content = content;
    this.createdAt = new Date();
    this.startAt;
    this.doneAt;
    this.timeSpent;
}

Task.prototype.getNextId = (function () {
    var id = 0;

    return function () {
        return id++;
    }
})();

Task.prototype.updateStatus = function(change) {
    this.status = change;
    //작업 시작/완료시각 저장
    switch (change) {
        case statusConstant.DOING:
            this.startAt = new Date();
            break;

        case statusConstant.DONE:
            this.doneAt = new Date();

            this.timeSpent = (this.startAt) ?
                getTimeDiff(this.startAt, this.doneAt) :
                getTimeDiff(this.createdAt, this.doneAt);
            break;
    }
};

module.exports = Task;
