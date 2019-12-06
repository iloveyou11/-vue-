class MVVM {
    constructor(options) {
        // 先把可用的东西挂载到实例上
        this.$el = options.el
        this.$data = options.data

        // 如果有要编译的模板就开始编译
        if (this.$el) {
            // 数据劫持，把对象的所有属性改为get、set
            new Observer(this.$data)
            this.proxyData(this.$data)
                // 用数据和元素进行编译
            new Compile(this.$el, this)
        }
    }

    // 代理数据，因为用户可能要通过this.msg取值，而不是this.$data.msg取值
    proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                get() {
                    return data[key]
                },
                set(newVal) {
                    data[key] = newVal
                }
            })
        })
    }
}