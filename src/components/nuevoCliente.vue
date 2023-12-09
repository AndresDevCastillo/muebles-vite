<template>
  <v-dialog v-model="this.$props.dialogCliente" persistent width="700">
    <v-card>
      <v-card-title>Nuevo Cliente</v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="formCliente">
            <v-row>
              <v-col cols="12">
                <v-text-field label="Documento" type="number" min="1" required hint="Sin comas o puntos (, .)"
                  persistent-hint variant="outlined" v-model="formCliente.documento" :rules="numberRules"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Nombres" type="text" required variant="outlined" v-model="formCliente.nombres"
                  :rules="nombreRules"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Apellidos" type="text" required variant="outlined" v-model="formCliente.apellidos"
                  :rules="nombreRules"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Teléfono" type="tel" required variant="outlined" v-model="formCliente.telefono"
                  :rules="nombreRules"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Correo" type="email" required variant="outlined" v-model="formCliente.correo"
                  :rules="nombreRules"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete :items="rutas" return-object variant="outlined" label="Ruta" required
                  v-model="formCliente.direccion" item-title="nombre" item-value="_id"
                  :rules="[v => !!v || 'Seleccione una ruta']" no-data-text="No hay rutas"></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Dirección" type="text" required variant="outlined"
                  v-model="formCliente.direccionResidencia" placeholder="Dirección de la vivienda"
                  :rules="campoRules"></v-text-field>
              </v-col>
              <v-divider></v-divider>
              <v-col cols="12">
                <h3>Información de la venta</h3>
              </v-col>
              <v-col md="6" cols="12">
                <v-autocomplete label="Producto" return-object no-data-text="Sin productos registrados"
                  item-value="producto._id" :items="productos" item-title="producto.nombre" variant="outlined"
                  v-model="formCliente.venta.producto" :rules="campoRules"></v-autocomplete>
              </v-col>
              <v-col md="6" cols="12">
                <v-text-field type="number" label="Cantidad" placeholder="Ingrese cantidad del producto" min="1"
                  variant="outlined" v-model="formCliente.venta.cantidad" :rules="cantidadRules"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select label="Forma de pago" :items="formasPago" item-value="index" item-title="forma"
                  placeholder="Escoja forma de pago" variant="outlined" v-model="formaPago"
                  :rules="campoRules"></v-select>
              </v-col>
              <v-col cols="6" v-if="formaPago == 2">
                <v-text-field type="number" label="Cuotas" placeholder="Ingrese cantidad de cuotas" min="1"
                  variant="outlined" v-model="formCliente.venta.cuotas" :rules="cantidadRules"></v-text-field>
              </v-col>
              <v-col cols="12" v-if="formaPago == 2">
                <VueDatePicker format="yyyy-MM-dd" :rules="campoRules" :enable-time-picker="false" cancelText="Cancelar"
                  locale="es" selectText="Seleccionar" v-model="formCliente.venta.pago_fechas" multi-dates
                  :min-date="new Date()" placeholder="Selecciona fechas de pago" teleport-center
                  @cleared="formCliente.venta.pago_fechas = []" />
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="red-darken-1" variant="tonal" @click="cerrarDialogCliente">
          Cerrar
        </v-btn>
        <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="crearCliente">
          Crear
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import Session from '@/validation/session';
export default {
  name: 'clienteComponent',
  props: { dialogCliente: { type: Boolean, default: false } },
  data: () => ({
    api: import.meta.env.VITE_APP_API_URL,
    disableBtn: false,
    token: null,
    rutas: [],
    productos: [],
    formasPago: [{ index: 1, forma: 'De contado' }, { index: 2, forma: 'A crédito' }],
    formaPago: null,
    nombreRules: [
      v => !!v || 'El campo es requerido',
      v => (v && v.length <= 65) || 'El campo no puede superar los 65 caracteres',
    ], usuarioRules: [
      v => !!v || 'El usuario es requerido',
      v => (v && v.length > 3) || 'EL nombre debe tener mínimo 4 caracteres',
    ],
    cantidadRules: [
      v => !!v || 'Campo requerido',
      v => parseInt(v) > 0 || 'Ingrese una cantidad mayor a 0'
    ],
    campoRules: [v => !!v || 'Campo requerido',],
    numberRules: [v => !!v || 'La cédula es requerida', v => (v && /^[0-9]+$/ig.test(v)) || 'El número no debe contener caracteres sólo números'],
    formCliente: {
      documento: null,
      nombres: null,
      apellidos: null,
      telefono: null,
      correo: null,
      direccion: null,
      direccionResidencia: null,
      venta: {
        producto: null,
        cantidad: 1,
        cuotas: 1,
        fecha_inicio: null,
        pago_fechas: [],
        total: 0
      }
    },

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
    async crearCliente() {
      const { valid } = await this.$refs.formCliente.validate();
      if (valid) {
        this.formCliente.venta.cantidad = parseInt(this.formCliente.venta.cantidad);
        this.formCliente.venta.cuotas = parseInt(this.formCliente.venta.cuotas);
        this.formCliente.documento = parseInt(this.formCliente.documento);
        let total, pagos = [];
        if (this.formaPago == 2 && this.formCliente.venta.pago_fechas.length != this.formCliente.venta.cuotas) {
          return Swal.fire({ icon: 'warning', text: 'Las fechas de pago deben ser iguales a la cantidad de cuotas', showConfirmButton: false, timer: 1690 });
        }
        if (this.formCliente.venta.cantidad <= this.formCliente.venta.producto.existencias) {
          this.disableBtn = true;
          if (this.formCliente.venta.pago_fechas.length > 1) {
            this.formCliente.venta.pago_fechas = this.ordenarFechas(this.formCliente.venta.pago_fechas);
          }
          if (parseInt(this.formaPago) == 1) {
            total = this.formCliente.venta.cantidad * this.formCliente.venta.producto.producto.valor_contado;
            this.formCliente.venta.cuotas = 0;
          } else {
            total = this.formCliente.venta.cantidad * this.formCliente.venta.producto.producto.valor_credito;
            const cuotaBase = Math.ceil(total / this.formCliente.venta.cuotas); //Redondeo hacia arriba
            const valorCuota = Math.floor(cuotaBase / 100) * 100; //Redondeo hacia abajo, con parte entera de 100
            const restVal = Math.round((cuotaBase - valorCuota) * this.formCliente.venta.cuotas); //Diferencia, con redondeo al más cercano
            pagos = this.formCliente.venta.pago_fechas.map((pago, index) => {
              return index == 0 ? { fecha: pago, monto: valorCuota + restVal } : { fecha: pago, monto: valorCuota };
            });
          }
          delete this.formCliente.direccion.__v;
          delete this.formCliente.direccion.ciudad;
          delete this.formCliente.direccion.departamento;
          const paquete = {
            documento: this.formCliente.documento,
            nombres: this.formCliente.nombres,
            apellidos: this.formCliente.apellidos,
            telefono: this.formCliente.telefono,
            correo: this.formCliente.correo,
            direccion: this.formCliente.direccion,
            venta: {
              inventario: this.formCliente.venta.producto._id,
              producto: this.formCliente.venta.producto.producto.nombre,
              cantidad: this.formCliente.venta.cantidad,
              cuotas: this.formCliente.venta.cuotas,
              fecha_inicio: new Date(),
              pago_fechas: pagos,
              total: total
            }
          }
          await axios.post(`${this.api}/cliente/crear`, paquete, {
            headers: {
              Authorization: `Bearer ${this.token}`
            },
          }).then(() => {
            this.$refs.formCliente.reset();
            this.formCliente.venta.pago_fechas = [];
            return Swal.fire({ icon: 'success', text: 'Cliente creado correctamente', showConfirmButton: false, timer: 1500 });
          }).catch(error => {
            switch (error.response.status) {
              case 401:
                Session.expiredSession();
                break;
              case 500:
                Swal.fire({
                  icon: 'warning',
                  title: 'No se pudo crear el cliente',
                  text: error.response.data.message.message,
                  showConfirmButton: false,
                  timer: 1600
                });
                break;
              default:
                Swal.fire({
                  icon: 'info',
                  text: 'No se pudo crear el cliente',
                  showConfirmButton: false,
                  timer: 1600
                });
                break;
            }
          });
          await this.getProductosInventario();
          await this.obtenerRutas()
          this.$emit('actualizarTodo');
          this.disableBtn = false;
        } else {
          Swal.fire({ icon: 'warning', text: `No hay suficientes ${this.formCliente.venta.producto.producto.nombre}, sólo hay ${this.formCliente.venta.producto.existencias}`, showConfirmButton: false, timer: 1710 });
        }
      }

    },
    ordenarFechas(fechas = []) {
      const fechasDate = fechas.map(fecha => new Date(fecha));
      fechasDate.sort((f1, f2) => f1 - f2);
      return fechasDate;
    },
    cerrarDialogCliente() {
      this.$emit('cerrarDialog');
    }
  },
  async created() {
    const invalid = await Session.expiredSession();
    if (!invalid) {
      this.token = this.$store.getters.usuario.usuario.access_token;
      await this.getProductosInventario();
      await this.obtenerRutas();
    }
  }
}
</script>
