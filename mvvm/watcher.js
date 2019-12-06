// 观察者，给需要变化的dom元素增加观察者
// 用新值和旧值进行比对，如果发生变化，执行对应的方法

class Watcher {
    constructor(vm, expr, cb) {
        this.vm = vm
        this.expr = expr
        this.cb = cb

        this.value = this.get()
    }

    // 获取实例上对应的数据，如msg.a.b=>'hello'
    getVal(vm, expr) {
        expr = expr.split('.')
        return expr.reduce((prev, next) => {
            return prev[next]
        }, vm.$data)
    }

    get() {
        Dep.target = this
        let value = this.getVal(this.vm, this.expr)
        Dep.target = null
        return value
    }

    // 对外暴露的方法
    update() {
        let newVal = this.getVal(this.vm, this.expr)
        let oldVal = this.value
        if (newVal !== oldVal) {
            this.cb(newVal)
        }
    }
}

// 发布订阅
class Dep {
    constructor() {
        // 订阅数组
        this.subs = []
    }

    // 添加订阅
    addSub(watcher) {
        this.subs.push(watcher)
    }

    notify() {
        this.subs.forEach(watcher => {
            watcher.update()
        })
    }
}