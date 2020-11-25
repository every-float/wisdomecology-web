import axios from 'axios';
import Cookie from 'js-cookie';
import Store from '@/store';
import moment from 'moment';

class HttpRequest {
  constructor(options){
    this.defaults = {
      baseUrl: ''
    }
    this.defaults = Object.assign(this.defaults, options);
  }
  setConfig(){

  }
  interceptors(install){
    install.interceptors.request.use(
      config => {
        let userToken = Cookie.get('login_sid_t_we');
        if (!userToken) {
          top.location.href = process.env.VUE_APP_PAGEURL + 'views/login.html';
        }
        if (userToken && baseUrl) {
          config.headers.authorization = `Bearer ${userToken}`;
        }
        return config;
      },
      err => {
        return Promise.reject(err);
      }
    );
    install.interceptors.response.use(
      res => {
        if(res && res.code==101){
          //token失效
          Cookies.set('login_sid_t_we', '', { path: '/' });
          top.location.href = process.env.VUE_APP_PAGEURL + 'views/login.html';
        }else if(res.code==102){
          //无权限
          location.href = process.env.VUE_APP_PAGEURL + 'views/noAuthority.html';
        }
        const { data, status } = res;
        return data;
      },
      err => {
        return Promise.reject(err);
      }
    );
  }
  request(options){
    options = Object.assign(this.defaults, options)
    const instance = axios.create(options)
    this.interceptors(instance);
    return instance
  }
}

// baseUrl
const request = new HttpRequest({
  baseURL: process.env.NODE_ENV === 'development' ? '/wisdomecology-boot' : window.baseUrl
});
// jsonUrl
const request_json = new HttpRequest({
  baseURL: process.env.NODE_ENV === 'development' ? '/wisdomecology' : window.jsonUrl
});

const http = request.request();
const http_json = request_json.request();

// 获取市站数据
export async function getAirQuality(){
  return await http_json.get('/shizhan/shizhan.json');
}

// 获取乡镇数据
export async function getXiangzhenData(){
  return await http_json.get('/xiangzhen/xiangzhen.json');
}

// 获取用户信息
export async function getUserInfo(){
  return await http.get('/index/getUserInfo');
}

// 大气环境质量变化趋势日变化
export async function getDataByDay({ids, startTime, endTime, index}){
  return await http.get(
    // '/dq/statistic/getDataByDay', 
    '/dq/statistic/historyTrend',
    {
      params: {
        ids,
        dateType: 'hour',
        startTime,
        endTime,
        index,
      }
    }
  );
}

// 大气环境质量变化趋势月变化
export async function getDataByMonth({ids, startTime, endTime, index}){
  return await http.get(
    // '/dq/statistic/getDataByMonth', 
    '/dq/statistic/historyTrend',
    {
      params: {
        ids,
        dateType: 'day',
        startTime,
        endTime,
        index,
      }
    }
  );
}

// 区域考核排名——page1左下
export async function getLeftBottomData(){
  return await http_json.get('/quyu/quyu.json');
}

// 获取水环境站点列表
export async function getRiverTree(){
  return await http.get('/river/getRiverTree');
}

// 水环境数据——page1右上
export async function getRiverData(pointId){
  return await http.get(
    '/river/getRiverData',
    {
      params: {
        pointId,
        startDate: moment().format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD"),
        page: 1,
        limit: 9999
      }
    }
  );
}

// 水环境质量变化趋势
/**
 * sectionCode,
    dataType,   Rtd | Day | Month
    startTime,  YYYY-MM-DD | YYYY-MM-DD | YYYY-MM
    endTime,    YYYY-MM-DD | YYYY-MM-DD | YYYY-MM
 */
export async function getRiverGridData(data){
  return await http.get(
    '/river/getRiverGridData',
    {
      params: {
        page: 1,
        limit: 9999,
        ...data
      }
    }
  );
}

// 水环境区域统计————page1右下
export async function getHomeStatInfo(){
  return await http.post('/we/area/getHomeStatInfo');
}

// 大气————月历数据 /dq/statistic/getDataByMonth
export async function getMonthCalendar(data){
  return await http.get('/dq/statistic/getDataByMonth', {
    params: data
  });
}

// 大气————污染源  /wuranyuan/air.json
export async function getPollutionListA(){
  return await http_json.get('/wuranyuan/air.json');
}

// 水————污染源   /wuranyuan/water.json
export async function getPollutionListW(){
  return await http_json.get('/wuranyuan/water.json');
}