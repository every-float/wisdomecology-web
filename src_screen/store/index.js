// vux的逻辑应该是这样的：状态管理器中的状态，在别的地方访问和修改是有规则的
// 获取：store.state
// 修改：commit('mutation')，mutation是定义在vuex中的，用法: store.commit('mutation', {params})
// 异步情况下需要得到结果才修改状态：dispatch('action'), action是定义在vuex中的，用法：store.dispatch('action', {params})，然后在异步得到结果后执行commit(mutation)修改状态

import Vue from 'vue'
import Vuex from 'vuex'
import userinfo from './user/userinfo';
import page1 from './page1/index';
import page2 from './page2/index';
import page3 from './page3/index';

console.log(Vue.xinlaoluId);

Vue.use(Vuex);

export default new Vuex.Store({
  state: {   
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    userinfo,
    page1,
    page2,
    page3,
  }
})
