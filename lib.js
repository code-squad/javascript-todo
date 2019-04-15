// curry
const curry = f =>
    (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._)

// map
const map = curry((f, iter) => {
    let new_arr = []
    for (let el of iter) {
        new_arr.push(f(el))
    }
    return new_arr
})

// filter
const filter = curry((f, iter) => {
    let res = []
    for (const a of iter) {
        if (f(a)) res.push(a)
    }
    return res
})

// reduce
const reduce = (iter, f, acc) => {
    if (!acc) {
        iter = iter[Symbol.iterator]()
        acc = iter.next().value
    }
    for (const a of iter) {
        acc = f(acc, a)
    }
    return acc
}

const go = (...args) => reduce(args, (a, f) => f(a))

const pipe = function () {
    var fns = arguments
    return function (arg) {
        return _reduce(fns, function (arg, fn) {
            return fn(arg)
        }, arg)
    }
}

const count = (iter) => iter.length

const join = curry((str, iter) => iter.join(str))

const concat = curry((origin, stringN) => origin.concat(stringN))

module.exports = {
    map,
    filter,
    reduce,
    go,
    pipe,
    count,
    join,
    concat
}
