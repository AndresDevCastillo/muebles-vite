<template>
  <div class="ganancias gananciasF">
    <v-row class="ma-6 mb-6">
      <v-col cols="12"><v-card class="w-100 d-flex gananciasF">
          <v-container>
            <v-row dense>
              <v-col md="4">
                <div class="col-xxl-4 col-md-6">
                  <div class="card revenue-card" :class="{
                    'info-card-gana': hoy.total >= 0,
                    'info-card-pierde': hoy.total < 0,
                  }">
                    <div class="card-body">
                      <h5 class="card-title">
                        Hoy <span>| {{ hoy.fecha }}</span>
                      </h5>

                      <div class="d-flex align-items-center">
                        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i class="bi bi-currency-dollar"></i>
                        </div>
                        <div class="ps-3">
                          <h6>${{ hoy.total.toLocaleString() }}</h6>
                        </div>
                      </div>
                      <h4 class="card-title">
                        Abono: <span> {{ hoy.abono.toLocaleString() }}</span><br />
                        Ventas: <span> {{ hoy.ventas }}</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </v-col>

              <v-col md="4">
                <div class="col-xxl-4 col-md-6">
                  <div class="card info-card revenue-card" :class="{
                    'info-card-gana': mes.total >= 0,
                    'info-card-pierde': mes.total < 0,
                  }">
                    <div class="card-body">
                      <h5 class="card-title">
                        Mensual <span>| {{ mesesDelAnio[mes.fecha] }}</span>
                      </h5>

                      <div class="d-flex align-items-center">
                        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i class="bi bi-currency-dollar"></i>
                        </div>
                        <div class="ps-3">
                          <h6>${{ mes.total.toLocaleString() }}</h6>
                        </div>
                      </div>
                      <h4 class="card-title">
                        Abono: <span> {{ mes.abono.toLocaleString() }}</span><br />
                        Ventas: <span> {{ mes.ventas }}</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </v-col>

              <v-col md="4">
                <div class="col-xxl-4 col-md-6">
                  <div class="card info-card revenue-card" :class="{
                    'info-card-gana': yearC.total >= 0,
                    'info-card-pierde': yearC.total < 0,
                  }">
                    <div class="card-body">
                      <h5 class="card-title">
                        Anual <span>| {{ yearC.fecha }}</span>
                      </h5>

                      <div class="d-flex align-items-center">
                        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i class="bi bi-currency-dollar"></i>
                        </div>
                        <div class="ps-3">
                          <h6>${{ yearC.total.toLocaleString() }}</h6>
                        </div>
                      </div>
                      <h4 class="card-title">
                        Abono: <span> {{ yearC.abono.toLocaleString() }}</span><br />
                        Ventas: <span> {{ yearC.ventas }}</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col lg="6" md="6" sm="12">
        <canvas class="mb-6" id="graficaAbono"></canvas>
      </v-col>
      <v-col lg="6" md="6" sm="12">
        <canvas class="mb-6" id="graficaVenta"></canvas>
      </v-col>
      <v-col lg="12" md="12" sm="12">
        <canvas class="mb-6" id="graficaYear"></canvas>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import Session from "@/validation/session";
import Axios from "axios";
import Swal from "sweetalert2";
export default {
  name: "estadisticasVista",
  data: () => ({
    api: import.meta.env.VITE_APP_API_URL,
    token: null,
    hoy: {
      fecha: "Lunes",
      total: 0,
      ventas: 0,
      abono: 0,
    },
    mes: {
      fecha: "Enero",
      total: 0,
      ventas: 0,
      abono: 0,
    },
    yearC: {
      fecha: 2023,
      total: 0,
      ventas: 0,
      abono: 0,
    },
    miImagen: null,
    year: null,
    abono: null,
    ventas: null,
    dataYearName: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    dataYearCantidad: null,
    dataYearVenta: [],
    dataYearAbono: [],
    chart: null,
    datosCharts: null,
    mesesDelAnio: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    colores: [
      "#FF5733", // Naranja
      "#3498db", // Azul
      "#e74c3c", // Rojo
      "#2ecc71", // Verde
      "#f39c12", // Amarillo
      "#9b59b6", // Morado
      "#1abc9c", // Turquesa
      "#c0392b", // Granate
      "#27ae60", // Esmeralda
      "#e67e22", // Zanahoria
      "#2980b9", // Azul claro
      "#8e44ad", // Violeta
    ],
  }),
  methods: {
    async listarGraficaYear() {
      this.dataYearCantidad = [];
      await Axios.get(
        `${this.api}/cliente/estadisticas/obtener`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )
        .then((resp) => {
          this.dataYearCantidad = resp.data;
        })
        .catch(async (error) => {
          console.log(error);
          switch (error.response.status) {
            case 401:
              await Swal.fire({
                icon: "warning",
                title: "Tu sesión expiro, vuelve a iniciar sesión",
                showConfirmButton: false,
                timer: 1500,
              });
              this.$store.commit("setusuario", {
                usuario: null,
                hora_login: null,
              });
              this.$router.push("/");
              break;

            default:
              Swal.fire({
                icon: "error",
                title: "No se pudo obtener los clientes anuales",
                showConfirmButton: false,
                timer: 1500,
              });
              break;
          }
        });
      let ctx = document.getElementById("graficaYear");
      this.year = {
        type: "bar",
        data: {
          labels: this.dataYearName,
          datasets: [
            {
              label: "Clientes",
              data: this.dataYearCantidad,
              borderWidth: 1,
              backgroundColor: this.colores,
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "Clientes Anuales",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      };
      this.chart = new Chart(ctx, this.year);
    },
    async listarGraficaCobro() {
      await Axios.get(
        `${this.api}/prestamo/estadisticas/obtener`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )
        .then((resp) => {
          this.dataYearAbono = resp.data.abonos;
          this.dataYearVenta = resp.data.ventas;
          this.hoy = resp.data.hoy;
          this.mes = resp.data.mes;
          this.yearC = resp.data.year;
        })
        .catch(async (error) => {
          console.log(error);
          switch (error.response.status) {
            case 401:
              await Swal.fire({
                icon: "warning",
                title: "Tu sesión expiro, vuelve a iniciar sesión",
                showConfirmButton: false,
                timer: 1500,
              });
              this.$store.commit("setusuario", {
                usuario: null,
                hora_login: null,
              });
              this.$router.push("/");
              break;

            default:
              Swal.fire({
                icon: "error",
                title: "No se pudo obtener los clientes anuales",
                showConfirmButton: false,
                timer: 1500,
              });
              break;
          }
        });
      let ctx = document.getElementById("graficaAbono");
      let ctx2 = document.getElementById("graficaVenta");
      this.abono = {
        type: "bar",
        data: {
          labels: this.dataYearName,
          datasets: [
            {
              label: "Abonos",
              data: this.dataYearAbono,
              backgroundColor: this.colores,
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "Abonos",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      };
      this.ventas = {
        type: "bar",
        data: {
          labels: this.dataYearName,
          datasets: [
            {
              label: "Ventas",
              data: this.dataYearVenta,
              borderWidth: 1,
              backgroundColor: this.colores,
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "Ventas",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      };
      this.chart = new Chart(ctx, this.abono);
      this.chart = new Chart(ctx2, this.ventas);
    },
  },

  async created() {
    const invalid = await Session.expiredSession();
    if (!invalid) {
      this.token = this.$store.getters.usuario.usuario.access_token;
      this.$emit("loadingSweet");
      await this.listarGraficaYear();
      await this.listarGraficaCobro();
      this.$emit("closeSweet");
    }
  },
};
</script>

<style>
.card {
  margin-bottom: 30px;
  border: none;
  border-radius: 5px;
  box-shadow: 0px 0 30px rgba(147, 187, 255, 0.1);
}

.card-header,
.card-footer {
  border-color: #ebeef4;
  background-color: #fff;
  color: #798eb3;
  padding: 15px;
}

.card-title {
  padding: 20px 0 15px 0;
  font-size: 18px;
  font-weight: 500;
  color: #012970;
  font-family: "Poppins", sans-serif;
}

.card-title span {
  color: #899bbd;
  font-size: 14px;
  font-weight: 400;
}

.card-body {
  padding: 0 20px 20px 20px;
}

.info-card {
  padding-bottom: 10px;
}

.info-card-gana h6 {
  font-size: 28px;
  color: #012970;
  font-weight: 700;
  margin: 0;
  padding: 0;
}

.info-card-pierde h6 {
  font-size: 28px;
  color: #ce0202;
  font-weight: 700;
  margin: 0;
  padding: 0;
}

.filter {
  position: absolute;
  right: 0px;
  top: 15px;
}

.filter .icon {
  color: #aab7cf;
  padding-right: 20px;
  padding-bottom: 5px;
  transition: 0.3s;
  font-size: 16px;
}

.filter .icon:hover,
.filter .icon:focus {
  color: #4154f1;
}
</style>
