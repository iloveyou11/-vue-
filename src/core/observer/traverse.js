/* @flow */

import {
    _Set as Set,
    isObject
} from '../util/index'
import type {
    SimpleSet
} from '../util/index'
import VNode from '../vdom/vnode'

const seenObjects = new Set()

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
export function traverse(val: any) {
    _traverse(val, seenObjects)
    seenObjects.clear()
}

function _traverse(val: any, seen: SimpleSet) {
    let i, keys
    const isA = Array.isArray(val)
    if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
        // 如果数据不是响应式的，不需要递归判断
        return
    }
    // __ob__表示这个对象是响应式对象
    if (val.__ob__) {
        const depId = val.__ob__.dep.id
            // 保证了循环引用不会递归遍历
        if (seen.has(depId)) {
            return
        }
        seen.add(depId)
    }
    if (isA) {
        i = val.length
        while (i--) _traverse(val[i], seen) //对每个数组项递归访问
    } else {
        keys = Object.keys(val)
        i = keys.length
        while (i--) _traverse(val[keys[i]], seen) //对每个属性递归访问
    }
}