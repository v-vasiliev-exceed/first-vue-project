import Vue from 'vue'
import App from './App.vue'
import Vuetify from './plugins/vuetify'
import VueLayers from 'vuelayers'
import Vuex from 'vuex'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueLayers)




const store = new Vuex.Store({
  state: {
    currentUser: localStorage.getItem('curentUser')? JSON.parse(localStorage.getItem('curentUser')): null,
    currentTag: null,
    userName: '',
    newLocation: null,
    popupAddingLocatin: null,
    titleBtn: 'Add new location'
  },
  mutations: {
    
  }
})





new Vue({
  store: store,
  render: h => h(App),
  vuetify: Vuetify
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
