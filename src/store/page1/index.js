import { 
    getAirQuality, 
    getXiangzhenData, 
    getDataByDay, 
    getDataByMonth,
    getLeftBottomData,
    getRiverTree,
    getRiverGridData,
    getHomeStatInfo,
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
        dataByDay: {},
        dataByMonth: [],
        leftBottomData: [],
        riverTree: [],
        riverGridDataAllR: {},     //各站点水日每小时数据
        riverGridDataAllD: {},     //各站点水月每日数据
        homeStatInfo: {}
    },
    mutations: {
        updateCompleteState: (state) => {
            state.isComplete = true;
        },
        updateRiverTree: (state, data) => {
            state.riverTree = data
        },
        updateRequestData: (state, data) => {
            state.shizhan = data[0];
            state.xiangzhen = data[1];
            state.dataByDay['aqi'] = data[2];
            state.dataByDay['pm2.5'] = data[3];
            state.dataByDay['pm10'] = data[4];
            state.dataByDay['so2'] = data[5];
            state.dataByDay['no2'] = data[6];
            state.dataByDay['o3'] = data[7];
            state.dataByDay['co'] = data[8];
            state.dataByMonth['aqi'] = data[9];
            state.dataByMonth['pm2.5'] = data[10];
            state.dataByMonth['pm10'] = data[11];
            state.dataByMonth['so2'] = data[12];
            state.dataByMonth['no2'] = data[13];
            state.dataByMonth['o3'] = data[14];
            state.dataByMonth['co'] = data[15];
            state.leftBottomData = data[16];
            state.homeStatInfo = data[17];
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
                const riverTree = await getRiverTree();
                commit('updateRiverTree', riverTree.data.children);
                axios.all([
                    getAirQuality(),
                    getXiangzhenData(),
                    getDataByDay('AQI'),
                    getDataByDay('PM25'),
                    getDataByDay('PM10'),
                    getDataByDay('SO2'),
                    getDataByDay('NO2'),
                    getDataByDay('CO'),
                    getDataByDay('O3'),
                    getDataByMonth('AQI'),
                    getDataByMonth('PM25'),
                    getDataByMonth('PM10'),
                    getDataByMonth('SO2'),
                    getDataByMonth('NO2'),
                    getDataByMonth('CO'),
                    getDataByMonth('O3'),
                    getLeftBottomData(),
                    getHomeStatInfo(),
                ]).then(axios.spread(function (...values) {
                    commit('updateRequestData', values.map(v => v.data));
                    let arr1 = [];
                    state.riverTree.forEach(v => {
                        arr1.push(getRiverGridData({
                            sectionCode: v.id,
                            dataType: 'Rtd',
                            startTime: moment().format("YYYY-MM-DD"),
                            endTime: moment().format("YYYY-MM-DD")
                        }));
                    });
                    return axios.all(arr1);
                })).then(axios.spread(function (...values) {
                    commit('updateRiverGridDataAllR', values.map(v => v.data));
                    let arr2 = [];
                    state.riverTree.forEach(v => {
                        arr2.push(getRiverGridData({
                            sectionCode: v.id,
                            dataType: 'Day',
                            startTime: moment().format("YYYY-MM") + "-01",
                            endTime: moment().format("YYYY-MM-DD")
                        }));
                    });
                    return axios.all(arr2);
                })).then(axios.spread(function (...values) {
                    commit('updateRiverGridDataAllD', values.map(v => v.data));
                    commit('updateCompleteState');
                    setTimeout(() => {
                        loading.close();
                    }, 300);
                }));
            } catch (e) {}
        },

    },
}