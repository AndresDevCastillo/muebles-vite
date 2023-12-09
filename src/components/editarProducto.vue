<template>
  <v-row justify="space-around">
    <v-dialog v-model="this.$props.verDialog" persistent width="700">
      <v-card>
        <v-card-title>
          Editar producto
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="formProductoEditar">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Nombre producto" type="text" required variant="outlined" v-model="paquete.nombre"
                    :rules="nombreRules" :counter="65"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Valor de compra" type="number" min="1" required hint="Sin comas o puntos (, .)"
                    persistent-hint variant="outlined" v-model="paquete.valor_compra" :rules="precioRules"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="Valor de contado" type="number" min="1" variant="outlined"
                    hint="Sin comas o puntos (, .)" persistent-hint required v-model="paquete.valor_contado"
                    :rules="precioRules"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="Valor de crédito" type="number" min="1" variant="outlined"
                    hint="Sin comas o puntos (, .)" persistent-hint required v-model="paquete.valor_credito"
                    :rules="precioRules"></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red-darken-1" variant="tonal" @click="cerrarComponente">
            Cerrar
          </v-btn>
          <v-btn color="blue-darken-1" variant="tonal" @click="editarPeticion">
            Editar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from 'axios';
export default {
  name: 'editarProductoComponent',
  props: {
    editarProducto: { default: null },
    verDialog: { type: Boolean, default: false }
  },
  data: () => ({
    token: null,
    api: import.meta.env.VITE_APP_API_URL,
    paquete:
    {
      id: null,
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
    cerrarComponente() {
      this.$emit('cerrar');
    },
    actualizoTrue() {
      this.$emit('actualizo');
    },
    actualizoFalse() {
      this.$emit('noactualizo');
    },
    async editarPeticion() {
      const { valid } = await this.$refs.formProductoEditar.validate();
      if (valid) {
        try {
          this.paquete.valor_compra = parseInt(this.paquete.valor_compra);
          this.paquete.valor_contado = parseInt(this.paquete.valor_contado);
          this.paquete.valor_credito = parseInt(this.paquete.valor_credito);
          await axios.put(`${this.api}/producto/actualizar`, this.paquete, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).then(() => {
            this.actualizoTrue();
          });
        }
        catch (e) {
          this.actualizoFalse();
        }
      }
    }
  },
  watch: {
    verDialog() {
      if (this.$props.verDialog) {
        this.paquete = { ...this.$props.editarProducto };
        delete this.paquete._id;
        delete this.paquete.__v;
        this.paquete.id = this.$props.editarProducto._id;
      }
    },
  },
  created() {
    this.token = this.$store.getters.usuario.usuario.access_token;
  }
}
</script>

<style></style>
