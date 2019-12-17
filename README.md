我的笔记整理，请参考：

[前端进阶必知必会](https://iloveyou11.github.io/2019/11/14/%E5%89%8D%E7%AB%AF%E8%BF%9B%E9%98%B6%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/)

[源码解析系列](https://note.youdao.com/ynoteshare1/index.html?id=24e9d3cdd8febbf4104baf0601aaf444&type=note)

电子书请参考：
[Vue.js 技术揭秘](https://ustbhuangyi.github.io/vue-analysis/)

学习视频，请参考：
[vue源码分析-极光学苑](https://www.bilibili.com/video/av75366883?p=16)

#### 各个文件夹的作用
1. compiler：编译
  - vue使用字符串作为模板
  - 在编译文件夹中存放对模板字符串的解析算法、AST、优化等
2. core：核心（重要！！！）
  - vue构造函数
  - 生命周期等方法
3. platforms：平台
  - 针对运行的环境（设备）有不同的实现
  - 也是vue的入口
4. server：服务端
5. sfc：单文件组件
6. share：公共工具/方法