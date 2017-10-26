var getTimeDiff = (function() {
    var diffCases = [
         {
            postfix: '년',
            getDiff: function getDiff(start, end) {
                var start = new Date(start);
                var end = new Date(end);

                start.setFullYear(start.getFullYear() + 1);

                var timeStart = start.getTime();
                var timeEnd = end.getTime();

                if ((timeEnd - timeStart) < 0) {
                  return 0;
                }

                return getDiff(start, end) + 1;
            }
         },
         {
            postfix: '개월',
            getDiff: function getDiff(start, end) {
                var start = new Date(start);
                var end = new Date(end);

                start.setFullYear(start.getFullYear() + 1);

                var timeStart = start.getTime();
                var timeEnd = end.getTime();

                if ((timeEnd - timeStart) < 0) {
                  return 0;
                }

                return getDiff(start, end) + 1;
            }
         },
         {
            postfix: '주',
            getDiff: function(start, end) {
                var timeStart = start.getTime();
                var timeEnd = end.getTime();

                return parseInt((timeEnd - timeStart) / (1000 * 60 * 60 * 24 * 7));
            }
         },
         {
            postfix: '일',
            getDiff: function(start, end) {
                var timeStart = start.getTime();
                var timeEnd = end.getTime();

                return parseInt((timeEnd - timeStart) / (1000 * 60 * 60 * 24));
            }
         },
         {
            postfix: '시간',
            getDiff: function(start, end) {
                var timeStart = start.getTime();
                var timeEnd = end.getTime();

                return parseInt((timeEnd - timeStart) / (1000 * 60 * 60));
            }
         },
         {
            postfix: '분',
            getDiff: function(start, end) {
                var timeStart = start.getTime();
                var timeEnd = end.getTime();

                return parseInt((timeEnd - timeStart) / (1000 * 60));
            }
         },
         {
            postfix: '초',
            getDiff: function(start, end) {
                var timeStart = start.getTime();
                var timeEnd = end.getTime();

                return parseInt((timeEnd - timeStart) / 1000);
            }
         }
    ];

    return function (start, end) {
        for (var i = 0; i < diffCases.length; i++) {
            var thisCase = diffCases[i];
            var diff = thisCase.getDiff(start, end);

            if (diff > 0) {
                return String(diff) + thisCase.postfix;
            }
        }
    }
})();

var polyfill = {
  findIndex: function(arr, callback) {
    var i = 0, len = arr.length;

      for (; i < len; i++) {
        var item = arr[i];

        if (callback(item, i, arr)) {
          return i;
        }
      }

    return -1;
  }
};

module.exports.getTimeDiff = getTimeDiff;
module.exports.polyfill = polyfill;
