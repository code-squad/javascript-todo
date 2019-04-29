const Utils  = class {

	getArrByCondition (arr, condition) {
        return arr.reduce((acc, val) => {
            if (condition(val)) acc.push(val);
            return acc;
        }, []);
    }	

    getRandomId (max, min) {
        return Math.floor(Math.random() * (max-min)) + 1;
    }

    delay (time) {
		return new Promise(function(resolve, reject){
			setTimeout(resolve, time);
		});
    }
    
    deepCopy (obj) {
        if (obj === null || typeof(obj) !== "object") return obj;
       
        let copy = {};
        for(let key in obj) {
          copy[key] = this.deepCopy(obj[key]);
        }
        return copy;
    }
};

module.exports = Utils;