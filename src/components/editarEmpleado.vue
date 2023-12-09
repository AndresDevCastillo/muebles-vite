<template>
  <v-dialog persistent width="700">
    <v-card>
      <v-card-title>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="formProductoEditar">
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field class="inline-form-input-name" label="Nombre" type="text" required variant="outlined"
                  v-model="paquete.nombre" :rules="nombreRules" :counter="65"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="Cedula" type="number" variant="outlined" hint="Sin comas o puntos (, .)"
                  persistent-hint required :counter="14" v-model="(paquete.cedula)" :rules="cedulaRules"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field class="inline-form-input-name" label="Dirección" type="text" required variant="outlined"
                  v-model="paquete.direccion" :rules="[v => !!v || 'La descripción es requerida']"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" v-if="tipoCargo.length > 0">
                <v-select :items="tipoCargo" variant="outlined" label="Cargo" required v-model="paquete.tipoCargo"
                  :rules="[v => !!v || 'Seleccione una Cargo']"></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field class="inline-form-input-name" label="Teléfono" type="text" required variant="outlined"
                  v-model="paquete.telefono" :rules="[v => !!v || 'La telefono es requerido']">

                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red-darken-1" variant="tonal" @click="cerrarComponente()">
          Cerrar
        </v-btn>
        <v-btn color="blue-darken-1" variant="tonal" :disabled="disableBtn" @click="editarUnEmpleado()">
          Editar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script >
import axios from 'axios';
export default {
  name: 'editarEmpleadoComponent',
  props: {
    editarEmpleado: { default: null }
  },
  data: () => ({
    api: import.meta.env.VITE_APP_API_URL,
    disableBtn: false,
    paquete:
      { id: null, cedula: null, nombre: null, direccion: null, tipoCargo: null, telefono: null },
    tipoCargo: [],
    nombreRules: [
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 65) || 'EL nombre no puede superar los 65 caracteres',
    ],
    cedulaRules: [v => !!v || 'El cedula es requerido', v => (v && /^[0-9]+$/.test(v)) || 'El numero no debe contener caracteres'],

  }),
  methods: {
    async listarCargos() {
      await axios.get(`${this.api}/empleado/cargos`).then((resp) => {
        this.tipoCargo = resp.data;
      })
    },
    cerrarComponente() {
      this.$emit('cerrar');
    },
    async editarUnEmpleado() {
      this.disableBtn = true;
      this.paquete.cedula = parseInt(this.paquete.cedula);
      await axios.put(`${this.api}/empleado/actualizar`, this.paquete).then(() => {
        this.$emit('actualizo');
      }).catch(() => {
        this.$emit('noactualizo');
      });
      this.disableBtn = false;
    }
  },
  watch: {
    editarEmpleado() {
      this.listarCargos();
      this.paquete = this.$props.editarEmpleado;
    }
  }

}
</script>

<style></style>
