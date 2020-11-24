import {
    getRiverTree,
    getRiverGridData,
    getHomeStatInfo,
    getPollutionListW,
} from '@/service/api.js';
import axios from 'axios';
import moment from 'moment';
import { Loading } from 'element-ui';
import riverTree from '@/mock/riverTree.js';    //水环境站点模拟数据

export default {
    namespaced: true,
    state: {
        isComplete: false,
        riverTree: [],
        riverGridDataAllR: {},     //各站点水日每小时数据
        riverGridDataAllD: {},     //各站点水月每日数据
        homeStatInfo: {},
        pollutionListW: [],
    },
    mutations: {
        updateCompleteState: (state) => {
            state.isComplete = true;
        },
        updateRiverTree: (state, data) => {
            state.riverTree = data
        },
        updateRequestData: (state, data) => {
            state.homeStatInfo = data[0];
            state.pollutionListW = data[1];
        },
        // 更新河流日数据
        updateRiverGridDataR: (state, load) => {
            state.riverGridDataAllR[load.id] = load.data;
        },
        // 批量更新河流月数据
        updateRiverGridDataD_batch: (state, load) => {
            load.datas.forEach((v, index) => {
                state.riverGridDataAllD[load.ids[index]] = v;
            });
        },
    },
    actions: {
        getFirstdata: async ({commit}) => {
            const loading = Loading.service({
                lock: true,
                text: '数据加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.9)'
            });
            // const riverTree = await getRiverTree();
            // commit('updateRiverTree', riverTree.data.children);
            commit('updateRiverTree', riverTree.data.children);     //暂时取的模拟数据
            axios.all([
                getHomeStatInfo(),
                getPollutionListW(),
            ])
            .then(axios.spread(function (...values) {
                commit('updateRequestData', values.map(v => v.data));
                commit('updateCompleteState');
                setTimeout(() => {
                    loading.close();
                }, 300);
            }));
        },
        getRiverGridDataR: async ({commit}, {sectionCode}) => {
            const riverGridDataR = await getRiverGridData({
                sectionCode: sectionCode,
                dataType: 'Rtd',
                // startTime: moment().format("YYYY-MM-DD"),
                startTime: moment().subtract(1, 'days').format('YYYY-MM-DD'),
                endTime: moment().format("YYYY-MM-DD")
            });
            commit({
                type: 'updateRiverGridDataR',
                data: riverGridDataR.data,
                id: sectionCode
            });
        },
        getRiverGridDataD_batch: async ({commit}, {riverTree}) => {
            const fnArr = riverTree.map(v => getRiverGridData({
                sectionCode: v.id,
                dataType: 'Day',
                // startTime: moment().format("YYYY-MM") + "-01",
                startTime: moment().subtract(30, 'days').format('YYYY-MM-DD'),
                endTime: moment().format("YYYY-MM-DD")
            }));
            // riverGridDataD
            return axios.all(fnArr)
            .then(axios.spread(function (...values) {
                commit({
                    type: 'updateRiverGridDataD_batch',
                    datas: values.map(v => v.data),
                    ids: riverTree.map(v => v.id)
                })
            }));
        }

    },
}