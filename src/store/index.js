import Vue from 'vue'
import Vuex from 'vuex'

// 开发环境下引入执行（打包时注释掉）
// import dev_env from "@/mock/dev.env.window.js";


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // pageUrl: dev_env.pageUrl
    pageUrl: window.pageUrl
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
