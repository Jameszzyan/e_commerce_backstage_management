import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store.js'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: { name: 'login' }
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('../views/login.vue')
    },
    {
      name: 'home',
      path: '/home',
      component: () => import('../views/home.vue'),
      redirect: { name: 'welcome' },
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: () => import('../views/welcome.vue')
        },
        {
          name: 'user_list',
          path: 'user_list',
          component: () => import('../views/user_list.vue')
        },
        {
          name: 'role_list',
          path: 'role_list',
          component: () => import('../views/role_list.vue')
        },
        {
          name: 'right_list',
          path: 'right_list',
          component: () => import('../views/right_list.vue')
        }
      ]
    }
  ]
})

// 导航守卫，保证只有对应的用户能够取到数据
router.beforeEach((to, from, next) => {
  if (store.state.token.token || sessionStorage.getItem('token') || to.path === '/login') {
    next()
  } else {
    next({
      name: 'login'
    })
  }
})

export default router
