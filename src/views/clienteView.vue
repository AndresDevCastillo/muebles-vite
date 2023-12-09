<template>
  <div class="cliente">
    <v-card class="ma-3">
      <v-card-title>
        <v-row class="my-4" justify-sm="start" justify="space-between">
          <v-col lg="3" md="4" sm="12" cols="auto">
            <v-row class="align-center" no-gutters>
              <v-icon size="x-large" icon="mdi mdi-account-group-outline"></v-icon>
              <h1 class="px-3">Clientes</h1>
            </v-row>
          </v-col>
          <v-col lg="6" md="5" sm="12" cols="auto" class="align-self-end text-sm-start text-md-end text-lg-end">
            <v-btn prepend-icon="mdi mdi-file-upload" color="yellow" @click="dialogArchivo = true;">Subir archivo</v-btn>
          </v-col>
          <v-col lg="3" md="3" sm="12" cols="auto" class="align-self-end text-sm-start">
            <v-btn prepend-icon="mdi-plus" color="green" @click="dialogCliente = true;">Agregar cliente</v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-title>
        <v-col md="6" sm="12">
          <v-text-field v-model="searchCliente" append-inner-icon="mdi-magnify" label="Buscar" variant="outlined"
            hide-details>
          </v-text-field>
        </v-col>
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="clientes" :sort-by="[{ key: 'nombres', order: 'asc' }]"
          class="elevation-1" :search="searchCliente">
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.actions="{ item }">
            <v-icon size="small" class="me-2" @click="verClienteFunction(Object.assign({}, item))">
              mdi-information-outline
            </v-icon>
            <v-icon size="small" class="me-2" @click="preEditarCliente(Object.assign({}, item))">
              mdi-pencil
            </v-icon>
            <v-icon size="small" @click="eliminarCliente(item._id)">
              mdi-delete
            </v-icon>

          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <nuevoCliente :dialogCliente="dialogCliente" @cerrarDialog="dialogCliente = false" @actualizarTodo="actualizarTodo" />
    <v-dialog v-model="dialogClienteEditar" persistent width="700">
      <v-card>
        <v-card-title>Editar Cliente</v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="formClienteEditar">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Documento" type="number" min="1" required hint="Sin comas o puntos (, .)"
                    persistent-hint variant="outlined" v-model="formClienteEditar.documento"
                    :rules="numberRules"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="Nombres" type="text" required variant="outlined"
                    v-model="formClienteEditar.nombres" :rules="nombreRules"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="Apellidos" type="text" required variant="outlined"
                    v-model="formClienteEditar.apellidos" :rules="nombreRules"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="Telefono" type="text" required variant="outlined"
                    v-model="formClienteEditar.telefono" :rules="nombreRules"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="Correo" type="text" required variant="outlined" v-model="formClienteEditar.correo"
                    :rules="nombreRules"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete :items="rutas" variant="outlined" label="Ruta" required
                    v-model="formClienteEditar.direccion" item-title="nombre" item-value="_id"
                    :rules="[v => !!v || 'Seleccione una ruta']" no-data-text="No hay rutas"></v-autocomplete>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red-darken-1" variant="tonal" @click="dialogClienteEditar = false">
            Cerrar
          </v-btn>
          <v-btn color="blue-darken-1" variant="tonal" :disabled="disableBtn" @click="editarCliente()">
            Editar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogClienteVer" persistent width="700">
      <v-card>
        <v-card-text>
          <v-container>
            <v-form>
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Documento" type="number" min="1" required hint="Sin comas o puntos (, .)"
                    persistent-hint variant="outlined" v-model="verCliente.documento" disabled></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="Nombres" type="text" required variant="outlined" v-model="verCliente.nombres"
                    disabled></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="Apellidos" type="text" required variant="outlined" v-model="verCliente.apellidos"
                    disabled></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="Telefono" type="text" required variant="outlined" v-model="verCliente.telefono"
                    disabled></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="Correo" type="text" required variant="outlined" v-model="verCliente.correo"
                    disabled></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field variant="outlined" label="Ruta" required v-model="verCliente.direccion.nombre"
                    disabled></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field variant="outlined" label="Departamento" required
                    v-model="verCliente.direccion.departamento" disabled></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field variant="outlined" label="Ciudad" required v-model="verCliente.direccion.ciudad"
                    disabled></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field variant="outlined" label="Frecuencia de pago" required
                    v-model="verCliente.direccion.opcRuta" disabled></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" v-if="verCliente.direccion.opcRuta == 'Semanal'">
                  <v-text-field variant="outlined" label="Día" required disabled
                    v-model="verCliente.direccion.semanal"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" v-if="verCliente.direccion.opcRuta == 'Quincenal'">
                  <v-text-field variant="outlined" label="Día" required disabled
                    v-model="verCliente.direccion.quincenal.dia"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" v-if="verCliente.direccion.opcRuta == 'Quincenal'">
                  <v-text-field variant="outlined" label="Semana 1" required disabled
                    v-model="verCliente.direccion.quincenal.semanas[0]"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" v-if="verCliente.direccion.opcRuta == 'Quincenal'">
                  <v-text-field variant="outlined" label="Semana 2" required disabled
                    v-model="verCliente.direccion.quincenal.semanas[1]"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" v-if="verCliente.direccion.opcRuta == 'Mensual'">
                  <v-text-field variant="outlined" label="Día" required disabled
                    v-model="verCliente.direccion.mensual.dia"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" v-if="verCliente.direccion.opcRuta == 'Mensual'">
                  <v-text-field variant="outlined" label="Semana" required disabled
                    v-model="verCliente.direccion.mensual.semanas"></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red-darken-1" variant="tonal" @click="dialogClienteVer = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogArchivo" persistent width="700">
      <v-card>
        <v-card-title>
          Subir múltiples clientes
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="formExcel">
              <v-row>
                <v-col cols="12">
                  <v-file-input v-model="archivoClientes" label="Archivo Excel" hint="El archivo debe ser .xls o .xlsx"
                    persistent-hint append-inner-icon="mdi mdi-microsoft-excel" prepend-icon="" outlined
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    :rules="campoRules">
                  </v-file-input>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red-darken-1" variant="tonal" @click="dialogArchivo = false">
            Cerrar
          </v-btn>
          <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtnArchivo" @click="subirExcel">
            Subir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import Session from '@/validation/session';
import nuevoCliente from '@/components/nuevoCliente.vue';
export default {
  name: 'clienteVista',
  components: { nuevoCliente },
  data: () => ({
    dialogArchivo: false,
    archivoClientes: null,
    disableBtnArchivo: false,
    dialogCliente: false,
    dialogClienteEditar: null,
    dialogClienteVer: null,
    disableBtn: false,
    clientes: [],
    rutas: [],
    productos: [],
    formaPago: null,
    api: import.meta.env.VITE_APP_API_URL,
    token: null,
    searchCliente: null,
    headers: [
      { title: 'Documento', key: 'documento', sortable: false },
      { title: 'Nombre', key: 'nombres' },
      { title: 'Apellido', key: 'apellidos' },
      { title: 'Telefono', key: 'telefono' },
      { title: 'Ruta', key: 'direccion.nombre' },
      { title: 'Accion', key: 'actions', sortable: false },
    ],
    formClienteEditar: {
      id: null,
      documento: null,
      nombres: null,
      apellidos: null,
      telefono: null,
      correo: null,
      direccion: null
    },
    formasPago: [{ index: 1, forma: 'De contado' }, { index: 2, forma: 'A crédito' }],
    verCliente: null,
    nombreRules: [
      v => !!v || 'El campo es requerido',
      v => (v && v.length <= 65) || 'El campo no puede superar los 65 caracteres',
    ],
    campoRules: [v => !!v || 'Campo requerido',],
    cantidadRules: [
      v => !!v || 'Campo requerido',
      v => parseInt(v) > 0 || 'Ingrese una cantidad mayor a 0'
    ],
    numberRules: [v => !!v || 'El precio es requerido', v => (v && /^[0-9]+$/.test(v)) || 'El numero no debe contener caracteres'],

  }),
  methods: {
    async getProductosInventario() {
      await axios.get(`${this.api}/inventario/existe`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(resp => {
        this.productos = resp.data;
      }).catch(error => {
        switch (error.response.status) {
          case 401:
            Session.expiredSession();
            break;
          default:
            Swal.fire({
              icon: 'info',
              text: 'No se pudo obtener los productos',
              showConfirmButton: false,
              timer: 1600
            });
            break;
        }
      });
    },
    async obtenerClientes() {
      await axios.get(`${this.api}/cliente`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((resp) => {
        this.clientes = resp.data;
      }).catch(error => {
        switch (error.response.status) {
          case 401:
            Session.expiredSession();
            break;
          default:
            Swal.fire({
              icon: 'info',
              text: 'No se pudo obtener los departamentos',
              showConfirmButton: false,
              timer: 1600
            });
            break;
        }
      });
    },
    async obtenerRutas() {
      await axios.get(`${this.api}/pueblo`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((resp) => {
        this.rutas = resp.data;
      }).catch(error => {
        switch (error.response.status) {
          case 401:
            Session.expiredSession();
            break;
          default:
            Swal.fire({
              icon: 'info',
              text: 'No se pudo obtener las rutas',
              showConfirmButton: false,
              timer: 1600
            });
            break;
        }
      });
    },
    async eliminarCliente(id) {
      Swal.fire({
        icon: 'info',
        title: 'Seguro quiere eliminar el cliente?',
        showDenyButton: true,
        denyButtonText: 'No',
        confirmButtonText: 'Eliminar',
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          await axios.delete(`${this.api}/cliente/${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).then(() => {
            this.obtenerClientes();
            Swal.fire({ icon: 'success', title: 'Se elimino correctamente', timer: 1500, showConfirmButton: false });
          })
        }
      }).catch(error => {
        switch (error.response.status) {
          case 401:
            Session.expiredSession();
            break;
          default:
            Swal.fire({
              icon: 'info',
              text: 'No se pudo eliminar el cliente',
              showConfirmButton: false,
              timer: 1600
            });
            break;
        }
      });
    },
    preEditarCliente(item) {
      this.formClienteEditar = item;
      this.formClienteEditar.id = item._id;
      delete this.formClienteEditar._id;
      this.formClienteEditar.direccion = item.direccion._id;
      this.dialogClienteEditar = true;
    },
    async editarCliente() {
      const { valid } = await this.$refs.formClienteEditar.validate();
      if (valid) {
        this.disableBtn = true;
        this.dialogClienteEditar = false;
        this.formClienteEditar.documento = parseInt(this.formClienteEditar.documento);
        await axios.put(`${this.api}/cliente/actualizar`, this.formClienteEditar, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }).then(() => {
          this.formClienteEditar = {
            documento: null,
            nombres: null,
            apellidos: null,
            telefono: null,
            correo: null,
            direccion: null
          }
          return Swal.fire({ icon: 'success', title: 'Se edito el cliente correctamente', showConfirmButton: false, timer: 1500 });
        }).catch(error => {
          switch (error.response.status) {
            case 401:
              Session.expiredSession();
              break;
            default:
              Swal.fire({
                icon: 'info',
                text: 'No se pudo editar el cliente',
                showConfirmButton: false,
                timer: 1600
              });
              break;
          }
        });
        await this.obtenerClientes();
        this.disableBtn = false;
      }
    },
    async subirExcel() {
      const { valid } = await this.$refs.formExcel.validate();
      if (valid) {
        this.disableBtnArchivo = true;
        this.$emit('loadingSweet', 'Estamos procesando el archivo, esto puede tardar unos minutos...');
        await axios.post(`${this.api}/cliente/subir`, { excel: this.archivoClientes[0] }, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${this.token}`
          }
        }).then(async resp => {
          this.$emit('closeSweet');
          Swal.fire({ icon: resp.data.status ? 'success' : 'warning', text: resp.data.message, showConfirmButton: false, timer: 1700 });
          this.$refs.formExcel.reset();
          this.dialogArchivo = false;
          this.actualizarTodo();
        }).catch(error => {
          this.$emit('closeSweet');
          switch (error.response.status) {
            case 401:
              Session.expiredSession();
              break;
            default:
              Swal.fire({
                icon: 'info',
                text: 'No se pudo subir los clientes',
                showConfirmButton: false,
                timer: 1600
              });
              break;
          }
        });
        /* await axios.put(`${this.api}/prestamo/actualizarTodo`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        }).then(r => {
            console.log(r);
        }).catch(e => {
            console.log(e);
        }); */
        this.disableBtnArchivo = false;
      }
    },
    async actualizarTodo() {
      await this.obtenerClientes();
      await this.getProductosInventario();
      await this.obtenerRutas();
    },
    verClienteFunction(item) {
      this.verCliente = item;
      this.dialogClienteVer = true;
    },
  },
  async created() {
    const invalid = await Session.expiredSession();
    if (!invalid) {
      this.token = this.$store.getters.usuario.usuario.access_token;
      this.$emit('loadingSweet');
      await this.obtenerClientes();
      await this.getProductosInventario();
      await this.obtenerRutas();
      this.$emit('closeSweet');
    }
  }
}
</script>
