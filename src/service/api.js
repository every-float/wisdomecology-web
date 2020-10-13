import axios from 'axios';

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
        let token = localStorage.getItem('token');
        if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
          config.headers.authorization = `token ${token}`;
        }
        return config;
      },
      err => {
        return Promise.reject(err);
      }
    );
    install.interceptors.response.use(
      res => {
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

const request = new HttpRequest({
  baseURL: 'https://www.wisdomjyhc.com:18091/bigdata/file/wisdomecology'
});

const http = request.request();

// 获取市站数据
export async function getAirQuality(){
  return await http.get('/shizhan/shizhan.json');
}

// 获取乡镇数据
export async function getXiangzhenData(){
  return await http.get('/xiangzhen/xiangzhen.json');
}