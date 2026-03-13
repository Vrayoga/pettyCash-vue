import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/views/adm-card/MasterKartu.vue'
import AddKartu from '@/views/adm-card/AddKartu.vue'
import EditKartu from '@/views/adm-card/EditKartu.vue'
import EditLimitSaldo from '@/views/adm-card/EditLimitSaldo.vue'
import InputPettyCash from '@/views/adm-petty/InputPettyCash.vue'

const routes = [
    {
      path: '/',
      name: 'Base',
      component: Index
    },
    {
      path: '/petty-cash',
      name: 'InputPettyCash',
      component: InputPettyCash
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