import {
    createElement,
    render,
    renderDOM
} from './element'
import diff from './diff'
import patch from './patch'


let virtualDOM1 = createElement('ul', {
    class: 'list'
}, [
    createElement('li', {
        class: 'item'
    }, ['a']),
    createElement('li', {
        class: 'item'
    }, ['b']),
    createElement('li', {
        class: 'item'
    }, ['c'])
])
let virtualDOM2 = createElement('ul', {
    class: 'list-group'
}, [
    createElement('li', {
        class: 'item'
    }, ['1']),
    createElement('li', {
        class: 'item'
    }, ['2']),
    createElement('div', {
        class: 'item'
    }, ['c'])
])


let el = render(virtualDOM)
renderDOM(el, window.root)

// dom diff
// 根据两个虚拟dom创建出补丁, 描述改变的内容, 将这个补丁用来更新dom

// dom diff几种优化策略
// 1. 更新时只比较同级,并不会跨层比较
// 2. 同层变化能复用,使用key

// 给元素打补丁，重新更新视图
let patches = diff(virtualDOM1, virtualDOM2)
patch(el, patches)

// 此时的dom diff策略还存在很多问题：
// 1. 如果同级只是交换节点位置，会导致重新渲染（应该只是交换位置）
// 2. 新增节点也不会被更新