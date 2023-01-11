import { createRouter, createWebHistory } from 'vue-router'
import FastifyView from '../views/Fastify.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/fastify',
      name: 'fastify',
      component: FastifyView
    }
  ]
})

export default router
