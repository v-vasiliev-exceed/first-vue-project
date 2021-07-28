import {UPDATE_NAME} from '@/store/mutationTypes'

const state = {
    form: {
        name:null
    }
}
const getters = {
    myForm: state => state.form
}
const mutations = {
    UPDATE_NAME : (state, name) => {
        state.form.name = name
    }
}
const actions = {
    NAME_UPDATE: ({commit}, name) => {
        commit (UPDATE_NAME, name)
    }
}
export default {
    getters,
    mutations,
    actions,
    state
}