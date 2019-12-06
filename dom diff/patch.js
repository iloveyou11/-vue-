import {
    Element,
    render,
    setAttr
} from './element'

let allPatches
let index = 0

const ATTRS = 'ATTRS'
const REMOVE = 'REMOVE'
const REPLACE = 'REPLACE'
const TEXT = 'TEXT'

function patch(node, patches) {
    // 给元素打补丁
    allPatches = patches
    walk(node)
}

function walk(node) {
    let currentPatch = allPatches[index++]
    let childNodes = node.childNodes
    childNodes.forEach(child => {
        walk(child)
    });
    if (currentPatch) {
        doPatch(node, currentPatch)
    }
}

function doPatch(node, patches) {
    patches.forEach(patch => {
        switch (patch.type) {
            case ATTRS:
                for (const key in patch.attrs) {
                    let value = patch.attrs[key]
                        //  如果属性值为undefined则直接删除属性
                    if (value) {
                        setAttr(node, key, value)
                    } else {
                        node.removeAttribute(key)
                    }

                }
                break
            case REMOVE:
                node.parentNode.removeChild(node)
                break
            case REPLACE:
                let newNode = patch.newNode instanceof Element ? render(patch.newNode) : document.createTextNode(patch.newNode)
                node.parentNode.replaceChild(newNode, node)
                break
            case TEXT:
                node.textContent = patch.text
                break
        }
    });
}

export default patch