<template>
  <div class="empleados">
    <v-card class="ma-3">
      <v-row class="px-6 my-4" justify="space-between">
        <v-col cols="auto" class="pb-0">
          <div class="d-flex align-center"><v-icon size="x-large" icon="mdi mdi-account-cog"></v-icon>
            <h1 class="px-3">Administración de empleados</h1>
          </div>
        </v-col>
        <v-col cols="auto">
          <v-btn prepend-icon="mdi-plus" class="me-2 my-2" color="green" @click="dialogE = true;">Empleado</v-btn>
        </v-col>
      </v-row>
      <v-row class="flex-column">
        <v-card class="ma-3 w-100">
          <v-card-title>
            <v-col sm="12" md="4">
              <v-text-field v-model="searchEmpleado" append-inner-icon="mdi-magnify" label="Buscar" variant="outlined"
                hide-details>
              </v-text-field>
            </v-col>
          </v-card-title>
          <v-data-table :headers="headers" :items="empleados" :sort-by="[{ key: 'nombre', order: 'asc' }]"
            class="elevation-1" :search="searchEmpleado" no-data-text="Sin empleados">
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.actions="{ item }">
              <v-icon size="small" class="me-2" @click="dialogEditarEmpleado(Object.assign({}, item))">
                mdi-pencil
              </v-icon>
              <v-icon size="small" @click="eliminarEmpleado(item._id)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-row>
      <v-dialog v-model="dialogE" persistent width="700">
        <v-card>
          <v-card-text>
            <v-container>
              <v-form ref="formEmpleado">
                <v-row>
                  <v-col cols="12">
                    <v-text-field label="Nombre empleado" type="text" required variant="outlined"
                      v-model="formEmpleado.nombre" :rules="nombreRules" :counter="65"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select label="Rol" :items="roles" required variant="outlined" v-model="formEmpleado.rol"
                      :rules="[v => !!v || 'El rol es requerido']"></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field type="text" variant="outlined" label="Usuario" required v-model="formEmpleado.usuario"
                      :rules="usuarioRules"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field label="Contraseña" required v-model="formEmpleado.contrasena" :rules="campoRules"
                      :append-inner-icon="visibleContra ? 'mdi-eye-off' : 'mdi-eye'"
                      :type="visibleContra ? 'text' : 'password'" variant="outlined"
                      @click:append-inner="visibleContra = !visibleContra"></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="red-darken-1" variant="tonal" @click="dialogE = false">
              Cerrar
            </v-btn>
            <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="crearEmpleado">
              Crear
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
    <v-dialog v-model="showEditarEmpleado" persistent width="700">
      <v-card>
        <v-card-text>
          <v-container>
            <v-form ref="formEmpleadoEditar">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Nombre empleado" type="text" required variant="outlined"
                    v-model="paqueteEditar.nombre" :rules="nombreRules" :counter="65"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select label="Rol" :items="roles" required variant="outlined" v-model="paqueteEditar.rol"
                    :rules="[v => !!v || 'El rol es requerido']"></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field type="text" persistent-hint hint="No modificar para no cambiar el usuario"
                    variant="outlined" label="Usuario" v-model="paqueteEditar.usuario"
                    :rules="usuarioRules"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="Contraseña" persistent-hint hint="No modificar para no cambiar la contraseña"
                    v-model="paqueteEditar.contrasena" :append-inner-icon="visibleContra ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="visibleContra ? 'text' : 'password'" variant="outlined"
                    @click:append-inner="visibleContra = !visibleContra"></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red-darken-1" variant="tonal" @click="showEditarEmpleado = false">
            Cerrar
          </v-btn>
          <v-btn color="blue-darken-1" variant="tonal" :disabled="disableBtn" @click="editarEmpleado">
            Editar
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
  name: "empleadosVista",
  data: () => ({
    token: null,
    searchEmpleado: null,
    disableBtn: false,
    visibleContra: true,
    empleados: [],
    roles: [],
    dialogE: false,
    showEditarEmpleado: false,
    formEmpleado: {
      nombre: null,
      rol: null,
      usuario: null,
      contrasena: null,
    },
    paqueteEditar: {
      id: null,
      nombre: null,
      usuario: null,
      contrasena: null,
    },
    regexEspacios: /^\s*$/,
    campoRules: [v => !!v || 'Campo requerido',],
    nombreRules: [
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 65) || 'El nombre no puede superar los 65 caracteres',
    ],
    usuarioRules: [
      v => !!v || 'El usuario es requerido',
      v => { if (/^\s*$/ig.test(v)) { return 'El usuario no debe ser espacios en blanco' } else { return true; } },
      v => (v && v.length > 3) || 'EL nombre debe tener mínimo 4 caracteres',
    ],
    api: import.meta.env.VITE_APP_API_URL,
    headers: [
      { title: 'Nombre', key: 'nombre' },
      { title: 'Usuario', key: 'usuario' },
      { title: 'Rol', key: 'rol' },
      { title: 'Accion', key: 'actions', sortable: false },
    ],
  }),
  methods: {
    async listarEmpleados() {
      await axios.get(`${this.api}/usuario`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(resp => {
        this.empleados = resp.data;
      }).catch(error => {
        switch (error.response.status) {
          case 401:
            Session.expiredSession();
            break;
          default:
            Swal.fire({
              icon: 'info',
              text: 'No se pudo recuperar la información, intente nuevamente',
              showConfirmButton: false,
              timer: 1600
            });
            break;
        }
      });
    },
    async listarRoles() {
      await axios.get(`${this.api}/usuario/roles`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((resp) => {
        this.roles = resp.data;
      }).catch(error => {
        switch (error.response.status) {
          case 401:
            Session.expiredSession();
            break;
          default:
            Swal.fire({
              icon: 'info',
              text: 'No se pudo recuperar la información, intente nuevamente',
              showConfirmButton: false,
              timer: 1600
            });
            break;
        }
      });
    },
    async crearEmpleado() {
      const { valid } = await this.$refs.formEmpleado.validate();
      if (valid) {
        this.disableBtn = true;
        this.formEmpleado.usuario = this.formEmpleado.usuario.trim();
        await axios.post(`${this.api}/usuario/crear`, this.formEmpleado, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }).then(() => {
          this.$refs.formEmpleado.reset();
          this.dialogE = false;
          Swal.fire({ icon: 'success', text: 'Empleado creado correctamente', showConfirmButton: false, timer: 1500 });
        }).catch(error => {
          switch (error.response.status) {
            case 401:
              Session.expiredSession();
              break;
            default:
              Swal.fire({
                icon: 'info',
                text: 'No se pudo recuperar la información, intente nuevamente',
                showConfirmButton: false,
                timer: 1600
              });
              break;
          }
        });
        await this.listarEmpleados();
        this.disableBtn = false;
      }
    },
    async editarEmpleado() {
      const { valid } = await this.$refs.formEmpleadoEditar.validate();
      if (valid) {
        this.disableBtn = true;
        await axios.put(`${this.api}/usuario`, this.paqueteEditar, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }).then(() => {
          this.$refs.formEmpleadoEditar.reset();
          this.showEditarEmpleado = false;
          Swal.fire({ icon: 'success', text: 'Empleado editado correctamente', showConfirmButton: false, timer: 1600 });
        }).catch(error => {
          switch (error.response.status) {
            case 401:
              Session.expiredSession();
              break;
            default:
              Swal.fire({
                icon: 'info',
                text: 'No se pudo recuperar la información, intente nuevamente',
                showConfirmButton: false,
                timer: 1600
              });
              break;
          }
        });
        await this.listarEmpleados();
        this.disableBtn = false;
      }
    },
    async eliminarEmpleado(id) {
      Swal.fire({
        icon: 'info',
        title: '¿Seguro de qué quiere eliminar el empleado?',
        showDenyButton: true,
        denyButtonText: 'No',
        confirmButtonText: 'Eliminar',
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          await axios.delete(`${this.api}/usuario/${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).then(() => {
            Swal.fire({ icon: 'success', text: 'Se elimino correctamente el empleado', timer: 1500, showConfirmButton: false });
            this.listarEmpleados();
          }).catch(error => {
            switch (error.response.status) {
              case 401:
                Session.expiredSession();
                break;
              default:
                Swal.fire({
                  icon: 'info',
                  text: 'Algo paso, intente nuevamente',
                  showConfirmButton: false,
                  timer: 1600
                });
                break;
            }
          });
        }
      }).catch(() => {
        return Swal.fire({ icon: 'error', text: 'No se pudo eliminar el empleado', showConfirmButton: false, timer: 1700 });
      });
    },

    dialogEditarEmpleado(empleado) {
      this.paqueteEditar = empleado;
      this.paqueteEditar.id = empleado._id;
      this.paqueteEditar.contrasena = '';
      delete this.paqueteEditar._id;
      this.showEditarEmpleado = true;
    }
  },
  async created() {
    const invalid = await Session.expiredSession();
    if (!invalid) {
      this.token = this.$store.getters.usuario.usuario.access_token;
      this.$emit('loadingSweet');
      await this.listarEmpleados();
      await this.listarRoles();
      this.$emit('closeSweet');
    }
  }
}
</script>

<style></style>
