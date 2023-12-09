<template>
    <v-row justify="center">
        <v-dialog v-model="verDialog" persistent fullscreen :scrim="false" transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark theme="dark" class="noImprimir">
                    <v-btn icon dark @click="cerrarDialogo()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn variant="text" @click="imprimir()">
                            Imprimir
                        </v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-card-text>
                    <v-col cols="12" sm="6" md="4" xl="4" class="ma-auto">
                        <v-card rounded="4" class="pa-4 mt-2" ref="imprimir" id="imprimir">
                            <v-row class="w-100 flex-column" id="parte1" no-gutters
                                style="font-family: 'Roboto', sans-serif;">
                                <v-row justify="space-between" no-gutters>
                                    <v-col cols="4">
                                        <v-img width="40" ref="logo" cover :src="require('@/assets/logo.png')"
                                            :lazy-src="require('@/assets/logo.png')"></v-img>
                                    </v-col>
                                    <v-col cols="8" class="text-right" style="font-size: 1.6rem;">
                                        <label class="text-dark pr-1">Factura</label>
                                        <label class="text-muted fw-600 mb-0 pb-0"
                                            style="font-weight:bold; color: #000;">#123</label>
                                    </v-col>
                                </v-row>
                                <v-row justify="space-between" no-gutters>
                                    <v-col cols="6" style="font-size: 1.5rem; font-family: 'Roboto', sans-serif;">
                                        <p class=" text-dark">Calle 3 #30-46 Barrio el mora, Montería, Córdoba, Colombia</p>
                                        <p class="text-dark">Nombre Empresa</p>
                                        <p class="text-dark">3101004354 - empresa@gmail.com</p>
                                    </v-col>
                                    <v-col cols="6" class="text-right"
                                        style="font-size: 1.5rem; font-family: 'Roboto', sans-serif;">
                                        <p class=" text-dark">Fecha generación</p>
                                        <p class="text-dark fw-600" style="font-weight: bold; color: #000;">03-06-2023</p>
                                    </v-col>
                                </v-row>
                                <v-divider></v-divider>
                                <v-row class="mt-4" justify="space-between" no-gutters
                                    style="font-family: 'Roboto', sans-serif; font-size: 1.5rem;">
                                    <v-col cols="8">
                                        <h4 class="fw-600" style="font-weight: bold;">Cliente</h4>
                                        <p>{{ datos.nombre }}</p>
                                        <p>{{ datos.numero }}</p>
                                        <p>{{ datos.correo }}</p>
                                    </v-col>
                                    <v-col cols="4" style="text-align: right;">
                                        <h4 class="fw-600" style="font-weight: bold;">Detalle del pago</h4>
                                        <p style="font-weight: bold;">Total pagado: <span style="font-weight: normal;">{{
                                            totalPagar() }}</span></p>
                                        <p>Método de pago: <span>{{ datos.pago }}</span></p>
                                    </v-col>
                                </v-row>
                            </v-row>
                            <v-row no-gutters>
                                <v-table id="tabla" class="w-100" fixed-header height="auto" border="1"
                                    border-collapse="collapse" cellspacing="0">
                                    <thead class="bg-table-header fw-bold">
                                        <tr>
                                            <th class="text-left">
                                                Producto
                                            </th>
                                            <th class="text-left">
                                                Descripcion
                                            </th>
                                            <th class="text-left">
                                                Descuento
                                            </th>
                                            <th class="text-left">
                                                Cantidad
                                            </th>
                                            <th class="text-left">
                                                Precio Neto
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody id="productosTabla">
                                        <tr v-for="(item, index) in datos.compras" :key="item.name">
                                            <td class="text-left">{{ index + 1 }}</td>
                                            <td class="text-left">{{ item.descripcion }}</td>
                                            <td class="text-left">{{ item.descuento }}</td>
                                            <td class="text-left">{{ item.cantidad }}</td>
                                            <td class="text-left">{{ item.precio }}</td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-row>
                            <v-row no-gutters id="parte3" style="font-size: 1.5rem; font-family: 'Roboto', sans-serif;">
                                <v-col cols="8">
                                    <h4 class="fw-600" style="font-weight: bold;">Empleado</h4>
                                    <p class="text-dark">{{ datos.ubicacion == 'Domicilio' ? datos.domiciliario :
                                        datos.mesero }}</p>
                                    <p class="text-dark">Lugar: <span>{{ datos.ubicacion }}</span></p>
                                </v-col>
                                <v-col cols="4">
                                    <v-row justify="space-between" no-gutters>
                                        <v-col cols="7" class="px-0 pb-0">
                                            <p class="fw-600 bc-gray"
                                                style="color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));">
                                                SUBTOTAL</p>
                                        </v-col>
                                        <v-col cols="5" class="pb-0">
                                            <p class="fw-600">$ 10.000</p>
                                        </v-col>
                                    </v-row>
                                    <v-row justify="space-between" no-gutters>
                                        <v-col cols="7" class="px-0 py-0">
                                            <p class="fw-600 bc-gray"
                                                style="color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));">
                                                IVA</p>
                                        </v-col>
                                        <v-col cols="5" class="pb-0 py-0">
                                            <p class="fw-600">$ 0</p>
                                        </v-col>
                                    </v-row>
                                    <v-row justify="space-between" no-gutters>
                                        <v-col cols="7" class="px-0 pt-0">
                                            <p class="fw-600 bc-gray"
                                                style="color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));">
                                                INC</p>
                                        </v-col>
                                        <v-col cols="5" class="pt-0">
                                            <p class="fw-600">$ 0</p>
                                        </v-col>
                                    </v-row>
                                    <v-divider class="divider-dotted"></v-divider>
                                    <v-row no-gutters>
                                        <v-col cols="7">
                                            <p class="fw-600" style="font-weight: bold;">TOTAL</p>
                                        </v-col>
                                        <v-col cols="5">
                                            <p class="fw-600">$ 10.000</p>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <pre>{{ datos }}</pre>
                            <v-row no-gutters class="w-100 flex-column" id="parteFinal">
                                <v-divider></v-divider>
                                <v-row>
                                    <v-col cols="12">
                                        <p style="font-size: 1.4rem;">
                                            <strong class="fw-600" style="font-weight: bold; font-size: 1.5rem;">Nota:
                                            </strong> Comida muy buena.
                                        </p>
                                    </v-col>
                                </v-row>
                            </v-row>
                        </v-card>
                    </v-col>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-row>
</template>
<script>
import {
    jsPDF
} from "jspdf";
import "jspdf-autotable";
export default {
    name: 'facturaView',
    props: {
        dialog: { type: Boolean, default: false, required: true }, datos: {
            type: Object, default: () => {
                return {
                    "nombre": null,
                    "cedula": null,
                    "pago": null,
                    "compras": [],
                    "ubicacion": null,
                    "mesero": null,
                    "domiciliario": null,
                    "direccion": null,
                    "numero": null,
                    "correo": null,
                    "descuento": 0
                }
            },
            required: true
        }
    },
    data: () => ({
        verDialog: false,
        form: {
            compras: [
                {
                    name: "Arroz",
                    descripcion: "Arroz de grano largo, 1kg.",
                    precio: '1800',
                    descuento: '0',
                }, {
                    name: "Leche",
                    descripcion: "Leche semidesnatada, 1L.",
                    precio: '2200',
                    descuento: '0',
                }, {
                    name: "Pan",
                    descripcion: "Pan blanco recién horneado.",
                    precio: '500',
                    descuento: '900',
                }]
        }
    }),
    methods: {
        cerrarDialogo() {
            this.$emit('cerrarDialogo');
        },
        imprimir() {
            const doc = new jsPDF('p', 'px', 'letter');
            doc.viewerPreferences({
                'HideWindowUI': true,
                'PrintArea': 'CropBox',
                'HideMenubar': true,
                'HideToolbar': true,
                'ViewArea': 'CropBox',
                'DisplayDocTitle': true
            });
            const parte1 = document.getElementById('parte1');
            const tabla = document.querySelector("#tabla>.v-table__wrapper>table");
            const parte3 = document.getElementById('parte3');
            const parteFinal = document.getElementById('parteFinal');
            const margin = 20;
            const scale = (doc.internal.pageSize.width - margin * 2) / document.body.clientWidth;
            //const scale_mobile = (doc.internal.pageSize.width - margin * 2) / document.body.getBoundingClientRect();
            let finalY;
            doc.setDocumentProperties({
                title: 'factura.pdf'
            });

            //Revisar dispositivo
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                //Mobile
                doc.html(parte1, {
                    x: margin,
                    y: margin,
                    width: 1320,
                    //height: 200,
                    //windowHeight: 200,
                    windowWidth: 1320,
                    /*  html2canvas: {
                         //scale: scale_mobile,
                         //height: 200,
                         //width: 1320,
                         //windowWidth: 1320,
                         //windowHeight: 200,
                     }, */
                    filename: 'factura.pdf',
                    callback: (pdf) => {
                        pdf.autoTable({
                            html: tabla,
                            head: [['Producto', 'Descripcion', 'Precio', 'Descuento']],
                            useCss: true,
                            startY: 150,
                            styles: { overflow: 'ellipsize', cellWidth: 'wrap' },
                            // Override the default above for the text column
                            columnStyles: { text: { cellWidth: 'auto' } },
                            margin: { left: margin },
                            bodyStyles: { textColor: '#00000' },
                            headStyles: {
                                fillColor: '#F3F2F7',
                                textColor: '#00000',
                                fontStyle: '"Roboto" sans-serif',
                                lineWidth: {
                                    bottom: 1
                                }
                            },
                        });
                        finalY = pdf.lastAutoTable.finalY;
                        pdf.html(parte3, {
                            x: margin,
                            y: finalY + 20,
                            //width: 1320,
                            //windowWidth: 1320,
                            /* html2canvas: {
                                //scale: scale_mobile,
                                //height: 200,
                                //width: 1320,
                                //windowWidth: 1320,
                                //windowHeight: 200,
                            }, */
                            filename: 'factura.pdf',
                            callback: (newPdf) => {
                                newPdf.html(parteFinal, {
                                    x: margin,
                                    y: finalY + 80,
                                    //width: 1320,
                                    //windowWidth: 1320,
                                    /* html2canvas: {
                                        //scale: scale_mobile,
                                        //height: 200,
                                        //width: 1320,
                                        //windowWidth: 1320,
                                        //windowHeight: 200,
                                    }, */
                                    filename: 'factura.pdf',
                                    callback: (newPdf2) => {
                                        newPdf2.autoPrint();
                                        newPdf2.output('dataurlnewwindow', {
                                            filename: 'factura.pdf'
                                        });
                                        return newPdf2;
                                    }
                                });
                            }
                        });
                    },
                });

            } else {
                //PC
                doc.html(parte1, {
                    x: margin,
                    y: margin,
                    width: 1320,
                    //height: 200,
                    //windowHeight: 200,
                    windowWidth: 1320,
                    html2canvas: {
                        scale: scale,
                        //height: 200,
                        width: 1320,
                        windowWidth: 1320,
                        //windowHeight: 200,
                    },
                    filename: 'factura.pdf',
                    callback: (pdf) => {
                        pdf.autoTable({
                            html: tabla,
                            head: [['Producto', 'Descripcion', 'Precio', 'Descuento']],
                            useCss: true,
                            startY: 150,
                            styles: { overflow: 'ellipsize', cellWidth: 'wrap' },
                            // Override the default above for the text column
                            columnStyles: { text: { cellWidth: 'auto' } },
                            margin: { left: margin },
                            bodyStyles: { textColor: '#00000' },
                            headStyles: {
                                fillColor: '#F3F2F7',
                                textColor: '#00000',
                                fontStyle: '"Roboto" sans-serif',
                                lineWidth: {
                                    bottom: 1
                                }
                            },
                        });
                        finalY = pdf.lastAutoTable.finalY;
                        pdf.html(parte3, {
                            x: margin,
                            y: finalY + 20,
                            width: 1320,
                            windowWidth: 1320,
                            html2canvas: {
                                scale: scale,
                                //height: 200,
                                width: 1320,
                                windowWidth: 1320,
                                //windowHeight: 200,
                            },
                            filename: 'factura.pdf',
                            callback: (newPdf) => {
                                newPdf.html(parteFinal, {
                                    x: margin,
                                    y: finalY + 80,
                                    width: 1320,
                                    windowWidth: 1320,
                                    html2canvas: {
                                        scale: scale,
                                        //height: 200,
                                        width: 1320,
                                        windowWidth: 1320,
                                        //windowHeight: 200,
                                    },
                                    filename: 'factura.pdf',
                                    callback: (newPdf2) => {
                                        newPdf2.autoPrint();
                                        newPdf2.output('dataurlnewwindow', {
                                            filename: 'factura.pdf'
                                        });
                                        return newPdf2;
                                    }
                                });
                            }
                        });
                    },
                });
            }
        },
        totalPagar() {
            let pagar = 0;
            this.datos.compras.forEach((compraObj) => {
                pagar += (compraObj.cantidad * compraObj.precio) - compraObj.descuento;
            });
            return pagar;
        }
    },
    watch: {
        dialog() {
            this.verDialog = this.$props.dialog;
        }
    }
}
</script>
<style>
@media print {
    .noImprimir {
        display: none !important;
    }
}
</style>