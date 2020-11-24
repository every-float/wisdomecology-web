import { 
    getAirQuality, 
    getXiangzhenData, 
    getLeftBottomData,
    getHomeStatInfo,
    getDataByDay, 
    getDataByMonth,
    getRiverGridData,
} from '@/service/api.js';
import axios from 'axios';
import { Loading } from 'element-ui';
import riverTree from '@/mock/riverTree.js';    //水环境站点模拟数据
import moment from 'moment';

export default {
    namespaced: true,
    state: {
        isComplete: false,
        riverTree: [],
        shizhan: [],
        xiangzhen: [],
        leftBottomData: [],
        homeStatInfo: {},
        dataByDay: {},
        dataByMonth: {},
        riverGridDataAllR: {},     //各站点水日每小时数据
        riverGridDataAllD: {},     //各站点水月每日数据
    },
    mutations: {
        // 首批数据加载状态，何时挂载以及关闭loading
        updateCompleteState: (state) => {
            state.isComplete = true;
        },
        // 河流站点列表
        updateRiverTree: (state, data) => {
            state.riverTree = data;
        },
        // 首批数据存入
        updateRequestData: (state, data) => {
            state.shizhan = data[0];
            state.xiangzhen = data[1];
            state.leftBottomData = data[2];
            state.homeStatInfo = data[3];
        },
        // 更新辛老路日数据
        updateXinlaoluR: (state, load) => {
            state.dataByDay[load.name] = [{}];
            const okeys = load.data.xaxis.map(v => v.split(' ')[1]);
            const ovals = load.data.series[0].data;
            okeys.forEach((v, index) => {
                state.dataByDay[load.name][0][v] = ovals[index]
            });
        },
        // 批量更新辛老路日数据
        updateXinlaoluR_batch: (state, load) => {
            load.data.forEach((vo, indexo) => {
                state.dataByDay[load.names[indexo]] = [{}];
                const okeys = vo.xaxis.map(v => v.split(' ')[1]);
                const ovals = vo.series[0].data;
                okeys.forEach((v, index) => {
                    state.dataByDay[load.names[indexo]][0][v] = ovals[index]
                });
            });
        },
        // 批量更新辛老路月数据
        updateXinlaoluD_batch: (state, load) => {
            load.data.forEach((vo, indexo) => {
                state.dataByMonth[load.names[indexo]] = [{}];
                const okeys = vo.xaxis.map(v => `${v.split('-')[1]}-${v.split('-')[2]}`);
                const ovals = vo.series[0].data;
                okeys.forEach((v, index) => {
                    state.dataByMonth[load.names[indexo]][0][v] = ovals[index]
                });
            });
        },
        // 更新河流日数据
        updateRiverGridDataR: (state, load) => {
            state.riverGridDataAllR[load.id] = load.data;
        },
        // 批量更新河流日数据
        updateRiverGridDataR_batch: (state, load) => {
            load.datas.forEach((v, index) => {
                state.riverGridDataAllR[load.ids[index]] = v;
            });
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
                getAirQuality(),
                getXiangzhenData(),
                getLeftBottomData(),
                getHomeStatInfo(),
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
                // time: moment(xinlaoluTime).format("YYYY-MM-DD"),
                startTime: moment(xinlaoluTime).subtract(12 ,'hour').format("YYYY-MM-DD HH"),
                endTime: moment(xinlaoluTime).format("YYYY-MM-DD HH"),
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
                // time: moment(xinlaoluTime).format("YYYY-MM"),
                startTime: moment(xinlaoluTime).subtract(30 ,'days').format("YYYY-MM-DD"),
                endTime: moment(xinlaoluTime).format("YYYY-MM-DD"),
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