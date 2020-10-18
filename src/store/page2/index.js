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
        dataByDay: {},
        dataByMonth: [],
        leftBottomData: [],
        pollutionListA: [],
        monthCalendar: [],
    },
    mutations: {
        updateCompleteState: (state) => {
            state.isComplete = true;
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
            state.pollutionListA = data[17];
            state.monthCalendar = data[18];
        },
        
    },
    actions: {
        getAlldata: ({commit}) => {
            const loading = Loading.service({
                lock: true,
                text: '数据加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.9)'
            });
            
            try {
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
                    getPollutionListA(),
                    getMonthCalendar({
                        ids: "4e4860553999471883954ecde87d540c",         //取辛老路数据
                        time: moment().format("YYYY-MM"),
                        index: "AQI"
                    }),
                ]).then(axios.spread(function (...values) {
                    commit('updateRequestData', values.map(v => v.data));
                    commit('updateCompleteState');
                    setTimeout(() => {
                        loading.close();
                    }, 300);
                }));
            } catch (e) {}
        },

    },
}