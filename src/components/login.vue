<template>
  <div class="login">
    <v-row justify="center" no-gutters class="pa-7">
      <v-card width="450" class="m-6" elevation="5">
        <v-card-title primary-title>
          <h3 class="headline text-center text-wrap">Iniciar sesión</h3>
        </v-card-title>
        <v-card-text class="px-4">
          <form ref="form">
            <v-row class="flex-column">
              <v-col cols="12" class="pa-3">
                <v-text-field v-model="paquete.usuario" variant="outlined" label="Usuario" :rules="usuarioRule"
                  placeholder="Ingrese su usuario" prepend-inner-icon="mdi-account-lock"></v-text-field>
              </v-col>
              <v-col cols="12" class="pa-3">
                <v-text-field v-model="paquete.contrasena" :type="visible ? 'text' : 'password'" variant="outlined"
                  label="Contraseña" placeholder="Ingrese su contraseña"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" prepend-inner-icon="mdi-lock-outline"
                  @click:append-inner="visible = !visible"></v-text-field>
              </v-col>
            </v-row>
          </form>
        </v-card-text>
        <v-card-actions justify="center" class="px-4 align-content-end">
          <v-btn color="success" variant="elevated" @click="ingresar" class="ml-auto">INGRESAR</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </div>
</template>
<script>
import Swal from 'sweetalert2';
import axios from 'axios';
export default {
  name: 'loginComponent',
  data: () => ({
    visible: false,
    usuarioRule: [
      v => !!v || 'Usuario es requerido',
    ],
    paquete: {
      usuario: null,
      contrasena: null
    },
    api: import.meta.env.VITE_APP_API_URL
  }),
  methods: {
    async ingresar() {
      if (this.paquete.usuario != null && this.paquete.usuario.trim().length > 0) {
        this.loadingSweet();
        await axios.post(`${this.api}/auth/login`, this.paquete).then(response => {
          this.closeSweet();
          switch (response.status) {
            case 401:
              Swal.fire({ icon: 'warning', text: 'Algo paso, intenta otra vez o contacta con soporte', showConfirmButton: false, timer: 1740 });
              break;
            case 200:
              this.$store.commit('setusuario', { usuario: response.data, hora_login: new Date() });
              switch (response.data.rol) {
                case 'Admin':
                  this.$router.push('/inicio/estadisticas');
                  break;
                case 'Cobrador':
                  this.$router.push('/inicio/cobro');
                  break;
              }
              break;
          }
        }).catch(error => {
          console.log(error);
          this.closeSweet();
          Swal.fire({ icon: 'error', text: error.response.data.message, showConfirmButton: false, timer: 1600 });
        });
      } else {
        Swal.fire({ icon: 'error', text: 'Debes ingresar usuario y contraseña', showConfirmButton: false, timer: 1600 });
      }
    },
    loadingSweet() {
      Swal.fire({
        text: 'Autenticando, por favor, espere...',
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        customClass: {
          popup: 'loader'
        }
      });
    },
    closeSweet() {
      Swal.close();
    }
  },
  created() {
    console.log(process.env)
  }

}
</script>
<style>
body,
html {
  overflow-y: auto;
}

.login {
  width: 100%;
  height: 100%;
  min-width: 100%;
  min-height: 100%;
  background: url('../assets/login/fondom.png');
  background-size: cover;
  background-attachment: fixed;
  background-position: 50% 50%;
}
</style>
