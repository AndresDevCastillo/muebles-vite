<template>
  <div class="inventario">
    <v-card class="ma-3">
      <v-row class="px-6 my-4">
        <v-col lg="10" md="10" sm="9">
          <div class="d-flex align-center "><v-icon size="x-large" icon="mdi-store-edit"></v-icon>
            <h1 class="px-3">Inventario</h1>
          </div>
        </v-col>
        <v-col lg="2" md="2" sm="3">
          <v-btn prepend-icon="mdi-plus" color="yellow" @click="dialogoI = true">Crear
            Stock</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-card class="ma-3 w-100">
          <v-card-title>
            <v-col md="6" sm="12"><v-text-field v-model="searchInventario" append-inner-icon="mdi-magnify" label="Buscar"
                variant="outlined" hide-details></v-text-field></v-col>
          </v-card-title>
          <v-data-table :headers="headers" :items="inventario" :sort-by="[{ key: 'nombre', order: 'asc' }]"
            class="elevation-1" :search="searchInventario">
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.actions="{ item }">
              <v-icon size="small" class="me-2" @click="editarStockVista(Object.assign({}, item))">
                mdi-pencil
              </v-icon>
              <v-icon size="small" @click="eliminarProducto(item._id)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-row>
    </v-card>
    <v-dialog v-model="dialogoI" width="700">
      <v-card>
        <v-card-text>
          <v-container>
            <v-form ref="formInventario">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Existencia" type="number" min="1" required variant="outlined"
                    v-model="formInventario.cantidad" :rules="existenciaRule" :counter="65"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select :items="productos" no-data-text="Sin productos" item-title="nombre" item-value="_id"
                    variant="outlined" label="Productos" required v-model="formInventario.producto"
                    :rules="[v => !!v || 'Seleccione un Producto']"></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red-darken-1" variant="tonal" @click="dialogoI = false">
            Cerrar
          </v-btn>
          <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="crearInventario">
            Crear
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogoE" width="700">
      <v-card>
        <v-card-text>
          <v-container>
            <v-form ref="formInventarioEditar">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Existencia" min="1" type="number" required variant="outlined"
                    v-model="formInventarioEditar.existencias" :rules="existenciaRule" :counter="65"></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red-darken-1" variant="tonal" @click="dialogoE = false">
            Cerrar
          </v-btn>
          <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="actualizarInventario">
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
  name: 'inventarioVista',
  data: () => ({
    token: null,
    api: import.meta.env.VITE_APP_API_URL,
    inventario: [],
    productos: [],
    searchInventario: null,
    headers: [
      { title: 'Nombre', key: 'producto.nombre' },
      { title: 'Cantidad', key: 'cantidad' },
      { title: 'Existencia', key: 'existencias' },
      { title: 'Valor compra', key: 'valor_compraP' },
      { title: 'Valor contado', key: 'valor_contadoP' },
      { title: 'Valor crédito', key: 'valor_creditoP' },
      { title: 'Accion', key: 'actions', sortable: false },
    ],
    dialogoI: false,
    dialogoE: false,
    disableBtn: false,
    formInventario: {
      producto: null,
      cantidad: 1,
    },
    formInventarioEditar: {
      id: null,
      cantidad: 0,
      existencias: 1,
    },
    existenciaRule: [
      (v) => (!!v) || "Añada al menos un producto",
      (v) =>
        (/^[0-9]+$/.test(v)) || "El numero no debe contener caracteres",
      (v) => (parseInt(v) > 0) || "El numero debe ser mayor o igual a 0",
    ],
  }),
  methods: {
    async listarInventario() {
      await axios.get(`${this.api}/inventario`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((resp) => {
        let inventarioParseado = [];
        inventarioParseado = resp.data.map(inventario => {
          return {
            ...inventario,
            valor_compraP: inventario.producto.valor_compra.toLocaleString(),
            valor_contadoP: inventario.producto.valor_contado.toLocaleString(),
            valor_creditoP: inventario.producto.valor_credito.toLocaleString()
          }
        });
        this.inventario = inventarioParseado;
      }).catch(async error => {
        console.log(error)
        switch (error.response.status) {
          case 401:
            await Swal.fire({ icon: 'warning', title: 'Tu sesión expiro, vuelve a iniciar sesión', showConfirmButton: false, timer: 1500 });
            this.$store.commit('setusuario', { usuario: null, hora_login: null });
            this.$router.push('/');
            break;

          default:
            Swal.fire({ icon: 'error', title: 'No se pudo obtener los productos en stock', showConfirmButton: false, timer: 1500 });
            break;
        }
      });
    },
    async listarProductos() {
      await axios.get(`${this.api}/inventario/productos`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(resp => {
        this.productos = resp.data;
      }).catch(async error => {
        console.log(error);
        switch (error.response.status) {
          case 401:
            await Swal.fire({ icon: 'warning', title: 'Tu sesión expiro, vuelve a iniciar sesión', showConfirmButton: false, timer: 1500 });
            this.$store.commit('setusuario', { usuario: null, hora_login: null });
            this.$router.push('/');
            break;

          default:
            Swal.fire({ icon: 'error', title: 'No se pudo obtener los productos del inventario', showConfirmButton: false, timer: 1500 });
            break;
        }
      });
    },
    async eliminarProducto(id) {
      await Swal.fire({
        icon: 'info',
        title: 'Seguro quiere eliminar el producto del inventario?',
        showDenyButton: true,
        denyButtonText: 'No',
        confirmButtonText: 'Eliminar',
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          await axios.delete(`${this.api}/inventario/${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).then(() => {
            Swal.fire({ icon: 'success', title: 'Se elimino correctamente', timer: 1500, showConfirmButton: false });
          })
        }
      }).catch(() => {
        return Swal.fire({ icon: 'error', title: 'No se pudo eliminar el producto del inventario', showConfirmButton: false, timer: 1500 });
      });
      await this.listarInventario();
      await this.listarProductos();
    },
    async crearInventario() {
      const { valid } = await this.$refs.formInventario.validate();
      if (valid) {
        this.disableBtn = true;
        this.formInventario.cantidad = parseInt(this.formInventario.cantidad);
        this.dialogoI = false;
        await axios.post(`${this.api}/inventario/crear`, this.formInventario, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }).then((resp) => {
          if (resp.status == 201) {
            return Swal.fire({
              icon: 'success',
              title: 'Exitoso',
              text: 'Stock creado correctamente!',
              showConfirmButton: false,
              timer: 1500
            });
          }
        }).catch(async error => {
          console.log(error);
          switch (error.response.status) {
            case 401:
              await Swal.fire({ icon: 'warning', title: 'Tu sesión expiro, vuelve a iniciar sesión', showConfirmButton: false, timer: 1500 });
              this.$store.commit('setusuario', { usuario: null, hora_login: null });
              this.$router.push('/');
              break;

            default:
              Swal.fire({ icon: 'error', title: 'No se pudo crear el stock', showConfirmButton: false, timer: 1500 });
              break;
          }
        });
      }
      this.disableBtn = false;
      this.formInventario = {
        producto: null,
        cantidad: 1,
      };
      await this.listarInventario();
      await this.listarProductos();
    },
    editarStockVista(item) {
      this.formInventarioEditar.id = item._id;
      this.formInventarioEditar.cantidad = parseInt(item.cantidad);
      this.formInventarioEditar.existencias = parseInt(item.existencias);
      this.dialogoE = true;

    },
    async actualizarInventario() {
      this.disableBtn = true;
      const { valid } = await this.$refs.formInventarioEditar.validate();
      if (valid) {
        this.dialogoE = false;
        this.formInventarioEditar.existencias = parseInt(this.formInventarioEditar.existencias);
        this.formInventarioEditar.cantidad = this.formInventarioEditar.existencias;
        axios.put(`${this.api}/inventario/actualizar`, this.formInventarioEditar, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }).then(async () => {
          await this.listarInventario();
          await this.listarProductos();
          return Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Inventario actualizado correctamente!',
            showConfirmButton: false,
            timer: 1500
          });
        }).catch(async error => {
          console.log(error);
          switch (error.response.status) {
            case 401:
              await Swal.fire({ icon: 'warning', title: 'Tu sesión expiro, vuelve a iniciar sesión', showConfirmButton: false, timer: 1500 });
              this.$store.commit('setusuario', { usuario: null, hora_login: null });
              this.$router.push('/');
              break;

            default:
              Swal.fire({ icon: 'error', title: 'No se pudo crear el stock', showConfirmButton: false, timer: 1500 });
              break;
          }
        });
      }
      this.disableBtn = false;
      await this.listarInventario();
      await this.listarProductos();
    },
    debugSession() {
      Session.expiredSession();
    }
  },
  async created() {
    const invalid = await Session.expiredSession();
    if (!invalid) {
      this.token = this.$store.getters.usuario.usuario.access_token;
      this.$emit('loadingSweet');
      await this.listarInventario();
      await this.listarProductos();
      this.$emit('closeSweet');
    }
  }

}
</script>

<style></style>
