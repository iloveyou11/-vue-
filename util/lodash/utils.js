// 使用Object.prototype.toString()方法获取js原始类型
const toString = Object.prototype.toString

export function getTag(value) {
    if (value == null) {
        return value === undefined ? '[object Undefined]' : '[object Null]'
    }
    return toString.call(value)
}

// 判断是否为Symbol类型
export function isSymbol(value) {
    const type = typeof value
    return type == 'symbol' || (type === 'object' && value != null && getTag(value) == '[object Symbol]')
}

// 转化为数字
export function baseToNumber(value) {
    if (typeof value === 'number') {
        return value
    }
    if (isSymbol(value)) {
        return NAN
    }
    return +value
}
// 转化为字符串
const symbolToString = Symbol.prototype.toString
const INFINITY = 1 / 0

export function baseToString(value) {
    if (typeof value === 'string') {
        return value
    }
    if (Array.isArray(value)) {
        return `${value.map(baseToString)}`
    }
    if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : ''
    }
    const result = `${value}`
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result
}

// 创建运算函数
export function createMathOperation(operator, defaultValue) {
    return (value, other) => {
        if (value === undefined && other === undefined) {
            return defaultValue
        }
        if (value !== undefined && other === undefined) {
            return value
        }
        if (other !== undefined && value === undefined) {
            return other
        }
        if (typeof value === 'string' || typeof other === 'string') {
            value = baseToString(value)
            other = baseToString(other)
        } else {
            value = baseToNumber(value)
            other = baseToNumber(other)
        }
        return operator(value, other)
    }
}

export function isObjectLike(value) {
    return typeof value === 'object' && value !== null
}

export function isError(value) {
    if (!isObjectLike(value)) {
        return false
    }
    const tag = getTag(value)
    return tag == '[object Error]' || tag == '[object DOMException]' ||
        (typeof value.message === 'string' && typeof value.name === 'string' && !isPlainObject(value))
}

export const upperFirst = str => {
    return str[0].toUpperCase() + str.slice(1)
}

export function createRound(methodName) {
    const func = Math[methodName]
    return (number, precision) => {
        precision = precision == null ? 0 : (precision >= 0 ? Math.min(precision, 292) : Math.max(precision, -292))
        if (precision) {
            let pair = `${number}e`.split('e')
            const value = func(`${pair[0]}e${+pair[1] + precision}`)
            pair = `${value}e`.split('e')
            return +`${pair[0]}e${+pair[1] - precision}`
        }
        return func(number)
    }
}

export function slice(array, start, end) {
    let length = array == null ? 0 : array.length
    if (!length) {
        return []
    }
    start = start == null ? 0 : start
    end = end === undefined ? length : end

    if (start < 0) {
        start = -start > length ? 0 : (length + start)
    }
    end = end > length ? length : end
    if (end < 0) {
        end += length
    }
    length = start > end ? 0 : ((end - start) >>> 0)
    start >>>= 0

    let index = -1
    const result = new Array(length)
    while (++index < length) {
        result[index] = array[index + start]
    }
    return result
}

const MAX_INTEGER = 1.7976931348623157e+308
export function toFinite(value) {
    if (!value) {
        return value === 0 ? value : 0
    }
    // value = toNumber(value)
    value = Number(value) //这里我就简单用Number()直接转化
    if (value === INFINITY || value === -INFINITY) {
        const sign = (value < 0 ? -1 : 1)
        return sign * MAX_INTEGER
    }
    return value === value ? value : 0
}

export function toInteger(value) {
    const result = toFinite(value)
    const remainder = result % 1
    return remainder ? result - remainder : result
}