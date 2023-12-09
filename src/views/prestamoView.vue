<template>
  <v-card>
    <v-card-title>
      <v-row justify="space-between" justify-sm="start" class="px-6 my-4">
        <v-col md="3" lg="2" sm="12" cols="auto">
          <v-row class="align-center">
            <v-icon size="x-large" icon="mdi mdi-tag-plus"></v-icon>
            <h1 class="px-3">Ventas</h1>
          </v-row>
        </v-col>
        <v-col sm="4" md="4" lg="6" cols="auto" class="text-sm-start text-md-end">
          <v-btn prepend-icon="mdi-plus" color="green" @click="dialogCliente = true;">Agregar cliente</v-btn>
        </v-col>
        <v-col sm="3" md="2" lg="2" cols="auto">
          <v-btn color="blue" prepend-icon="mdi mdi-plus" @click="dialogPrestamo = true">Crear venta</v-btn>
        </v-col>
        <v-col sm="4" md="3" lg="2" cols="auto">
          <v-btn color="yellow" prepend-icon="mdi mdi-cash-sync" @click="dialogAbonar = true">Venta antigua</v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-col md="6" sm="12">
      <v-text-field v-model="searchPrestamo" append-inner-icon="mdi-magnify" label="Buscar" variant="outlined"
        hide-details></v-text-field>
    </v-col>
    <v-data-table :headers="headers" :items="prestamos" :sort-by="[{ key: 'mora', order: 'asc' }]" class="elevation-1"
      :search="searchPrestamo" no-data-text="Sin ventas">
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.completado="{ value }">
        {{ value ? 'Completado' : 'Activo' }}
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.mora="{ value }">
        <v-chip :color="value ? 'red' : 'green'">
          {{ value ? 'Atrasado' : 'No' }}
        </v-chip>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.actions="{ item, index }">
        <v-icon size="small" class="me-2" @click="verPrestamoFunction(Object.assign({}, item))">
          mdi-eye
        </v-icon>
        <v-icon v-if="(!item.completado && item.producto.length == 0) || item.producto.length == 0" size="small"
          class="me-2" @click="dialogActualizarVenta(index)">
          mdi mdi-cash-plus
        </v-icon>
        <v-icon size="small" @click="eliminarPrestamo(item._id)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <nuevoCliente :dialogCliente="dialogCliente" @cerrarDialog="dialogCliente = false" @actualizarTodo="actualizarTodo" />
    <v-dialog v-model="dialogPrestamo" persistent width="700">
      <v-card>
        <v-card-title>
          Nueva venta
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="formPrestamo">
            <v-row>
              <v-col cols="12">
                <v-autocomplete label="Nombre del cliente" no-data-text="Sin clientes disponible para venta" return-object
                  :items="clientes" :item-title="(item => { return `${item.nombres} ${item.apellidos}` })"
                  variant="outlined" v-model="form.cliente" :rules="campoRules"></v-autocomplete>
              </v-col>
              <v-col md="6" cols="12">
                <v-autocomplete label="Producto" return-object no-data-text="Sin productos registrados"
                  item-value="producto._id" :items="productos" item-title="producto.nombre" variant="outlined"
                  v-model="form.producto" :rules="campoRules"></v-autocomplete>
              </v-col>
              <v-col md="6" cols="12">
                <v-text-field type="number" label="Cantidad" placeholder="Ingrese cantidad del producto" min="1"
                  variant="outlined" v-model="form.cantidad" :rules="cantidadRules"></v-text-field>
              </v-col>
              <v-col :cols="cols2[0]">
                <v-select label="Forma de pago" :items="formasPago" item-value="index" item-title="forma"
                  placeholder="Escoja forma de pago" variant="outlined" v-model="formaPago"
                  :rules="campoRules"></v-select>
              </v-col>
              <v-col :cols="cols2[1]" v-if="formaPago == 2">
                <v-text-field type="number" label="Cuotas" placeholder="Ingrese cantidad de cuotas" min="1"
                  variant="outlined" v-model="form.cuotas" :rules="cantidadRules"></v-text-field>
              </v-col>
              <v-col cols="12" v-if="formaPago == 2">
                <VueDatePicker format="yyyy-MM-dd" :rules="campoRules" :enable-time-picker="false" cancelText="Cancelar"
                  locale="es" selectText="Seleccionar" v-model="form.pago_fechas" multi-dates :min-date="new Date()"
                  placeholder="Selecciona fechas de pago" teleport-center @cleared="form.pago_fechas = []" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red-darken-1" variant="tonal" @click="dialogPrestamo = false">
            Cerrar
          </v-btn>
          <v-btn color="green-darken-1" variant="tonal" :disabled="disableBtn" @click="guardar">
            Crear
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogVePrestamo" persistent width="700">
      <v-card>
        <v-card-text>
          <v-container>
            <v-form>
              <v-row>
                <v-progress-linear v-model="skill" color="green" height="25">
                  <template v-slot:default="{ value }">
                    <strong>{{ Math.ceil(value) }}%</strong>
                  </template>
                </v-progress-linear>
                <v-col cols="12">
                  <v-text-field label="Documento" type="text" required variant="outlined"
                    v-model="verPrestamo.cliente.documento" disabled></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field variant="outlined" label="Nombre" disabled required
                    v-model="verPrestamo.cliente.nombres"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field variant="outlined" label="Apellido" disabled required
                    v-model="verPrestamo.cliente.apellidos"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field variant="outlined" label="Ruta" disabled required
                    v-model="verPrestamo.ruta"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field variant="outlined" label="Producto" disabled required
                    v-model="verPrestamo.producto"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field variant="outlined" label="Fecha de Inicio" disabled required
                    v-model="verPrestamo.fecha_inicio"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field variant="outlined" label="N° Cuotas" disabled required
                    v-model="verPrestamo.cuotas"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field variant="outlined" label="Cuotas atrasadas" disabled required
                    v-model="verPrestamo.cuotas_atrasadas"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field variant="outlined" label="Total" disabled required
                    v-model="verPrestamo.total"></v-text-field>
                </v-col>
                <v-card-text v-if="verPrestamo.cuotas !== 0">
                  <div class="font-weight-bold ms-1 mb-2">
                    Restante : ${{ calcularRestante(verPrestamo.abono, verPrestamo.total) }}
                  </div>
                  <div class="font-weight-bold ms-1 mb-2">
                    Abonado : ${{ calcularAbono(verPrestamo.abono) }}
                  </div>
                  <v-timeline density="compact" align="start">
                    <v-timeline-item v-for="monto in verPrestamo.abono" :key="monto" dot-color="green" size="x-small">
                      <div class="mb-4">
                        <div class="font-weight-normal">
                          <strong> Abono: ${{ monto.monto.toLocaleString() }} </strong>
                        </div>
                        <div>{{ formatDate(monto.fecha) }}</div>
                      </div>

                    </v-timeline-item>
                  </v-timeline>
                </v-card-text>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red-darken-1" variant="tonal" @click="dialogVePrestamo = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogAbonar" persistent width="700">
      <v-card>
        <v-card-title>Abonar a la venta</v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="formAbono">
              <v-row>
                <v-col md="6" lg="6" sm="12" cols="12">
                  <v-autocomplete v-model="abonar.ruta" :items="rutas" item-title="nombre" item-value="_id"
                    :rules="campoRules" label="Barrio" variant="outlined"></v-autocomplete>
                </v-col>
                <v-col md="6" lg="6" sm="12" cols="12">
                  <v-text-field v-model="abonar.direccionResidencia" :rules="campoRules" label="Dirección"
                    variant="outlined"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="abonar.nombres" :rules="campoRules" label="Nombres cliente"
                    variant="outlined"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="abonar.apellidos" :rules="campoRules" label="Apellidos"
                    variant="outlined"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="abonar.documento" hint="Sin puntos o comas (. ,)" persistent-hint
                    :rules="cantidadRules" label="Documento" type="number" variant="outlined"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="abonar.telefono" hint="Sin puntos o comas (. ,)" persistent-hint
                    :rules="cantidadRules" label="Número celular" type="tel" variant="outlined"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="abonar.correo" label="Correo" type="email" variant="outlined"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete label="Producto" no-data-text="Sin productos registrados" item-value="producto.nombre"
                    :items="productos" item-title="producto.nombre" variant="outlined" v-model="abonar.producto"
                    :rules="campoRules"></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-select v-model="formaPago" :items="formasPago" item-title="forma" item-value="index"
                    :rules="campoRules" label="Forma de pago" variant="outlined"></v-select>
                </v-col>
                <v-col cols="12">
                  <VueDatePicker format="yyyy-MM-dd" :rules="campoRules" :enable-time-picker="false" cancelText="Cancelar"
                    locale="es" selectText="Seleccionar" v-model="fVenta" placeholder="Selecciona fecha de venta"
                    teleport-center @cleared="fVenta = null" />
                </v-col>
                <v-row v-if="formaPago != 1" class="pa-3">
                  <v-col cols="12">
                    <v-text-field v-model="abonar.cuotas" hint="Sin puntos o comas (. ,)" persistent-hint
                      :rules="cantidadRules" label="Cantidad de cuotas" type="number" variant="outlined"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <VueDatePicker format="yyyy-MM-dd" :rules="campoRules" :enable-time-picker="false"
                      cancelText="Cancelar" locale="es" selectText="Seleccionar" v-model="abonar.pago_fechas" multi-dates
                      :min-date="new Date()" placeholder="Selecciona fechas de pago" teleport-center
                      @cleared="abonar.pago_fechas = []" />
                  </v-col>
                </v-row>
                <v-col cols="12">
                  <v-text-field v-model="abonar.total" hint="Sin puntos o comas (. ,)" persistent-hint
                    :rules="cantidadRules" label="Total venta" type="number" variant="outlined"></v-text-field>
                </v-col>
              </v-row>
              <div v-if="formaPago == 2" class="mt-9">
                <v-row>
                  <v-col md="6" lg="6" sm="12" cols="12">
                    <v-text-field v-model="abonoAdd" hint="Sin puntos o comas (. ,)" persistent-hint density="compact"
                      :rules="cantidadRules" label="Monto" placeholder="Ingrese monto a abonar" type="number"
                      variant="outlined"></v-text-field>
                  </v-col>
                  <v-col md="6" lg="6" sm="12" cols="12">
                    <VueDatePicker format="yyyy-MM-dd" :rules="campoRules" :enable-time-picker="false"
                      cancelText="Cancelar" locale="es" selectText="Seleccionar" v-model="fechaAdd"
                      :min-date="new Date(fVenta)" placeholder="Selecciona fecha del abono" teleport-center
                      @cleared="fechaAdd = null" />
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-btn color="blue" prepend-icon="mdi mdi-plus" @click="agregarAbono">
                    Agregar abono
                  </v-btn>
                </v-row>
              </div>
            </v-form>
            <v-data-table v-if="formaPago == 2" :headers="headersAbonos" :items="abonosTabla"
              class="elevation-3 pa-3 mt-5" no-data-text="Sin abonos">
              <template v-slot:top>
                <v-row justify="end" class="pa-2">
                  <v-col cols="4">
                    <h3><strong>Total: </strong>{{ totalAbonos }}</h3>
                  </v-col>
                </v-row>
              </template>
              <!-- eslint-disable-next-line vue/valid-v-slot -->
              <template v-slot:item.actions="{ index }">
                <v-icon size="small" @click="eliminarAbono(index)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
            <v-row justify="center" class="pa-4 mt-3">
              <v-btn color="green" :disabled="disableBtnAbonos" @click="guardarAbonos">
                Guardar venta
              </v-btn>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red-darken-1" variant="tonal" @click="dialogAbonar = false">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogVentaAntigua" persistent width="700">
      <v-card>
        <v-card-title>Actualizar venta</v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="formVentaAntigua">
              <v-row>
                <v-col md="12" lg="12" sm="12" cols="12">
                  <v-autocomplete v-model="actualizarVentaAntigua.ruta" :items="rutas" item-title="nombre"
                    item-value="nombre" :rules="campoRules" label="Barrio" variant="outlined"></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete label="Producto" no-data-text="Sin productos registrados" item-value="producto.nombre"
                    :items="productos" item-title="producto.nombre" variant="outlined"
                    v-model="actualizarVentaAntigua.producto" :rules="campoRules"></v-autocomplete>
                </v-col>
                <v-row v-if="actualizarVentaAntigua.resta > 0">
                  <v-col cols="12">
                    <div class="font-weight-bold ms-1 mb-2">
                      Resta por pagar: ${{ actualizarVentaAntigua.resta.toLocaleString() }}
                    </div>
                    <v-text-field type="number" min="1" label="Cuotas" variant="outlined"
                      v-model="actualizarVentaAntigua.cuotas" :rules="cantidadRules"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <VueDatePicker format="yyyy-MM-dd" :rules="campoRules" :enable-time-picker="false"
                      cancelText="Cancelar" locale="es" selectText="Seleccionar" :min-date="new Date()" multi-dates
                      v-model="actualizarVentaAntigua.fechas_pago" placeholder="Selecciona fechas de pago" teleport-center
                      @cleared="actualizarVentaAntigua.fechas_pago = []" />
                  </v-col>
                </v-row>

              </v-row>
            </v-form>
            <v-row justify="center" class="pa-4 mt-3">
              <v-btn color="yellow" :disabled="disableBtnAbonos" @click="actualizarVenta">
                Actualizar venta
              </v-btn>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red-darken-1" variant="tonal" @click="dialogVentaAntigua = false">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import Session from "@/validation/session";
import Swal from "sweetalert2";
import axios from "axios";
import nuevoCliente from "@/components/nuevoCliente.vue";
export default {
  name: "prestamoVista",
  components: { nuevoCliente },
  data: () => ({
    token: null,
    api: import.meta.env.VITE_APP_API_URL,
    valid: true,
    disableBtn: false,
    disableBtnAbonos: false,
    dialogPrestamo: false,
    dialogCliente: false,
    dialogVePrestamo: null,
    dialogAbonar: false,
    dialogVentaAntigua: false,
    formaPago: null,
    form: {
      cliente: null,
      ruta: null,
      producto: null,
      fecha_inicio: '',
      cantidad: 1,
      cuotas: 1,
      pago_fechas: [],
      total: 0
    },
    verPrestamo: {
      abono: null,
      mora: null,
      _id: null,
      cliente: {
        _id: null,
        documento: null,
        nombres: null,
        apellidos: null,
        telefono: null,
        correo: null,
        direccion: null,
        mora: null,
        __v: null
      },
      ruta: null,
      producto: null,
      fecha_inicio: null,
      cuotas: null,
      pago_fechas: [
        {
          fecha: null,
          monto: null
        }
      ],
      cuotas_atrasadas: null,
      completado: null,
      total: null,
    },
    fVenta: null,
    abonar: {
      ruta: null,
      rutaPlana: null,
      direccionResidencia: null,
      nombres: null,
      apellidos: null,
      documento: null,
      telefono: null,
      correo: '',
      producto: null,
      fechaVenta: null,
      pago_fechas: [],
      abonos: [],
      cuotas: 1,
      total: 0
    },
    fVentaAntigua: [],
    actualizarVentaAntigua: {
      venta: null,
      resta: 0,
      ruta: null,
      producto: null,
      cuotas: 1,
      fechas_pago: []
    },
    rutas: [],
    abonosTabla: [],
    abonoAdd: 0,
    fechaAdd: null,
    campoRules: [v => !!v || 'Campo requerido'],
    cantidadRules: [
      v => !!v || 'Campo requerido',
      v => parseInt(v) > 0 || 'Ingrese una cantidad mayor a 0'
    ],
    headers: [
      { title: 'Documento', key: 'cliente.documento' },
      { title: 'Nombre', key: 'cliente.nombres' },
      { title: 'Apellido', key: 'cliente.apellidos' },
      { title: 'Ruta', key: 'ruta' },
      { title: 'Producto', key: 'producto' },
      { title: 'Cuotas', key: 'cuotas' },
      { title: 'Atrasado', key: 'mora' },
      { title: 'Completado', key: 'completado' },
      { title: 'Accion', key: 'actions', sortable: false },
    ],
    headersAbonos: [
      { title: 'Monto', key: 'monto' },
      { title: 'Fecha pago', key: 'fecha' },
      { title: 'Accion', key: 'actions', sortable: false },
    ],
    clientes: [],
    productos: [],
    prestamos: [],
    searchPrestamo: null,
    diasSemana: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    formasPago: [{ index: 1, forma: 'De contado' }, { index: 2, forma: 'A crédito' }]
  }),
  methods: {
    dialogActualizarVenta(index) {
      this.actualizarVentaAntigua.venta = this.prestamos[index]._id;
      this.actualizarVentaAntigua.resta = this.prestamos[index].total - this.prestamos[index].abono.reduce((acumulador, value) => parseInt(acumulador) + parseInt(value.monto), 0);
      this.actualizarVentaAntigua.ruta = this.prestamos[index].ruta;
      this.actualizarVentaAntigua.producto = null;
      this.dialogVentaAntigua = true;
    },
    async actualizarVenta() {
      const { valid } = await this.$refs.formVentaAntigua.validate();
      if (valid) {
        this.actualizarVentaAntigua.cuotas = parseInt(this.actualizarVentaAntigua.cuotas);
        if (!this.actualizarVentaAntigua.ruta || !this.actualizarVentaAntigua.producto) {
          return Swal.fire({ icon: 'warning', text: 'Debes seleccionar un barrio y un producto', showConfirmButton: false, timer: 1690 });
        }
        else if (this.actualizarVentaAntigua.resta != 0 && this.actualizarVentaAntigua.fechas_pago.length != this.actualizarVentaAntigua.cuotas) {
          return Swal.fire({ icon: 'warning', text: 'Las fechas de pago deben ser iguales a la cantidad de cuotas', showConfirmButton: false, timer: 1690 });
        }
        const paquete = {
          venta: this.actualizarVentaAntigua.venta,
          ruta: this.actualizarVentaAntigua.ruta,
          producto: this.actualizarVentaAntigua.producto,
          cuotas: 0,
          fechas_pago: []
        }
        if (this.actualizarVentaAntigua.resta > 0) {
          const montoSugerido = Math.ceil(this.actualizarVentaAntigua.resta / this.actualizarVentaAntigua.cuotas);
          paquete.fechas_pago = this.ordenarFechas(this.actualizarVentaAntigua.fechas_pago);
          paquete.fechas_pago = paquete.fechas_pago.map(pago => {
            return {
              fecha: `${pago.getFullYear()}-${((parseInt(pago.getMonth()) + 1) < 10 ? '0' : '') + (parseInt(pago.getMonth()) + 1)}-${(parseInt(pago.getDate()) < 10 ? '0' : '') + parseInt(pago.getDate())}T00:00:00-05:00`,
              monto: montoSugerido
            }
          });
          paquete.cuotas = this.actualizarVentaAntigua.cuotas;
        }
        await axios.put(`${this.api}/prestamo/actualizarVenta`, paquete, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }).then(response => {
          Swal.fire({
            icon: response.data.status ? 'success' : 'error',
            text: response.data.message,
            showConfirmButton: false,
            timer: 1600
          });
          if (response.data.status) {
            this.$refs.formVentaAntigua.reset();
            this.actualizarVentaAntigua.fechas_pago = [];
            this.dialogVentaAntigua = false;
            this.actualizarTodo();
          }

        }).catch(error => {
          switch (error.response.status) {
            case 401:
              Session.expiredSession();
              break;
            default:
              Swal.fire({
                icon: 'info',
                text: 'No se pudo actualizar la venta',
                showConfirmButton: false,
                timer: 1600
              });
              break;
          }
        });
      }

    },
    eliminarAbono(index) {
      this.abonar.abonos.splice(index, 1);
      this.abonosTabla.splice(index, 1);
      this.disableBtnAbonos = this.abonar.abonos.length == 0;
    },
    agregarAbono() {
      if (this.$refs.formAbono.validate()) {
        if (this.abonoAdd > 0 && this.fechaAdd) {
          this.disableBtnAbonos = false;
          const nFecha = new Date(`${this.fechaAdd.getFullYear()}-${this.fechaAdd.getMonth() + 1}-${this.fechaAdd.getDate()}`);
          this.abonosTabla.push({ fecha: nFecha.toISOString().slice(0, 10), monto: this.abonoAdd });
          this.abonar.abonos.push({ fecha: nFecha.toISOString().toString(), monto: parseFloat(this.abonoAdd) });
          this.fechaAdd = null;
          this.abonoAdd = 0;
        }
      }
    },
    async guardarAbonos() {
      if (this.$refs.formAbono.validate()) {
        const c = parseInt(this.abonar.abonos.length + parseInt(this.abonar.cuotas));
        const i = this.rutas.findIndex(ruta => ruta._id == this.abonar.ruta);
        this.abonar.rutaPlana = this.rutas[i].nombre;
        this.abonar.total = parseInt(this.abonar.total);
        this.abonar.documento = parseInt(this.abonar.documento);
        const fV = this.fVenta;

        this.disableBtnAbonos = true;
        if (this.formaPago == 2) {
          if (this.abonar.pago_fechas.length == this.abonar.cuotas) {
            if (this.totalAbonos <= this.abonar.total) {
              const mS = Math.ceil((this.abonar.total - this.totalAbonos) / c)
              this.abonar.pago_fechas = this.abonar.pago_fechas.map(fecha => {
                const f = new Date(`${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}`);
                return {
                  fecha: f.toISOString().toString(),
                  monto: mS
                }
              });
              this.abonar.cuotas = parseInt(this.abonar.abonos.length + parseInt(this.abonar.cuotas));
              this.abonar.pago_fechas = [...this.abonar.abonos, ...this.abonar.pago_fechas];
              this.abonar.fechaVenta = new Date(`${fV.getFullYear()}-${fV.getMonth() + 1}-${fV.getDate()}`).toISOString().toString();

              await axios.post(`${this.api}/prestamo/abonar`, this.abonar, {
                headers: {
                  Authorization: `Bearer ${this.token}`
                }
              }).then(response => {
                if (response.data) {
                  this.abonar = {
                    ruta: null,
                    rutaPlana: null,
                    direccionResidencia: null,
                    nombres: null,
                    apellidos: null,
                    documento: null,
                    telefono: null,
                    correo: '',
                    producto: null,
                    fechaVenta: null,
                    pago_fechas: [],
                    abonos: [],
                    cuotas: 1,
                    total: 0
                  };
                  this.formaPago = null;
                  this.fVenta = null;
                  this.abonosTabla = [];
                  this.getPrestamos();
                  Swal.fire({ icon: 'success', text: 'Abonos agregados correctamente', showConfirmButton: false, timer: 1600 });
                } else {
                  Swal.fire({ icon: 'error', text: 'No se pudieron agregar los abonos', showConfirmButton: false, timer: 1650 });
                }
              }).catch(error => {
                Swal.fire({ icon: 'error', text: 'No se pudieron agregar los abonos', showConfirmButton: false, timer: 1650 });
                console.log(error);
              });

            } else {
              Swal.fire({ icon: 'info', text: "El total debe ser menor o igual al total de la venta", showConfirmButton: false, timer: 1600 });
            }
          } else {
            Swal.fire({ icon: "info", text: "La cantidad de fechas de pago debe ser igual a la cantidad de cuotas", showConfirmButton: false, timer: 1600 });
          }
        } else {
          this.abonar.cuotas = 0;
          const i = this.rutas.findIndex(ruta => ruta._id == this.abonar.ruta);
          this.abonar.rutaPlana = this.rutas[i].nombre;
          this.abonar.total = parseInt(this.abonar.total);
          this.abonar.documento = parseInt(this.abonar.documento);
          this.abonar.fechaVenta = new Date(`${fV.getFullYear()}-${fV.getMonth() + 1}-${fV.getDate()}`).toISOString().toString();
          this.abonar.pago_fechas = [];
          this.abonar.abonos = [];
          await axios.post(`${this.api}/prestamo/abonar`, this.abonar, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).then(response => {
            if (response.data) {
              this.abonar = {
                ruta: null,
                rutaPlana: null,
                direccionResidencia: null,
                nombres: null,
                apellidos: null,
                documento: null,
                telefono: null,
                correo: '',
                producto: null,
                fechaVenta: null,
                pago_fechas: [],
                abonos: [],
                cuotas: 1,
                total: 0
              };
              this.formaPago = null;
              this.fVenta = null;
              this.abonosTabla = [];
              Swal.fire({ icon: 'success', text: 'Abonos agregados correctamente', showConfirmButton: false, timer: 1600 });
            } else {
              Swal.fire({ icon: 'error', text: 'No se pudieron agregar los abonos', showConfirmButton: false, timer: 1650 });
            }
          }).catch(error => {
            Swal.fire({ icon: 'error', text: 'No se pudieron agregar los abonos', showConfirmButton: false, timer: 1650 });
            console.log(error);
          });
        }
      }
      this.disableBtnAbonos = false;
    },
    calcularAbono(abono) {
      let abonoTotal = 0;
      abono.forEach(abono => {
        abonoTotal += abono.monto;
      })
      return abonoTotal.toLocaleString();
    },
    calcularRestante(abono, total) {
      let abonoTotal = 0;
      abono.forEach(abono => {
        abonoTotal += abono.monto;
      });
      return (total - abonoTotal).toLocaleString();
    },
    formatDate(value) {
      const date = new Date(value);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      return `${year}-${month}-${day} | ${hours}:${minutes}:${seconds}`;
    },
    async getClientes() {
      await axios.get(`${this.api}/prestamo/clientes`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(resp => {
        this.clientes = resp.data;
      }).catch(error => {
        switch (error.response.status) {
          case 401:
            Session.expiredSession();
            break;
          default:
            Swal.fire({
              icon: 'info',
              text: 'No se pudo obtener los clientes',
              showConfirmButton: false,
              timer: 1600
            });
            break;
        }
      });
    },
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
    async getPrestamos() {
      await axios.get(`${this.api}/prestamo`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(resp => {
        this.prestamos = resp.data;
      }).catch(error => {
        switch (error.response.status) {
          case 401:
            Session.expiredSession();
            break;
          default:
            Swal.fire({
              icon: 'info',
              text: 'No se pudo obtener los prestamos',
              showConfirmButton: false,
              timer: 1600
            });
            break;
        }
      });
    },
    async llenarMes(anio, mes, dia) {
      const infoMes = [];
      let fechaActual = new Date(anio, mes, dia);
      const mesSig = new Date(anio, mes + 1, 1);
      mesSig.setDate(mesSig.getDate() - 1);
      const ultimoDiaMes = mesSig.getDate();
      const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
      let numSemana;
      const fechaAux = fechaActual;
      for (let i = fechaActual.getDate(); i <= ultimoDiaMes; i++) {
        fechaAux.setDate(i);
        numSemana = Math.ceil((fechaAux.getDate() + primerDiaMes.getDay()) / 7);
        infoMes.push({ semana: numSemana, dia: i, diaTexto: this.diasSemana[fechaAux.getDay()] });
      }
      return infoMes;
    },
    async calcularPagos(frecuenciaCobro = 'diario', cuotas = 1, semana = '', quincena = {}, mensual = {}) {
      const fechaPagos = [];
      const fechaActual = new Date();
      const diaActual = fechaActual.getDay();
      let diaFrecuencia = 0;
      const milisDia = 24 * 60 * 60 * 1000;
      let aumentoDias = 1;
      let sinComplex = true, mesV;

      switch (frecuenciaCobro.toLowerCase()) {
        case 'diario':
          sinComplex = true;
          aumentoDias = 1;
          break;
        case 'semanal':
          sinComplex = true;
          diaFrecuencia = this.diasSemana.findIndex(dia => dia.toLowerCase() == semana.toLowerCase());
          if (diaActual > diaFrecuencia) {
            console.log('mayor');
            aumentoDias = 7 - (diaActual - diaFrecuencia);
          } else if (diaActual < diaFrecuencia) {
            console.log('menor');
            aumentoDias = diaFrecuencia - diaActual;
          } else {
            aumentoDias = 7;
          }
          break;
        case 'quincenal':
          sinComplex = false;
          fechaActual.setDate(fechaActual.getDate() + 1);
          while (fechaPagos.length < cuotas) {
            mesV = await this.llenarMes(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
            mesV.filter(mes => {
              if (quincena.semanas.includes(mes.semana) && mes.diaTexto.toLowerCase() == quincena.dia.toLowerCase() && fechaPagos.length < cuotas) {
                fechaPagos.push({ fecha: `${fechaActual.getFullYear()}-${((fechaActual.getMonth() + 1) < 10 ? '0' : null) + parseInt(fechaActual.getMonth() + 1)}-${(mes.dia < 10 ? '0' : null) + mes.dia}` });
              }
              return false;
            });
            fechaActual.setDate(1);
            fechaActual.setMonth(fechaActual.getMonth() + 1);
          }
          break;
        case 'mensual':
          sinComplex = false;
          fechaActual.setDate(fechaActual.getDate() + 1);
          while (fechaPagos.length < cuotas) {
            mesV = await this.llenarMes(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
            mesV.filter(mes => {
              if (mensual.semanas == mes.semana && mes.diaTexto.toLowerCase() == mensual.dia.toLowerCase() && fechaPagos.length < cuotas) {
                fechaPagos.push({ fecha: `${fechaActual.getFullYear()}-${((fechaActual.getMonth() + 1) < 10 ? '0' : null) + parseInt(fechaActual.getMonth() + 1)}-${(mes.dia < 10 ? '0' : null) + mes.dia}` });
              }
              return false;
            });
            fechaActual.setDate(1);
            fechaActual.setMonth(fechaActual.getMonth() + 1);
          }
          break;
      }
      if (sinComplex) {
        while (fechaPagos.length < cuotas) {
          fechaActual.setTime(fechaActual.getTime() + (aumentoDias * milisDia));
          //No es domingo
          if (fechaActual.getDay() != 0) {
            fechaPagos.push({ fecha: `${fechaActual.getFullYear()}-${((fechaActual.getMonth() + 1) < 10 ? '0' : null) + parseInt(fechaActual.getMonth() + 1)}-${(fechaActual.getDate() < 10 ? '0' : '') + fechaActual.getDate()}` });
            switch (frecuenciaCobro.toLowerCase()) {
              case 'diario':
                aumentoDias = 1;
                break;

              case 'semanal':
                aumentoDias = 7;
                break;
            }
          }
        }
      }
      return fechaPagos;
    },
    async guardar() {
      const { valid } = await this.$refs.formPrestamo.validate();
      if (valid) {
        this.form.cantidad = parseInt(this.form.cantidad);
        this.form.cuotas = parseInt(this.form.cuotas);
        let total, pagos = [];
        if (this.formaPago == 2 && this.form.pago_fechas.length != this.form.cuotas) {
          return Swal.fire({ icon: 'warning', text: 'Las fechas de pago deben ser iguales a la cantidad de cuotas', showConfirmButton: false, timer: 1690 });
        }
        if (this.form.cantidad <= this.form.producto.existencias) {
          this.disableBtn = true;
          if (this.form.pago_fechas.length > 1) {
            this.form.pago_fechas = this.ordenarFechas(this.form.pago_fechas);
          }
          if (parseInt(this.formaPago) == 1) {
            total = this.form.cantidad * this.form.producto.producto.valor_contado;
            this.form.cuotas = 0;
          } else {
            total = this.form.cantidad * this.form.producto.producto.valor_credito;
            const cuotaBase = Math.ceil(total / this.form.cuotas); //Redondeo hacia arriba
            const valorCuota = Math.floor(cuotaBase / 100) * 100; //Redondeo hacia abajo, con parte entera de 100
            const restVal = Math.round((cuotaBase - valorCuota) * this.form.cuotas); //Diferencia, con redondeo al más cercano
            pagos = this.form.pago_fechas.map((pago, index) => {
              return index == 0 ? { fecha: pago, monto: valorCuota + restVal } : { fecha: pago, monto: valorCuota };
            });
          }
          const paquete = {
            cliente: this.form.cliente._id, //`${this.form.cliente.nombres} ${this.form.cliente.apellidos}`,
            ruta: this.form.cliente.direccion.nombre,
            producto: this.form.producto.producto.nombre, //ObjectId del inventario
            inventario: this.form.producto._id,
            fecha_inicio: new Date().toISOString(),
            cantidad: this.form.cantidad,
            cuotas: this.form.cuotas,
            pago_fechas: pagos,
            total: total
          }
          await axios.post(`${this.api}/prestamo/crear`, paquete, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).then(() => {
            this.form.pago_fechas = [];
            this.$refs.formPrestamo.reset();
            Swal.fire({
              icon: 'success',
              text: 'Venta registrada correctamente',
              showConfirmButton: false,
              timer: 1710
            });
            this.dialogPrestamo = false;
          }).catch(error => {
            switch (error.response.status) {
              case 401:
                Session.expiredSession();
                break;
              default:
                Swal.fire({
                  icon: 'info',
                  text: 'No se pudo crear la venta',
                  showConfirmButton: false,
                  timer: 1710
                });
                break;
            }
          });
        } else {
          this.disableBtn = false;
          return Swal.fire({ icon: 'warning', text: `No hay suficientes ${this.form.producto.producto.nombre}, sólo hay ${this.form.producto.existencias}`, showConfirmButton: false, timer: 1600 })
        }
      }
      this.disableBtn = false;
      await this.actualizarTodo();
    },
    async eliminarPrestamo(id) {
      Swal.fire({
        icon: 'info',
        title: 'Seguro quiere eliminar la venta?',
        showDenyButton: true,
        denyButtonText: 'No',
        confirmButtonText: 'Eliminar',
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          await axios.delete(`${this.api}/prestamo/${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).then(async () => {
            await this.getClientes();
            await this.getPrestamos();
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
              text: 'No se pudo eliminar la venta',
              showConfirmButton: false,
              timer: 1600
            });
            break;
        }
      });
    },
    verPrestamoFunction(item) {
      this.verPrestamo = item;
      this.verPrestamo.fecha_inicio = this.formatDate(this.verPrestamo.fecha_inicio);
      this.dialogVePrestamo = true;
    },
    ordenarFechas(fechas = []) {
      const fechasDate = fechas.map(fecha => new Date(fecha));
      fechasDate.sort((f1, f2) => f1 - f2);
      return fechasDate;
    },
    async actualizarTodo() {
      await this.getClientes();
      await this.getProductosInventario();
      await this.getPrestamos();
    },
    async getRutas() {
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
  },
  computed: {
    cols2() {
      //Para que los input del modal sean responsive
      const { xxl, xl, lg, md } = this.$vuetify.display;
      let resp = [12, 12];
      if (xxl || xl || lg || md) {
        resp = [6, 6];
      }
      return resp;
    },
    skill() {
      let abonado = 0;
      this.verPrestamo.abono.forEach(abono => {
        abonado += abono.monto;
      })
      if (this.verPrestamo.cuotas == 0) {
        return 100;
      }
      return ((abonado * 100) / this.verPrestamo.total);
    },
    totalAbonos() {
      let total = 0;
      this.abonosTabla.forEach(abono => total += parseInt(abono.monto));
      return total;
    }
  },
  async created() {
    const invalid = await Session.expiredSession();
    if (!invalid) {
      this.token = this.$store.getters.usuario.usuario.access_token;
      this.$emit('loadingSweet');
      await this.getRutas();
      await this.getClientes();
      await this.getProductosInventario();
      await this.getPrestamos();
      this.$emit('closeSweet');
    }
  },
};
</script>
