import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
import Roles from '../components/roles/Roles.vue'
import Rights from '../components/roles/Rights.vue'
import Categories from '../components/goods/Categories.vue'
import Params from '../components/goods/Params.vue'
import Goods from '../components/goods/Goods.vue'
import GoodsAdd from '../components/goods/GoodsAdd.vue'
import Order from '../components/order/Order.vue'
import Report from '../components/report/Report.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/roles', component: Roles },
        { path: '/rights', component: Rights },
        { path: '/categories', component: Categories },
        { path: '/params', component: Params },
        { path: '/goods', component: Goods },
        { path: '/goods/add', component: GoodsAdd },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }

      ]
    }
  ]
})
// 挂载拦截守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径 from 代表从哪个路径跳转而来 next（）放行 next('/login) 强制跳转
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})
export default router
