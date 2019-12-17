import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '../boot/main'
import { Cookies } from 'quasar'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    username: '',
    version: '',
    pastaAtual: {
      id: null
    },
    quadroAtual: {
      id: null
    }
  },
  getters: {
    getUser: state => {
      return state.user
    },
    getNomeUsuario: state => {
      return state.username
    },
    getVersion: state => {
      return state.version
    },
    getPastaAtual (state) {
      return state.pastaAtual
    },
    getQuadroAtual (state) {
      return state.quadroAtual
    }
  },
  mutations: {
    async boot (state, { ssrContext }) {
      const cookies = process.env.SERVER
        ? Cookies.parseSSR(ssrContext)
        : Cookies // otherwise we're on client
      const user = cookies.get('user')

      if (user != null) {
        try {
          const result = await db
            .collection('app')
            .doc(user.uid)
            .get()
          state.user = {
            uid: user.uid,
            email: user.email,
            username: result.username
          }
        } catch (error) {
          console.log('Erro ao tentar verificar nome do usuário')
        }
      } else {
        state.user = { uid: null, email: 'email@email.com', username: 'no name' }
      }
    },
    setVersion (state) {
      state.version = process.env.VERSION
    },
    definePastaAtual (state, payload) {
      state.pastaAtual = payload
    },
    defineQuadroAtual (state, payload) {
      state.quadroAtual = payload
    }
  },
  actions: {
    boot ({ commit }) {
      commit('boot')
    },
    setVersion ({ commit }) {
      commit('setVersion')
    },
    definePastaAtual ({ commit }, payload) {
      commit('definePastaAtual', payload)
    },
    defineQuadroAtual ({ commit }, payload) {
      commit('defineQuadroAtual', payload)
    }
  }
})
