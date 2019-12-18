import {
    getTag,
    isSymbol,
    isError,
    baseToNumber,
    baseToString,
    createMathOperation,
    isObjectLike
} from './utils'

// 创建加法函数
export const add = createMathOperation((augend, addend) => augend + addend, 0)

// Creates a function that invokes `func`, with the `this` binding and arguments of the created function, while it's called less than `n` times.
export function before(n, func) {
    let result
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function')
    }
    return function(...args) {
        if (--n > 0) {
            result = func.apply(this, args)
        }
        if (n <= 1) {
            func = undefined
        }
        return result
    }
}


// This method creates a function that invokes `func` once it's called `n` or more times.
export function after(n, func) {
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function')
    }
    n = n || 0
    return function(...args) {
        if (--n < 1) {
            return func.apply(this, args)
        }
    }
}

// Creates an array of values corresponding to `paths` of `object`.
// const object = { 'a': [{ 'b': { 'c': 3 } }, 4] }
// at(object, ['a[0].b.c', 'a[1]'])
// => [3, 4]
// 这里要好好看看
export const at = (object, ...paths) => baseAt(object, baseFlatten(paths, 1))

// Attempts to invoke `func`, returning either the result or the caught error object. Any additional arguments are provided to `func` when it's invoked.
export function attempt(func, ...args) {
    try {
        return func(...args)
    } catch (e) {
        return isError(e) ? e : new Error(e)
    }
}

// 规范化为驼峰形式，去掉空格、_、-等符号
// 这个不太会。。。
// camelCase('Foo Bar')=> 'fooBar'
// camelCase('--foo-bar--')=> 'fooBar'
// camelCase('__FOO_BAR__')=> 'fooBar'

// const camelCase = (string) => {
//   const reg = /[\s|\-|\_]/g
//   string = string.replace(reg, '')
//   return string
// }
// console.log(camelCase('Foo Bar'));
// console.log(camelCase('--foo-bar--'));
// console.log(camelCase('__FOO_BAR__'));

// Converts the first character of `string` to upper case and the remaining to lower case.
export const capitalize = (string) => upperFirst(toString(string).toLowerCase())

// 转化为数组
/**
 * castArray(1)
 * // => [1]
 *
 * castArray({ 'a': 1 })
 * // => [{ 'a': 1 }]
 *
 * castArray('abc')
 * // => ['abc']
 *
 * castArray(null)
 * // => [null]
 *
 * castArray(undefined)
 * // => [undefined]
 *
 * castArray()
 * // => []
 */
function castArray(...args) {
    if (!args.length) {
        return []
    }
    const value = args[0]
    return Array.isArray(value) ? value : [value]
}


// Computes `number` rounded up to `precision`
export const ceil = createRound('ceil')

/**
 * Creates an array of elements split into groups the length of 
 * chunk(['a', 'b', 'c', 'd'], 2)
 * // => [['a', 'b'], ['c', 'd']]
 * chunk(['a', 'b', 'c', 'd'], 3)
 * // => [['a', 'b', 'c'], ['d']]
 */
export function chunk(array, size = 1) {
    size = Math.max(toInteger(size), 0)
    const length = array == null ? 0 : array.length
    if (!length || size < 1) {
        return []
    }
    let index = 0
    let resIndex = 0
    const result = new Array(Math.ceil(length / size))

    while (index < length) {
        result[resIndex++] = slice(array, index, (index += size))
    }
    return result
}
/**
 * Clamps `number` within the inclusive `lower` and `upper` bounds.
 * clamp(-10, -5, 5)
 * // => -5
 * clamp(10, -5, 5)
 * // => 5
 */
export function clamp(number, lower, upper) {
    number = +number
    lower = +lower
    upper = +upper
    lower = lower === lower ? lower : 0
    upper = upper === upper ? upper : 0
    if (number === number) {
        number = number <= upper ? number : upper
        number = number >= lower ? number : lower
    }
    return number
}
/**
 * Creates an array with all falsey values removed. The values `false`, `null`,
 * `0`, `""`, `undefined`, and `NaN` are falsey.
 * compact([0, 1, false, 2, '', 3])
 * // => [1, 2, 3]
 */
export function compact(array) {
    let resIndex = 0
    const result = []
    if (array == null) {
        return result
    }
    for (const value of array) {
        if (value) {
            result[resIndex++] = value
        }
    }
    return result
}
// Creates an object that inherits from the `prototype` object.
export function create(prototype, properties) {
    prototype = prototype === null ? null : Object(prototype)
    const result = Object.create(prototype)
    return properties == null ? result : Object.assign(result, properties)
}
// Defers invoking the `func` until the current call stack has cleared
// defer(text => console.log(text), 'deferred')
// => Logs 'deferred' after one millisecond.
function defer(func, ...args) {
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function')
    }
    return setTimeout(func, 1, ...args)
}
// Invokes `func` after `wait` milliseconds.
// delay(text => console.log(text), 1000, 'later')
// => Logs 'later' after one second.
function delay(func, wait, ...args) {
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function')
    }
    return setTimeout(func, +wait || 0, ...args)
}