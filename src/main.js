import Vue from 'vue'
import App from './App.vue'
import Vuetify from './plugins/vuetify'
import VueLayers from 'vuelayers'
import Vuex from 'vuex'



Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueLayers)
Vue.use(Vuetify)

const users = [
  {Password: "1",
  name: "1",
  userID: "dd3b3aa2-f975-4bd4-83ac-806ceeb72441"},

  {Password: "3",
  name: "2",
  userID: "6f343c3c-0ee9-4434-84f7-e8fa77f0f4f6"}
]

const store = new Vuex.Store({
  state: {
    userName: '',
    users: [ ...users],
    activeUser: null
  },
  mutations: {
    
  }
})



new Vue({
  store: store,
  render: h => h(App)
}).$mount('#app')


import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'
// import store from './store/index.js'


export default {
  mixins: [validationMixin],

  validations: {
    name: { required, maxLength: maxLength(10) },
    email: { required, email },
    select: { required },
    checkbox: {
      checked (val) {
        return val
      },
    },
  },
}
