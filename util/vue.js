// 判断是否为undefined或null
export function isUndefined() {
    return v === undefined || v == null // return v == null
}

// 判断是否defined
export function isDefined() {
    return v !== undefined && v !== null
}

// 判断为true
export function isTrue() {
    return v === true
}

// 判断为false
export function isFalse() {
    return v === false
}

// 判断是否为原始值类型
export function isPrimitive(value) {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'symbol' ||
        typeof value === 'boolean'
    )
}

// 判断是否为对象（广义）
export function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}

// Object原型上的toString方法可以精准判断类型
// 如Number、String、Undefined、Null、Boolean、Object、Function、RegExp、Array
const _toString = Object.prototype.toString

// console.log(Object.prototype.toString.call(123)); //[object Number]
// console.log(Object.prototype.toString.call('123')); //[object String]
// console.log(Object.prototype.toString.call(undefined)); //[object Undefined]
// console.log(Object.prototype.toString.call(true)); //[object Boolean]
// console.log(Object.prototype.toString.call({})); //[object Object]
// console.log(Object.prototype.toString.call([])); //[object Array]
// console.log(Object.prototype.toString.call(function() {})); //[object Function]
// console.log(Object.prototype.toString.call(null)); //[[object Null]]
// console.log(Object.prototype.toString.call(/hello/g)); //[[C RegExp]]

// 获取精准类型 [object ...]
export function getRawType(value) {
    return _toString.call(value).slice(8, -1) //截取到的是[object ...]中的类型...
}

// 判断是否为js的原始类型
export function isPlainObject(obj) {
    return _toString.call(obj) === ['object Object']
}
// 判断是否为正则表达式
export function isRegExp(obj) {
    return _toString.call(obj) === ['object RegExp']
}
// 判断是否是合法的数组下标
export function isValidArrayIndex(index) {
    const n = parseFloat(String(index))
    return n >= 0 && Math.floor(n) === n && isFinite(n)
}
// 判断是否为promise
export function isPromise(value) {
    return (
        isDefined(value) &&
        typeof value.then === 'function' &&
        typeof value.catch === 'function'
    )
}

// 统一转化为字符串
// 这里需要注意：值类型是调用的String方法，对象是调用的Object.prototype.toString()方法，这里需要判断后进行处理
export function toString(value) {
    return value == null ? '' : (
        (Array.isArray(value) || isPlainObject(value) && value.toString === _toString) ? JSON.stringify(value, null, 2) : String(value)
    )
}

// 转化为数字
export function toNumber(value) {
    const n = parseFloat(value)
    return isNaN(n) ? value : n
}

// 生成一个带有缓存的函数，用于判断数据是否是缓存中的数据，例如判断字符串（标签名）是否为内置的HTML标签

export function makeMap(str, expectsLowerCase) {
    const map = Object.create(null)
    const list = str.split(',')
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true
    }
    // 例如： 传入的是str = 'slot,component'，则map ={ slot: true, component: true }
    return expectsLowerCase ?
        val => map[val.toLowerCase()] :
        val => map[val]
}

// 判断是否是vue内置标签
export const isBuiltInTag = makeMap('slot,component', true)

// 判断是否是vue特有属性
export const isReservedAttribute = makeMap('key,ref,slot,slot-scope,is')

// 删除数组元素
export function remove(arr, item) {
    if (arr.length) {
        const idx = arr.indexOf(item)
        if (idx > -1) return arr.splice(idx, 1)
    }
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key)
}

// 生成带有缓存的函数，常用于闭包
export function cached(fn) {
    const cache = Object.create(null)
    return (
        function cachedFn(str) {
            const hit = cache[str]
            return hit || (cache[hit] = fn(str)) // 如果有缓存，返回；如果没有缓存，则创建缓存并返回
        }
    )
}

// 将连字符分隔的字符串转化为驼峰，如'i-love-you'--->'iLoveYou'
const camelizeRE = /-(\w)/g
export const camelize = cached(str => {
    // _是完整匹配内容，如'-y',c是分组匹配内容，如'y'
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})

// 将首字母大写 'dfrf'--->'Dfrf'
export const capitalize = cached(str => {
    return str.charAt(0).toUpperCase() + str.slice(1)
})

// 将驼峰形式转化为连字分隔符形式，如'iLoveYou'--->'i-love-you'
const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cached(str => {
    return str.replace(hyphenateRE, (_, c) => c ? `-${c.toLowerCase()}` : '')
})

// 实现extend方法
export function extend(to, _from) {
    for (const key in _from) {
        to[key] = _from[key]
    }
    return to
}
export function toObject(arr) {
    const res = {}
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]) {
            extend(res, arr[i])
        }
    }
    return res
}

// 比较两个对象是否相等（如果对象各个属性值相等，那么对象就是相等的）
// 1、假定对象a和b
// 2、遍历a中成员，判断是否每个a中成员都在b中，并且与b中成员相等
// 3、再遍历b中成员都在a中，并且与a中成员相等
// 4、如果成员是引用类型，采用递归

// 这里还未考虑正则和函数
export function looseEqual(a, b) {
    if (a === b) return true
    const isObjectA = isObject(a)
    const isObjectB = isObject(b)
    if (isObjectA && isObjectB) {
        try {
            const isArrayA = Array.isArray(a)
            const isArrayB = Array.isArray(b)
            if (isArrayA && isArrayB) {
                // 都是数组
                // 证明b包含a，这里有长度相同的条件，因此不用再反过来判断了
                return a.length === b.length && a.every((e, i) => {
                    return looseEqual(e, b[i])
                })
            } else if (a instanceof Date && b instanceof Date) {
                // 时间戳是一样的
                return a.getTime() === b.getTime()
            } else if (!isArrayA && !isArrayB) {
                // 都是对象
                const keysA = Object.keys(a)
                const keysB = Object.keys(b)
                return keysA.length === keysB.length && keysA.every(key => {
                    return looseEqual(a[key], b[key])
                })
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    } else if (!isObjectA && !isObjectB) {
        return String(a) === String(b)
    } else {
        return false
    }
}

// 让一个函数只允许调用一次，采用闭包实现，存储是否已经调用过了
// 在vue中有个函数（once事件就是这个思路）
export function once(fn) {
    let called = false
    return function() {
        if (!called) {
            called = true
            fn.apply(this, arguments)
        }
    }
}

// 数组去重
export function uniArr(arr) {
    let _set = {}
    arr.forEach(v => _set[v] || (_set[v] = true))
    return Object.keys(_set)
}

// 数组去重
export function uniArr(arr) {
    let _set = {}
    arr.forEach(v => _set[v] || (_set[v] = true))
    return Object.keys(_set)
}