import {UPDATE_NAME} from '@/store/mutationTypes'

const state = {
    testForm: {
        name:null
    }
}
const getters = {
    newForm: state => state.testForm
}
const mutations = {
    UPDATE_NAME : (state, name) => {
        state.testForm.name = name
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