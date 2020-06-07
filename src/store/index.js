import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export const store = new Vuex.Store(
    {
        state: {
            loading: false,
            errorMessage: "",
            title: "Draw Region on Image",
            sizeModificationDialog: {
                width: 0,
                height: 0,
                show: false,
                callback: null
            }
        },

        mutations: {
            setLoading(state, payload) {
                state.loading = payload;
            },
            setErrorMessage(state, payload) {
                state.errorMessage = payload;
            },
            setSizeModificationDialog(state, payload) {
                state.sizeModificationDialog = payload;
            }
        },

        actions: {
            setLoading({ commit }, payload) {
                commit('setLoading', payload)
            },
            setErrorMessage({ commit }, payload) {
                commit('setErrorMessage', payload)
            },
            setSizeModificationDialog({ commit }, payload) {
                commit('setSizeModificationDialog', payload)
            }
        },

        getters: {
            loading(state) {
                return state.loading
            },
            errorMessage(state) {
                return state.errorMessage
            },
            title(state) {
                return state.title
            },
            sizeModificationDialog(state) {
                return state.sizeModificationDialog
            }
        }
    }
);