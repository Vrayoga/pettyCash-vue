import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/views/MasterKartu.vue'
import AddKartu from '@/views/AddKartu.vue'
import EditKartu from '@/views/EditKartu.vue'
import EditLimitSaldo from '@/views/EditLimitSaldo.vue'

const routes = [
    {
      path: '/',
      name: 'Base',
      component: Index
    },
    {
      path: '/master-kartu/add',
      name: 'AddKartu',
      component: AddKartu,
      props: (route) => ({
        titleProject: 'Tambah Kartu',
        user: route.query.user
      })
    },
    {
      path: '/master-kartu/edit/:id',
      name: 'EditKartu',
      component: EditKartu,
      props: (route) => ({
        titleProject: 'Edit Kartu',
        id: route.params.id,
        user: route.query.user
      })
    },
    {
      path: '/master-kartu/edit-limit/:id',
      name: 'EditLimitSaldo',
      component: EditLimitSaldo,
      props: (route) => ({
        titleProject: 'Edit Limit Saldo',
        id: route.params.id,
        user: route.query.user
      })
    }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL_APP),
  routes
})

export default router