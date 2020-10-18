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
        updateRiverGridDataAllR: (state, data) => {
            data.forEach((v, index) => {
                state.riverGridDataAllR[state.riverTree[index]['id']] = v;
            });
        },
        updateRiverGridDataAllD: (state, data) => {
            data.forEach((v, index) => {
                state.riverGridDataAllD[state.riverTree[index]['id']] = v;
            });
        },
        updateOthersData: (state, data) => {
            state.homeStatInfo = data[0];
            state.pollutionListW = data[1];
        }
    },
    actions: {
        getAlldata: async ({commit, state}) => {
            const loading = Loading.service({
                lock: true,
                text: '数据加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.9)'
            });
            
            try {
                // const riverTree = await getRiverTree();
                // commit('updateRiverTree', riverTree.data.children);
                commit('updateRiverTree', riverTree.data.children);     //暂时取的模拟数据
                let arr1 = [], arr2 = [];
                const riverListLen = riverTree.data.children.length;
                riverTree.data.children.forEach(v => {
                    arr1.push(getRiverGridData({
                        sectionCode: v.id,
                        dataType: 'Rtd',
                        startTime: moment().format("YYYY-MM-DD"),
                        endTime: moment().format("YYYY-MM-DD")
                    }));
                    arr2.push(getRiverGridData({
                        sectionCode: v.id,
                        dataType: 'Day',
                        startTime: moment().format("YYYY-MM") + "-01",
                        endTime: moment().format("YYYY-MM-DD")
                    }));
                });
                axios.all(arr1.concat(arr2)).then(axios.spread(function (...values) {
                    commit('updateRiverGridDataAllR', values.filter((v, i) => i<riverListLen).map(v => v.data));
                    commit('updateRiverGridDataAllD', values.filter((v, i) => i>=riverListLen).map(v => v.data));
                    let arr3 = [
                        getHomeStatInfo(),
                        getPollutionListW(),
                    ];
                    return axios.all(arr3);
                })).then(axios.spread(function (...values) {
                    commit('updateOthersData', values.map(v => v.data));
                    commit('updateCompleteState');
                    setTimeout(() => {
                        loading.close();
                    }, 300);
                }));
            } catch (e) {}
        },

    },
}