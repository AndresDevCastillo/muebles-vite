const menu = [{
  cargo: 'Admin',
  menu: [{
    icon: 'mdi mdi-tag-plus',
    title: 'Ventas',
    href: '/inicio/ventas'
  },
  {
    icon: 'mdi mdi-cash',
    title: 'Cobro',
    href: '/inicio/cobro'
  },
  {
    icon: 'mdi mdi-table-furniture',
    title: 'Productos',
    href: '/inicio/productos'
  },
  {
    icon: 'mdi mdi-map-search',
    title: 'Rutas',
    href: '/inicio/rutas'
  }, {
    icon: 'mdi mdi-account-tie',
    title: 'Empleados',
    href: '/inicio/empleados'
  },
  {
    icon: 'mdi mdi-account-group',
    title: 'Clientes',
    href: '/inicio/clientes'
  },
  {
    icon: 'mdi mdi-store-edit',
    title: 'Inventario',
    href: '/inicio/inventario'
  },
  {
    icon: 'mdi mdi-chart-bar',
    title: 'Estadisticas',
    href: '/inicio/estadisticas'
  },
  ]
},
{
  cargo: 'Cobrador',
  menu: [{
    icon: 'mdi mdi-cash',
    title: 'Cobro',
    href: '/inicio/cobro'
  }
  ]
},
]

export default menu;
