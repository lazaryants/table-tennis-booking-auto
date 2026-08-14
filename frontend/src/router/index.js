import {createRouter, createWebHistory} from 'vue-router'
import store from "@/store"
import TimeLapse from "@/views/TimeLapse";
import {error} from "@/utils/error";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: TimeLapse,
        meta: {
            layout: 'main',
            auth: true
        }
    },
    {
        path: '/auth',
        name: 'Auth',
        component: () => import('../views/Auth.vue'),
        meta: {
            layout: 'auth',
            auth: false
        }
    },
    {
        path: '/userinfo',
        name: 'UserInfo',
        component: () => import('../views/UserInfo.vue'),
        meta: {
            layout: 'main',
            auth: true
        }
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: () => import('../views/SignUp.vue'),
        meta: {
            layout: 'auth',
            auth: false
        }
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('../views/Admin.vue'),
        meta: {
            layout: 'main',
            auth: true,
            admin: true
        }
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    linkActiveClass: 'active',
    linkExactActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
    const requireAuth = to.meta.auth
    const requireAdmin = to.meta.admin

    if (requireAdmin) {
        if (store.getters['auth/username'] === 'admin') {
            next()
        } else {
            next('/')
        }
    } else {
        if (requireAuth && store.getters['auth/isAuthenticated']) {
            next()
        } else if (requireAuth && !store.getters['auth/isAuthenticated']) {
            next('/auth?message=auth')
        } else {
            next()
        }
    }

})

export default router
