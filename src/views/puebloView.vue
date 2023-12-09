<template>
  <div class="pueblo">
    <v-card class="ma-3">
      <v-row class="px-6 my-4" justify-sm="start" justify="space-between">
        <v-col lg="2" md="2" sm="12" cols="auto">
          <div class="d-flex align-center"><v-icon size="x-large" icon="mdi mdi-map-search"></v-icon>
            <h1 class="px-3">Rutas</h1>
          </div>
        </v-col>
        <v-col lg="8" md="7" sm="12" cols="auto" class="align-self-end text-sm-start text-md-end text-lg-end">
          <v-btn prepend-icon="mdi mdi-plus" color="blue" @click="dialogCobrador = true">
            Cobrador a ruta</v-btn>
        </v-col>
        <v-col lg="2" md="3" sm="12" cols="auto" class="align-self-end text-sm-start">
          <v-btn prepend-icon="mdi mdi-plus" color="green" @click="dialogR = true" style="min-width: 170px;">Crear
            Ruta</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-card class="ma-3 w-100">
          <v-card-title>
            <v-col md="6" sm="12"><v-text-field v-model="searchRuta" append-inner-icon="mdi-magnify" label="Buscar"
                variant="outlined" hide-details></v-text-field></v-col>
          </v-card-title>
          <v-data-table :headers="headers" :items="rutas" :sort-by="[{ key: 'nombre', order: 'asc' }]" class="elevation-1"
            :search="searchRuta">
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.actions="{ item }">
              <v-icon size="small" class="me-2" @click="verRutaFunction(Object.assign({}, item))">
                mdi-eye
              </v-icon>
              <v-icon size="small" class="me-2" @click="preEditarRuta(Object.assign({}, item))">
                mdi-pencil
              </v-icon>
              <v-icon size="small" @click="eliminarRuta(item._id)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-row>
    </v-card>
    <v-dialog v-model="dialogR" persistent width="700">
      <v-card>
        <v-card-title>Nueva ruta</v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="formRuta">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Nombre de la ruta" type="text" required variant="outlined"
                    v-model="formRuta.nombre" :rules="nombreRules" :counter="65"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select :items="departamento" variant="outlined" label="Departamento" required
                    v-model="formRuta.departamento" item-title="departamento" item-value="departamento"
                    :rules="[v => !!v || 'Seleccione un departamento']" no-data-text="No hay departamentos"></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select :items="ciudades" variant="outlined" label="Ciudad" required v-model="formRuta.ciudad"
                    :rules="[v => !!v || 'Seleccione una ciudad']" no-data-text="Escoja un departamento"></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red-darken-1" variant="tonal" @click="dialogR = false">
            Cerrar
          </v-btn>
          <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="crearRuta()">
            Crear
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogReditar" persistent width="700">
      <v-card>
        <v-card-text>
          <v-container>
            <v-form ref="formRutaEditar">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Nombre de la ruta" type="text" required variant="outlined"
                    v-model="formRutaEditar.nombre" :rules="nombreRules" :counter="65"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select :items="departamento" variant="outlined" label="Departamento" required
                    v-model="formRutaEditar.departamento" item-title="departamento" item-value="departamento"
                    :rules="[v => !!v || 'Seleccione un departamento']" no-data-text="No hay departamentos"></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select :items="ciudades" variant="outlined" label="Ciudad" required v-model="formRutaEditar.ciudad"
                    :rules="[v => !!v || 'Seleccione una ciudad']" no-data-text="Escoja un departamento"></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red-darken-1" variant="tonal" @click="dialogReditar = false">
            Cerrar
          </v-btn>
          <v-btn color="blue-darken-1" variant="tonal" :disabled="disableBtn" @click="editarRuta()">
            Editar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogVerRuta" persistent width="700">
      <v-card>
        <v-card-text>
          <v-container>
            <v-form>
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Nombre de la ruta" type="text" required variant="outlined" v-model="verRuta.nombre"
                    disabled></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field variant="outlined" label="Departamento" disabled required v-model="verRuta.departamento"
                    item-title="departamento" item-value="departamento"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field variant="outlined" label="Ciudad" disabled required
                    v-model="verRuta.ciudad"></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red-darken-1" variant="tonal" @click="dialogVerRuta = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogCobrador" persistent width="700">
      <v-card>
        <v-card-title>Agregar ruta a un cobrador</v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="formCobradorRuta">
              <v-row>
                <v-col cols="12">
                  <v-autocomplete :items="cobradores" item-value="_id" item-title="nombre" variant="outlined"
                    label="Cobrador" required v-model="formCobrador.cobrador" :rules="campoRules"
                    no-data-text="Sin cobradores"></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete label="Ruta" :items="rutas" item-value="_id" item-title="nombre"
                    no-data-text="Sin rutas" placeholder="Escoja ruta" required variant="outlined"
                    v-model="formCobrador.rutas" closable-chips :rules="campoRules" multiple chips></v-autocomplete>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red-darken-1" variant="tonal" @click="dialogCobrador = false">
            Cerrar
          </v-btn>
          <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="agregarRutaCobrador()">
            Actualizar
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
export default {
  name: 'puebloVista',
  data: () => ({
    disableBtn: false,
    api: import.meta.env.VITE_APP_API_URL,
    token: null,
    dialogR: null,
    dialogReditar: null,
    dialogVerRuta: null,
    dialogCobrador: false,
    searchRuta: null,
    formRuta: {
      nombre: null,
      ciudad: null,
      departamento: null
    },
    formRutaEditar: {
      nombre: null,
      ciudad: null,
      departamento: null
    },
    formCobrador: {
      cobrador: null,
      rutas: [],
    },
    verRuta: null,
    departamento: [],
    ciudades: [],
    campoRules: [v => !!v || 'Campo requerido',],
    nombreRules: [
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 65) || 'EL nombre no puede superar los 65 caracteres',
    ],
    dialog: false,
    dialogDelete: false,
    headers: [
      { title: 'Ruta', key: 'nombre' },
      { title: 'Ciudad', key: 'ciudad' },
      { title: 'Departamento', key: 'departamento' },
      { title: 'Accion', key: 'actions', sortable: false },
    ],
    rutas: [],
    cobradores: []
  }),
  methods: {
    async obtenerUbicacion() {
      await axios.get(`${this.api}/pueblo/ubicacion`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((resp) => {
        this.departamento = resp.data;
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
    async obtenerCobradores() {
      await axios.get(`${this.api}/usuario/cobrador`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((resp) => {
        this.cobradores = resp.data;
      }).catch(error => {
        switch (error.response.status) {
          case 401:
            Session.expiredSession();
            break;
          default:
            Swal.fire({
              icon: 'info',
              text: 'No se pudo obtener los cobradores',
              showConfirmButton: false,
              timer: 1600
            });
            break;
        }
      });
    },
    async crearRuta() {
      const { valid } = await this.$refs.formRuta.validate();
      if (valid) {
        this.disableBtn = true;
        this.dialogR = false;
        await axios.post(`${this.api}/pueblo/crear`, this.formRuta, {
          headers: {
            Authorization: `Bearer ${this.token}`
          },
        }).then(() => {
          this.formRuta = {
            nombre: null,
            ciudad: null,
            departamento: null
          }
          return Swal.fire({ icon: 'success', title: 'Se creo la ruta correctamente', showConfirmButton: false, timer: 1500 });
        }).catch(error => {
          switch (error.response.status) {
            case 401:
              Session.expiredSession();
              break;
            default:
              Swal.fire({
                icon: 'info',
                text: 'No se pudo crear la ruta',
                showConfirmButton: false,
                timer: 1600
              });
              break;
          }
        });
        await this.obtenerRutas();
        this.disableBtn = false;
      }
    },
    async agregarRutaCobrador() {
      const { valid } = await this.$refs.formCobradorRuta.validate();
      if (valid) {
        this.disableBtn = true;
        await axios.post(`${this.api}/usuario/agregarRuta`, this.formCobrador, {
          headers: {
            Authorization: `Bearer ${this.token}`
          },
        }).then(() => {
          this.$refs.formCobradorRuta.reset();
          Swal.fire({ icon: 'success', text: 'Se agrego la ruta correctamente', showConfirmButton: false, timer: 1600 });
        }).catch(error => {
          switch (error.response.status) {
            case 401:
              Session.expiredSession();
              break;
            default:
              Swal.fire({
                icon: 'info',
                text: 'No se pudo agregar la ruta al cobrador',
                showConfirmButton: false,
                timer: 1600
              });
              break;
          }
        });
        await this.obtenerCobradores();
        this.disableBtn = false;
      }
    },
    async eliminarRuta(id) {
      Swal.fire({
        icon: 'info',
        title: 'Seguro quiere eliminar la ruta?',
        showDenyButton: true,
        denyButtonText: 'No',
        confirmButtonText: 'Eliminar',
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          await axios.delete(`${this.api}/pueblo/${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).then(() => {
            this.obtenerRutas();
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
              text: 'No se pudo eliminar la ruta',
              showConfirmButton: false,
              timer: 1600
            });
            break;
        }
      });
    },
    preEditarRuta(item) {
      item.id = item._id;
      delete item._id;
      delete item.__v;
      this.formRutaEditar = item;
      this.dialogReditar = true;
    },
    async editarRuta() {
      const { valid } = await this.$refs.formRutaEditar.validate();
      if (valid) {

        this.disableBtn = true;
        this.dialogReditar = false;
        await axios.put(`${this.api}/pueblo/actualizar`, this.formRutaEditar, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }).then(() => {
          this.formRutaEditar = {
            nombre: null,
            ciudad: null,
            departamento: null
          }
          return Swal.fire({ icon: 'success', title: 'Se edito la ruta correctamente', showConfirmButton: false, timer: 1500 });
        }).catch(error => {
          switch (error.response.status) {
            case 401:
              Session.expiredSession();
              break;
            default:
              Swal.fire({
                icon: 'info',
                text: 'No se pudo edita el pueblo',
                showConfirmButton: false,
                timer: 1600
              });
              break;
          }
        });
        await this.obtenerRutas();
        this.disableBtn = false;
      }
    },
    verRutaFunction(item) {
      this.dialogVerRuta = true;
      this.verRuta = item;
    },
  },
  async created() {
    const invalid = await Session.expiredSession();
    if (!invalid) {
      this.token = this.$store.getters.usuario.usuario.access_token;
      this.$emit('loadingSweet');
      await this.obtenerUbicacion();
      await this.obtenerRutas();
      await this.obtenerCobradores();
      this.$emit('closeSweet');
    }
  },
  watch: {
    "formRuta.departamento": {
      handler(departamentoNombre) {
        this.formRuta.ciudad = null;
        this.departamento.map(departamento => {
          if (departamento.departamento == departamentoNombre) {
            this.ciudades = departamento.ciudades;
          }
        })
      },
    },
    "formRutaEditar.departamento": {
      handler(departamentoNombre) {
        this.departamento.map(departamento => {
          if (departamento.departamento == departamentoNombre) {
            this.ciudades = departamento.ciudades;
          }
        })
      },
    },
    "formCobrador.cobrador": {
      handler(newId) {
        this.cobradores.map(cobrador => {
          if (cobrador._id == newId) {
            this.formCobrador.rutas = cobrador.rutas;
          }
        })
      }
    }


  }
}
</script>

