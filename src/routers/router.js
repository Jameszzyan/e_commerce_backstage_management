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
          name: 'users',
          path: 'users/users',
          component: () => import('../views/users.vue')
        },
        {
          name: 'roles',
          path: 'rights/roles',
          component: () => import('../views/roles.vue')
        },
        {
          name: 'rights',
          path: 'rights/rights',
          component: () => import('../views/rights.vue')
        },
        {
          name: 'goods',
          path: 'goods/goods',
          component: () => import('../views/goods.vue'),
          redirect: { name: 'goods_list' },
          children: [
            {
              name: 'goods_list',
              path: 'list',
              component: () => import('../views/goods_list.vue')
            },
            {
              name: 'goods_add',
              path: 'add',
              component: () => import('../views/goods_add.vue')
            },
            {
              name: 'goods_edit',
              path: 'edit',
              component: () => import('../views/goods_add.vue')
            }
          ]
        },
        {
          name: 'charts',
          path: 'reports/reports',
          component: () => import('../views/charts.vue')
        }
      ]
    }
  ]
})

// 导航守卫，保证只有对应的用户能够取到数据
router.beforeEach((to, from, next) => {
  var token = sessionStorage.getItem('token')
  store.dispatch('token/storeTokenCommit', token)
  if (store.state.token.token || to.path === '/login') {
    next()
  } else {
    next({
      name: 'login'
    })
  }
})

export default router
