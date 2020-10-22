window.xinlaoluId = "4e4860553999471883954ecde87d540c";    //辛老路id统一管理

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { 
  Container,
  Header,
  Main,
  Carousel,
  CarouselItem,
  Calendar,
  Tabs,
  TabPane,
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import setRem from '@/utils/setRem';
import '@/icons';
import '@/assets/css/base.scss';
import '@/assets/css/cusAnimate.css';
import echarts from 'echarts';

setRem();

Vue.config.productionTip = false;

Vue.prototype.$echarts = echarts;

// 按需引入elementui时，传入一个全局配置对象，以设置组件的默认尺寸
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };
// Vue.use(ElementUI);  //这样是将elementui全部引入
// 为了减小最终项目的体积，可以按需引入组件
  // Vue.component('el-container', Container)
// 也可以这样引入
Vue.use(Container);
Vue.use(Header);
Vue.use(Main);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Calendar);
Vue.use(Tabs);
Vue.use(TabPane);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
