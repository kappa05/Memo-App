import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const routes = [
  {
    path: '/',
    redirect: '/memos'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/memos',
    name: 'MemoList',
    component: () => import('../views/MemoList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/memos/new',
    name: 'MemoCreate',
    component: () => import('../views/MemoEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/memos/:id',
    name: 'MemoDetail',
    component: () => import('../views/MemoDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/memos/:id/edit',
    name: 'MemoEdit',
    component: () => import('../views/MemoEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/categories',
    name: 'CategoryList',
    component: () => import('../views/CategoryList.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isLoggedIn = store.getters['auth/isLoggedIn']

  if (requiresAuth && !isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && isLoggedIn) {
    next('/memos')
  } else {
    next()
  }
})

export default router 