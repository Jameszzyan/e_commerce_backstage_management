import Vue from 'vue'
import Router from 'vue-router'

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
      component: () => import('../views/home.vue')
    }
  ]
})

export default router
