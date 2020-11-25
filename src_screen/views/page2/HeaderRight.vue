<template>
    <div class="cus-header-right">
        <svg-icon icon-name="weizhi" class="cus-svg-icon" style="margin-left: 4%;"></svg-icon>
        <span style="margin-left: 2%; vertical-align: middle;">西青区</span>
        <i class="cus-weather-icon" :style=" { backgroundImage: 'url(' + weatherData.weather_icon +')', marginLeft: '5%' } "></i>
        <span style="margin-left: 2%; vertical-align: middle;">{{ weatherData.weather }}</span>
        <span style="margin-left: 2%; vertical-align: middle;">{{ weatherData.degree }}℃</span>
        <svg-icon icon-name="yonghu" class="cus-svg-icon" style="margin-left: 5%;"></svg-icon>
        <span style="vertical-align: middle; margin-left: 1%;">{{ userinfo && userinfo.realName }}</span>
        <i class="cus-screen-icon" style="margin-left: 3%;"></i>
        <svg-icon icon-name="shezhi" 
                class="cus-svg-icon" 
                color="#FFFFFF" 
                style="width: 0.25rem; height: 0.25rem; margin-left: 2%; cursor: pointer;"
                @click="navToSetting()"
            >
        </svg-icon>
    </div>
</template>

<script>
    import jsonp from 'jsonp'
    import { o2u } from '@/utils/util'
    import { mapState } from 'vuex'

    export default {
        data() {
            return {
                weatherData: {},    //天气数据
            }
        },
        computed: {
            ...mapState('userinfo', ['userinfo'])
        },
        mounted() {
            this.getWeatherData()
        },
        methods: {
            getWeatherData() {
                let url = "https://wis.qq.com/weather/common";
                let params = {
                    source: 'pc',
                    weather_type: 'observe',    // forecast_1h | forecast_24h | index | alarm | tips | air | rise
                    province: '天津',
                    city: '天津',
                    county: '西青'
                };
                url += (url.indexOf('?')<0? '?':'&') + o2u(params);
                let opts = null;
                jsonp(url, opts, (err, res) => {
                    if(!err){
                        this.weatherData = res.data.observe;
                        var windMap = {
                            "0": "无持续风向",
                            "1": "东北风",
                            "2": "东风",
                            "3": "东南风",
                            "4": "南风",
                            "5": "西南风",
                            "6": "西风",
                            "7": "西北风",
                            "8": "北风",
                            "9": "旋转风"
                        };
                        this.weatherData.wind_direction = windMap[this.weatherData.wind_direction];
                        this.weatherData.weather_icon = `//mat1.gtimg.com/pingjs/ext2020/weather/pc/icon/currentweather/day/${this.weatherData.weather_code}.png`;
                    } else {
                        console.log(err);
                    }
                });
            },

            navToSetting() {
                window.open(`${process.env.VUE_APP_PAGEURL}views/index2.html?menuId=e1f1e7bb0d974d3eac60447dc4262354&menuName=设置中心`, '_self', '', false);
            },
        }
    }
</script>

<style lang="scss" scoped>
    .cus-header-right{
        font-size: 0.13rem;
        color: #ffffff;
        font-weight: 400;

        .cus-weather-icon{
            display: inline-block;
            width: 0.2rem;
            height: 0.2rem;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            vertical-align: middle;
        }
        .cus-svg-icon{
            width: 0.2rem;
            height: 0.2rem;
            vertical-align: middle;
        }
        .cus-screen-icon{
            display: inline-block;
            width: 0.25rem;
            height: 0.25rem;
            background: url("~@/assets/image/normalscreenicon.png") no-repeat center;
            background-size: cover;
            vertical-align: middle;
            cursor: pointer;
        }
    }
</style>