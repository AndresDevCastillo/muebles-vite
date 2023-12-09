//import Vue from 'vue'
import { createStore } from 'vuex'
import { createVuexPersistedState } from "vue-persistedstate"

//Vue.use(Vuex);

export default new createStore({
  state: {
    usuario: null,
    hora_login: null
  },
  mutations: {
    setusuario(state, data) {
      state.usuario = data.usuario;
      state.hora_login = data.hora_login;
    },
  },

  getters: {
    usuario(state) {
      return { usuario: state.usuario, hora_login: state.hora_login };
    },
  },

  actions: {

  },
  modules: { createVuexPersistedState },

});
