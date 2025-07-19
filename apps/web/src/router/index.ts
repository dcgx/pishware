import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: {
        title: 'Dashboard',
      },
    },
    {
      path: '/campaigns',
      name: 'campaigns',
      component: () => import('../views/Campaigns.vue'),
      meta: {
        title: 'Campañas',
      },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/Users.vue'),
      meta: {
        title: 'Usuarios y grupos',
      },
    },
    {
      path: '/templates',
      name: 'templates',
      component: () => import('../views/Templates.vue'),
      meta: {
        title: 'Plantillas',
      },
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/Reports.vue'),
      meta: {
        title: 'Reportes',
      },
    },
    {
      path: '/configuration',
      name: 'configuration',
      component: () => import('../views/Configuration.vue'),
      meta: {
        title: 'Configuración',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },

    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Iniciar sesión',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Registrarse',
      },
    },
    {
      path: '/reset',
      name: 'Reset',
      component: () => import('../views/Auth/Reset.vue'),
      meta: {
        title: 'Recuperar contraseña',
      },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Pishware`
  next()
})
