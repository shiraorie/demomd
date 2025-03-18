import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: () => import('@/components/Main.vue') },
        { path: '/editor', component: () => import('@/components/Editor.vue') }
    ]
})

export default router


