import { 
    getAirQuality, 
    getXiangzhenData, 
    getDataByDay, 
    getDataByMonth,
    getLeftBottomData,
    getPollutionListA,
    getMonthCalendar,
} from '@/service/api.js';
import axios from 'axios';
import moment from 'moment';
import { Loading } from 'element-ui';

export default {
    namespaced: true,
    state: {
        isComplete: false,
        shizhan: [],
        xiangzhen: [],
        leftBottomData: [],
        pollutionListA: [],
        monthCalendar: [],
        dataByDay: {},
        dataByMonth: {},
    },
    mutations: {
        // 首批数据加载状态，何时挂载以及关闭loading
        updateCompleteState: (state) => {
            state.isComplete = true;
        },
        // 首批数据存入
        updateRequestData: (state, data) => {
            state.shizhan = data[0];
            state.xiangzhen = data[1];
            state.leftBottomData = data[2];
            state.pollutionListA = data[3];
            state.monthCalendar = data[4];
        },
        // 更新辛老路日数据
        updateXinlaoluR: (state, load) => {
            state.dataByDay[load.name] = load.data;
        },
        // 批量更新辛老路日数据
        updateXinlaoluR_batch: (state, load) => {
            load.data.forEach((v, index) => {
                state.dataByDay[load.names[index]] = v
            })
        },
        // 批量更新辛老路月数据
        updateXinlaoluD_batch: (state, load) => {
            load.data.forEach((v, index) => {
                state.dataByMonth[load.names[index]] = v
            })
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
            axios.all([
                getAirQuality(),
                getXiangzhenData(),
                getLeftBottomData(),
                getPollutionListA(),
                getMonthCalendar({
                    ids: window.xinlaoluId,         //取辛老路数据
                    time: moment().format("YYYY-MM"),
                    index: "AQI"
                }),
            ])
            .then(axios.spread(function (...values) {
                commit('updateRequestData', values.map(v => v.data));
                commit('updateCompleteState');
                setTimeout(() => {
                    loading.close();
                }, 300);
            }));
        },
        getXinlaoluR: async ({commit}, params) => {
            const xinlaoluR = await getDataByDay(params);
            commit({
                type: 'updateXinlaoluR',
                data: xinlaoluR.data,
                name: params.name
            });
        },
        getXinlaoluR_batch: async ({commit}, {xinlaoluTime, zblist}) => {
            const getXinlaoluRarr = zblist.filter(v => v.name !== 'aqi').map(v => getDataByDay({
                ids: window.xinlaoluId,
                time: moment(xinlaoluTime).format("YYYY-MM-DD"),
                index: v.index
            }));
            return axios.all(getXinlaoluRarr)
            .then(axios.spread(function (...values) {
                commit({
                    type: 'updateXinlaoluR_batch',
                    data: values.map(v => v.data),
                    names: zblist.filter(v => v.name !== 'aqi').map(v => v.name)
                })
            }));
        },
        getXinlaoluD_batch: async ({commit}, {xinlaoluTime, zblist}) => {
            const getXinlaoluRarr = zblist.map(v => getDataByMonth({
                ids: window.xinlaoluId,
                time: moment(xinlaoluTime).format("YYYY-MM"),
                index: v.index
            }));
            return axios.all(getXinlaoluRarr)
            .then(axios.spread(function (...values) {
                commit({
                    type: 'updateXinlaoluD_batch',
                    data: values.map(v => v.data),
                    names: zblist.map(v => v.name)
                })
            }));
        },

    },
}