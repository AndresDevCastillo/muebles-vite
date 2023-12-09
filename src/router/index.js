// Composables
import { createRouter, createWebHistory } from 'vue-router'
import store from '../store';

const routes = [{
  path: '/',
  name: 'login',
  component: () =>
    import('@/components/login.vue'),
  beforeEnter: (to, from, next) => {
    const data = store.getters.usuario;
    let ruta;
    if (data.usuario) {
      if (to.fullPath == "/") {
        switch (data.usuario.rol) {
          case 'Admin':
            ruta = '/inicio/estadisticas';
            break;
          case 'Cobrador':
            ruta = '/inicio/cobro';
            break;
        }
      }
      return next(ruta);
    }
    next();
  }
},
{
  path: '/inicio',
  name: 'inicio',
  component: () =>
    import('@/views/inicio.vue'),
  children: [{
    path: '/inicio/ventas',
    name: 'ventas',
    component: () =>
      import('@/views/prestamoView.vue'),
    beforeEnter: (to, from, next) => {
      const data = store.getters.usuario;
      if (data.usuario) {
        const cargo = data.usuario.rol.toLowerCase();
        if (cargo == undefined) {
          return next(from);
        }
        return next();
      }
      next('/');
    }
  },
  {
    path: '/inicio/empleados',
    name: 'empleados',
    component: () =>
      import('@/views/empleadosView.vue'),
    beforeEnter: (to, from, next) => {
      const data = store.getters.usuario;
      if (data.usuario) {
        const cargo = data.usuario.rol.toLowerCase();
        if (cargo == "cobrador" || cargo == undefined) {
          return next(from);
        }
        return next();
      }
      next('/');
    }
  },
  {
    path: '/inicio/estadisticas',
    name: 'estadisticas',
    component: () =>
      import('@/views/estadisticasView.vue'),
    beforeEnter: (to, from, next) => {
      const data = store.getters.usuario;
      if (data.usuario) {
        const cargo = data.usuario.rol.toLowerCase();
        if (cargo == "cobrador" || cargo == undefined) {
          return next(from);
        }
        return next();
      }
      next('/');
    }
  },
  {
    path: '/inicio/rutas',
    name: 'rutas',
    component: () =>
      import('@/views/puebloView.vue'),
    beforeEnter: (to, from, next) => {
      const data = store.getters.usuario;
      if (data.usuario) {
        const cargo = data.usuario.rol.toLowerCase();
        if (cargo == undefined) {
          return next(from);
        }
        return next();
      }
      next('/');
    }
  },
  {
    path: '/inicio/inventario',
    name: 'inventario',
    component: () =>
      import('@/views/inventarioView.vue'),
    beforeEnter: (to, from, next) => {
      const data = store.getters.usuario;
      if (data.usuario) {
        const cargo = data.usuario.rol.toLowerCase();
        if (cargo == "cobrador" || cargo == undefined) {
          return next(from);
        }
        return next();
      }
      next('/');
    }
  },
  {
    path: '/inicio/productos',
    name: 'productosVista',
    component: () =>
      import('@/views/productosView.vue'),
    beforeEnter: (to, from, next) => {
      const data = store.getters.usuario;
      if (data.usuario) {
        const cargo = data.usuario.rol.toLowerCase();
        if (cargo == undefined) {
          return next(from);
        }
        return next();
      }
      next('/');
    }
  }, {
    path: '/inicio/clientes',
    name: 'clienteVista',
    component: () =>
      import('@/views/clienteView.vue'),
    beforeEnter: (to, from, next) => {
      const data = store.getters.usuario;
      if (data.usuario) {
        const cargo = data.usuario.rol.toLowerCase();
        if (cargo == "cobrador" || cargo == undefined) {
          return next(from);
        }
        return next();
      }
      next('/');
    }
  },
  {
    path: '/inicio/cobro',
    name: 'cobroVista',
    component: () =>
      import('@/views/cobroView.vue'),
    beforeEnter: (to, from, next) => {
      const data = store.getters.usuario;
      if (data.usuario) {
        const cargo = data.usuario.rol.toLowerCase();
        if (cargo == undefined) {
          return next(from);
        }
        return next();
      }
      next('/');
    }
  }
  ],
},

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
