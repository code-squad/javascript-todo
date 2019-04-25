function Utils () {
	
}

Utils.prototype = {
	
    getArrByCondition : (arr, condition) => {
        return arr.reduce((acc, val) => {
            if (condition(val)) acc.push(val);
            return acc;
        }, []);
    },	
};

module.exports = Utils;