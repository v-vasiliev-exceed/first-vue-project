import Vue from 'vue'
import App from './App.vue'
import Vuetify from './plugins/vuetify'
import VueLayers from 'vuelayers'
import Vuex from 'vuex'



Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueLayers)
Vue.use(Vuetify)



new Vue({
  store,
  render: h => h(App)
}).$mount('#app')


import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'
import store from './store/index.js'


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
