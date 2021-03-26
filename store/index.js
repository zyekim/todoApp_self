import Vue from 'vue'
import Vuex from 'vuex'
import todoApp from './todoApp'
Vue.use(Vuex)

export default new Vuex.Store({
  strict: false,
  // 배포땐 false 개발땐 true
  // strict: process.env.NODE_ENV !== 'production',
  modules: {
    todoApp
  }
})
