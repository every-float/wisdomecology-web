import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'

// webpack创建一个以svg目录为上下文的require函数
const req = require.context('./svg', false, /\.svg$/)
// keys()会获取所有svg文件
req.keys().map(req);

// 像这种常用的组件就注册在全局，就不用每次使用的时候都引入一下
Vue.component('svg-icon', SvgIcon)