<template>
    <div class="cus-header-right">
        <span class="cus-weather-outer">
            <div class="cus-weather-inner">
                <div class="cus-weather-item" style="width: 30%;">
                    <i class="cus-weather-icon" :style=" { backgroundImage: 'url(' + weatherData.weather_icon +')' } "></i>
                    <span style="margin-left: 6%">{{ weatherData.degree }}℃</span>
                </div>
                <div class="cus-weather-item" style="width: 40%;">
                    <svg-icon icon-name="shidu" class="cus-svg-icon" color="#417CDA"></svg-icon>
                    <span style="margin-left: 4%">湿度{{ weatherData.humidity }}%</span>
                </div>
                <div class="cus-weather-item" style="width: 30%;">
                    <svg-icon icon-name="fengxiang" class="cus-svg-icon" color="#417CDA"></svg-icon>
                    <span style="margin-left: 6%">{{ weatherData.wind_direction }}</span>
                </div>
            </div>
        </span>
        <svg-icon icon-name="yonghu" class="cus-svg-icon" style="margin-left: 3%;"></svg-icon>
        <span style="vertical-align: middle; margin-left: 1%;">超级管理员</span>
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

    export default {
        data() {
            return {
                weatherData: {},    //天气数据
            }
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
        
            // views/index2.html?menuId=e1f1e7bb0d974d3eac60447dc4262354
            navToSetting() {
                window.open(`${this.$store.state.pageUrl}views/index2.html?menuId=e1f1e7bb0d974d3eac60447dc4262354&menuName=设置中心`, '_self', '', false);
            },
        }
    }
</script>

<style lang="scss" scoped>
    .cus-header-right{
        font-size: 0.13rem;
        color: #ffffff;
        font-weight: 400;

        .cus-weather-outer{
            display: inline-block;
            width: 55%; 
            height: 0.3rem; 
            border: 1px solid #379CCA;
            vertical-align: middle;

            .cus-weather-inner{
                height: 100%;
                border: 1px solid transparent;
                box-shadow: 0 0 3px 1px #385cb5 inset;
                overflow: hidden;
                
                .cus-weather-item{
                    float: left;
                    text-align: center;
                    @include text-beyond;
                }

                .cus-weather-icon{
                    display: inline-block;
                    width: 0.15rem;
                    height: 0.15rem;
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: cover;
                    vertical-align: middle;
                }
                span{
                    vertical-align: middle;
                }
            }
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