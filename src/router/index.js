import Vue from 'vue'
import Router from 'vue-router'

// 直接载入主js文件（容易体积大）
// import page1 from '@/views/page1.vue';
// 根据页面地址按需加载
const page1 = () => import( '@/views/page1.vue' );
const page2 = () => import( '@/views/page2.vue' );
const page3 = () => import( '@/views/page3.vue' );
// 按需加载（一系列归为一组同时加载进来）
// const page1 = () => import( /* webpackChunkName: "page" */ '@/views/page1.vue' );
// const page2 = () => import( /* webpackChunkName: "page" */ '@/views/page2.vue' );
// const page3 = () => import( /* webpackChunkName: "page" */ '@/views/page3.vue' );

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'page1',
    title: '页面一',
    component: page1,
    meta: {
      title: '智慧西青生态环境大数据指挥平台'
    }
  },
  {
    path: '/page1',
    name: 'page1',
    title: '页面一',
    component: page1,
    meta: {
      title: '智慧西青生态环境大数据指挥平台'
    }
  },
  {
    path: '/page2',
    name: 'page2',
    title: '页面二',
    component: page2,
    meta: {
      title: '智慧西青大气环境监控'
    }
  },
  {
    path: '/page3',
    name: 'page3',
    title: '页面三',
    component: page3,
    meta: {
      title: '智慧西青水环境监控'
    }
  },
  {
    path: '*',
    name: 'noFound',
    title: '未找到',
    meta: {
      title: '未找到，跳转中...'
    },
    redirect: {
      name: 'page1'
    }
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new Router({
  // mode: 'hash',  //hash模式（#abc）    history模式（/abc————需要服务器做响应配置）
  // base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
      document.title = to.meta.title || '666'
  }
  next()
})

export default router
