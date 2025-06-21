import { createRouter, createWebHistory } from 'vue-router'

import OficinasView from '../views/OficinasView.vue'
import AlunosView from '../views/AlunosView.vue'
import ConsultaView from '../views/ConsultaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    {
      path: '/',
      name: 'home',
      component: OficinasView,
    },
    {
      path: '/alunos',
      name: 'alunos',
      component: AlunosView,
    },
    {
      path: '/consulta',
      name: 'consulta',
      component: ConsultaView,
    },
  ],
})

export default router
