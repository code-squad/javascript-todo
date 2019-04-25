function Utils () {
	
}

Utils.prototype = {
	
    getArrByCondition : (arr, condition) => {
        return arr.reduce((acc, val) => {
            if (condition(val)) acc.push(val);
            return acc;
        }, []);
    },	

    getRadomId : (max, min) => {
        Math.floor(Math.random() * (max-min)) + 1;
    },

    delay : (time) => {
		return new Promise(function(resolve, reject){
			setTimeout(resolve, time);
		});
	},
};

module.exports = Utils;