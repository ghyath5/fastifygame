import { createRouter, createWebHistory } from 'vue-router'
import FastifyView from '../views/Fastify.vue'
import ColorifyView from '../views/Colorify.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/fastify',
      name: 'Fastify',
      component: FastifyView
    },
    {
      path: '/colorify',
      name: 'Colorify',
      component: ColorifyView
    }
  ]
})

export default router
