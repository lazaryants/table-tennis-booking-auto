import axios from 'axios'
import {error} from "@/utils/error";
import router from "@/router";
import {useRoute} from "vue-router/dist/vue-router";

const TOKEN_KEY = 'jwt-token'
const REFRESH_TOKEN_KEY = 'jwt-refresh-token'

export default {
    namespaced: true,
    state() {
        return {
            token: localStorage.getItem(TOKEN_KEY),
            username: localStorage.getItem('username')
        }
    },
    mutations: {
        setToken(state, token) {
            state.token = token
            localStorage.setItem(TOKEN_KEY, token)
        },
        logout(state) {
            state.token = null
            state.username = ''
            localStorage.removeItem(TOKEN_KEY)
            localStorage.removeItem(REFRESH_TOKEN_KEY)
            localStorage.removeItem('username')
        },
        setUsername(state, username) {
            state.username = username
            localStorage.setItem('username', username)
        }
    },
    actions: {
        async login({ commit, dispatch }, payload) {
            try {
                const url = '/api/token/'
                const {data} = await axios.post(url, {...payload, returnSecureToken: true})
                commit('setToken', data.access)
                if (data.refresh) {
                    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh)
                }
                commit('clearMessage', null, {root: true})
                commit('clearMessage', null, {root: true})
            } catch (e) {
                console.log(e.response.statusText)
                if (e.response.statusText === 'Unauthorized') {
                    router.push({ path: '/auth', query: { message: 'INVALID_PASSWORD' } })
                }
                dispatch('setMessage', {
                    value: error('INVALID_PASSWORD'),
                    type: 'danger'
                }, {root: true})
            }
        },
        async signUp({ commit, dispatch }, payload) {
            const route = useRoute()
            try {
                await axios.post('/api/signup/', {...payload})
                router.push({ path: '/signup', query: { message: 'REGISTERED' } })
                    dispatch('setMessage', {
                    value: error('REGISTERED'),
                    type: 'primary'
                }, {root: true})
            } catch (e) {
                if (e.response.data.username) {
                    console.log(e.response.data.username)
                    router.push({ path: '/signup', query: { message: 'USER_EXISTS' } })
                    dispatch('setMessage', {
                    value: error('USER_EXISTS'),
                    type: 'danger',
                }, {root: true})
                }

                if (e.response.data.password) {
                    console.log(e.response.data.password)
                    router.push({ path: '/signup', query: { message: 'COMMON_PASSWORD' } })
                    dispatch('setMessage', {
                    value: error('COMMON_PASSWORD'),
                    type: 'danger'
                }, {root: true})
                }

            }
        }
    },
    getters: {
        token(state) {
            return state.token
        },
        isAuthenticated(_, getters) {
            return !!getters.token
        },
        username(state) {
            return state.username
        }
    }
}
