<template>
  <router-view />
</template>

<script setup>
//
</script>
<style>
body,
html {
  overflow: auto !important;
  overflow-y: auto !important;
  height: 100%;
}

:root {
  --bg-table-header: #f3f2f7;

}

.v-main {
  height: 100vh !important;
  overflow: auto;
}

.bg-table-header>tr>th {
  background-color: var(--bg-table-header) !important;
  font-weight: bold !important;
}

.v-data-table>tr>th {
  background-color: var(--bg-table-header) !important;
  font-weight: bold !important;
}

#app {
  height: 100%;
  color: #2c3e50;
}

.v-data-table .v-table__wrapper>tr>th {
  background-color: var(--bg-table-header) !important;
  font-weight: bold !important;
}

.fw-600 {
  font-weight: 600;
}

.fw-bold {
  font-weight: bold;
}

.fw-bold-important {
  font-weight: bold !important;
}

.cursor-pointer {
  cursor: pointer;

}

.no-select {
  user-select: none !important;
}

.cursor-not-allowed {
  cursor: not-allowed !important;
}

.no-pointer-events {
  pointer-events: none !important;
}

.divider-dotted {
  border-style: dotted !important;
}

/* Para que las alertas de Swal se vean adelante de los dialogs */
.swal2-container.swal2-backdrop-show {
  z-index: 99999 !important;
}

body.swal2-shown.swal2-height-auto {
  height: 100vh !important;
}

div:where(.swal2-container).swal2-backdrop-show,
div:where(.swal2-container).swal2-noanimation {
  background: rgba(0, 0, 0, .6) !important;
}

.loader {
  background: transparent !important;
  color: #FFF !important;
}

div:where(.swal2-container) div:where(.swal2-loader) {
  border-top-color: #FFF !important;
  border-bottom-color: #BB844C !important;
}
</style>
