<template>
  <div class="producto">
    <v-card class="ma-3">
      <v-row class="px-6 my-4" justify="space-between">
        <v-col lg="9" md="9" sm="12">
          <div class="d-flex align-center "><v-icon size="x-large" icon="mdi mdi-table-furniture"></v-icon>
            <h1 class="px-3">Productos</h1>
          </div>
        </v-col>
        <v-col lg="3" md="3" sm="5" class="align-self-end text-end">
          <v-btn prepend-icon="mdi mdi-plus" color="green" @click="dialogP = true"
            style="min-width: 170px;">Producto</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-card class="ma-3 w-100">
          <v-card-title>
            <v-col md="6" sm="12"><v-text-field v-model="searchProducto" append-inner-icon="mdi-magnify" label="Buscar"
                variant="outlined" hide-details></v-text-field></v-col>
          </v-card-title>
          <v-data-table :headers="headers" :items="productos" :sort-by="[{ key: 'nombre', order: 'asc' }]"
            class="elevation-1" :search="searchProducto">
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.actions="{ item }">
              <v-icon size="small" class="me-2" @click="editarProductoFunction(Object.assign({}, item))">
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
    <v-dialog v-model="dialogP" persistent width="700">
      <v-card>
        <v-card-title>Nuevo producto</v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="formProducto">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Nombre producto" type="text" required variant="outlined"
                    v-model="formProducto.nombre" :rules="nombreRules" :counter="65"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Valor de compra" type="number" min="1" required hint="Sin comas o puntos (, .)"
                    persistent-hint variant="outlined" v-model="formProducto.valor_compra"
                    :rules="precioRules"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="Valor de contado" type="number" min="1" variant="outlined"
                    hint="Sin comas o puntos (, .)" persistent-hint required v-model="formProducto.valor_contado"
                    :rules="precioRules"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="Valor de crédito" type="number" min="1" variant="outlined"
                    hint="Sin comas o puntos (, .)" persistent-hint required v-model="formProducto.valor_credito"
                    :rules="precioRules"></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red-darken-1" variant="tonal" @click="dialogP = false">
            Cerrar
          </v-btn>
          <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="crearProducto">
            Crear
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <editarProductoComponent :verDialog="dialogEditar" @noactualizo="noactualizoProducto" @actualizo="actualizoProducto"
      @cerrar="dialogEditar = false" :editarProducto="actualizarProducto">
    </editarProductoComponent>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import Session from '@/validation/session';
import editarProductoComponent from '../components/editarProducto.vue';

export default {
  name: 'productosVista',
  components: {
    editarProductoComponent,
  },
  data: () => ({
    api: import.meta.env.VITE_APP_API_URL,
    token: null,
    disableBtn: false,
    dialogP: false,
    productos: [],
    searchProducto: null,
    headers: [
      { title: 'Nombre', key: 'nombre' },
      { title: 'Valor compra', key: 'valor_compraP' },
      { title: 'Valor contado', key: 'valor_contadoP' },
      { title: 'Valor crédito', key: 'valor_creditoP' },
      { title: 'Accion', key: 'actions', sortable: false },
    ],
    actualizarProducto: { _id: null, nombre: null, valor_compra: null, valor_contado: null, valor_credito: null },
    dialogEditar: false,
    formProducto: {
      nombre: null,
      valor_compra: null,
      valor_contado: null,
      valor_credito: null
    },
    nombreRules: [
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 65) || 'EL nombre no puede superar los 65 caracteres',
    ],
    precioRules: [v => !!v || 'El precio es requerido', v => (v && /^[0-9]+$/.test(v)) || 'El numero no debe contener caracteres'],

  }),
  methods: {
    async listarProductos() {
      await axios.get(`${this.api}/producto`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then((resp) => {
        let productoParseado = [];
        productoParseado = resp.data.map(producto => {
          return {
            ...producto,
            valor_compraP: producto.valor_compra.toLocaleString(),
            valor_contadoP: producto.valor_contado.toLocaleString(),
            valor_creditoP: producto.valor_credito.toLocaleString()
          }
        });
        this.productos = productoParseado;
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
    async crearProducto() {
      const { valid } = await this.$refs.formProducto.validate();
      if (valid) {
        this.disableBtn = true;
        this.dialogP = false;
        this.formProducto.valor_compra = parseInt(this.formProducto.valor_compra);
        this.formProducto.valor_contado = parseInt(this.formProducto.valor_contado);
        this.formProducto.valor_credito = parseInt(this.formProducto.valor_credito);
        await axios.post(`${this.api}/producto/crear`, this.formProducto, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }).then(() => {
          return Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Producto creado correctamente!',
            showConfirmButton: false,
            timer: 1500
          });

        }).catch(error => {
          switch (error.response.status) {
            case 401:
              Session.expiredSession();
              break;

            default:
              Swal.fire({
                icon: 'info',
                text: 'No se pudo crear el producto',
                showConfirmButton: false,
                timer: 1600
              });
              break;
          }
        });
        this.formProducto = {
          nombre: null,
          valor_compra: null,
          valor_contado: null,
          valor_credito: null
        };
        this.disableBtn = false;
        await this.listarProductos();
      }
    },
    async eliminarProducto(id) {
      Swal.fire({
        icon: 'info',
        title: 'Seguro quiere eliminar el producto?',
        showDenyButton: true,
        denyButtonText: 'No',
        confirmButtonText: 'Eliminar',
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          await axios.delete(`${this.api}/producto/${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).then(() => {
            this.listarProductos();
            Swal.fire({ icon: 'success', title: 'Se elimino correctamente', timer: 1500, showConfirmButton: false });
          })
        }
      }).catch(() => {
        return Swal.fire({ icon: 'error', title: 'No se pudo eliminar el producto', showConfirmButton: false, timer: 1500 });
      });
    },
    editarProductoFunction(item) {
      this.actualizarProducto = item;
      this.dialogEditar = true;
    },
    actualizoProducto() {
      this.dialogEditar = false;
      Swal.fire({ icon: 'success', title: 'Se edito correctamente', timer: 1500, showConfirmButton: false });
      this.listarProductos();
    },
    noactualizoProducto() {
      this.dialogEditar = false;
      Swal.fire({ icon: 'error', title: 'No se edito correctamente', timer: 1500, showConfirmButton: false });
      this.listarProductos();
    },
  },
  async created() {
    const invalid = await Session.expiredSession();
    if (!invalid) {
      this.token = this.$store.getters.usuario.usuario.access_token;
      this.$emit('loadingSweet');
      await this.listarProductos();
      this.$emit('closeSweet');
    }

  },

}

</script>

<style></style>
