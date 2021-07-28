import Vue from 'vue'
import Vuex from 'vuex'
import myStore from './models/mystore'
import testStore from './models/testStore'


Vue.use(Vuex)
 export default new Vuex.Store({
     models:{
        myStore,
        testStore
     }
 })