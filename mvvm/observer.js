class Observer {
    constructor(data) {
        this.observe(data)
    }

    // 将data数据原有的属性改为get和set的形式
    observe(data) {
        if (!data || typeof data !== 'object') return
        Object.keys(data).forEach(key => {
            // 开始劫持
            this.defineReactive(data, key, data[key])
                // 如果劫持的是对象，还要对对象内的属性继续劫持
            this.observe(data[key])
        })
    }

    // 定义响应式
    defineReactive(data, key, value) {
        let _this = this
        let dep = new Dep() //每个变化的数据都会对应一个数组，这个数组是存放所有更新的操作
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get() {
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set(newValue) {
                if (newValue !== value) {
                    // 设置新值时，如果是对象仍然需要劫持
                    _this.observe(newValue)
                    value = newValue
                    dep.notify() //通知所有订阅者数据变化了
                }
            }
        })
    }
}