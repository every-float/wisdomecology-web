import { getUserInfo } from '@/service/api.js';

export default {
    namespaced: true,
    state: {
        userinfo: null
    },
    mutations: {
        updateUserInfo: (state, data) => {
            state.userinfo = data;
            localStorage.setItem('userInfo', JSON.stringify(data));
        }
    },
    actions: {
        getUserInfo: async ({commit}) => {
            try {
                let rs = await getUserInfo();
                commit('updateUserInfo', rs.data)
            } catch (e) {}
        }
    },
}