<template>
    <div class="center-top">
        <!-- <div style="position: absolute; top: 0.2rem; left: 0.2rem;">
            <div class="center-top-title">
                <svg-icon icon-name="jiancedian" class="cus-svg-icon"></svg-icon>
                <span style="font-size: 0.13rem; color: #FFFFFF; margin-left: 0.08rem; vertical-align: middle;">大气环境数据监测点</span>
            </div>
            <div style="text-align: center; font-size: 0.12rem; color: #2766C3;">（位置仅供参考）</div>
        </div> -->
        <div class="center-top-img">
            <div class="center-top-img-map"></div>
            <span
                class="map_point_water"
                v-for="vo in waterPointList" 
                :key="vo.id"
                :style="{top: vo.top, left: vo.left}"
                :id="`map_point_water_${vo.id}`"
            ></span>
            <span 
                class="map_icon" 
                v-for="vo in list" 
                :key="vo.pointId" 
                :style="{backgroundPosition: `${-28*vo['aqi']['icon_x']}px ${-28*vo['aqi']['icon_y']}px`, top: vo.top, left: vo.left}"
                @mouseover="onMouseOver(vo, $event)"
                @mouseout="onMouseOut()"
                @click.stop
            ></span>
            <div class="contentBox" v-if="currInfo.aqi && isShow" :style="{top: infoWinTop+'px', left: infoWinLeft+'px'}" @click.stop>
                <h3 class="title_top">{{ currInfo.pointName }}</h3>
                <hr style="padding:0px;margin:5px 0px;height:1px;background:#34A6CB;">
                <div class="layui-row layui-col-space5">
                    <div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
                        <div class="api_item">
                            <div class="api_title" :style="{background: currInfo.aqi.bgcolor, color: currInfo.aqi.color}">AQI</div>
                            <div class="api_value">
                                {{ currInfo.aqi.value }}
                                <span class="layui-badge" :style="{background: `${currInfo.aqi.bgcolor} !important`, color: `${currInfo.aqi.color} !important`}">{{ currInfo.aqi.level }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="layui-col-xs8 layui-col-sm8 layui-col-md8">
                        <div class="layui-row layui-col-space5">
                            <div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
                                <div class="win_item_box">
                                    <div class="win_title" :style="{background: `${currInfo.pm2_5.bgcolor}`, color: `${currInfo.pm2_5.color}`}">PM2.5</div>
                                    <div class="win_value">{{ currInfo.pm2_5.value }}</div>
                                </div>
                            </div>
                            <div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
                                <div class="win_item_box">
                                    <div class="win_title" :style="{background:`${currInfo.pm10.bgcolor}`, color:`${currInfo.pm10.color}`}">PM10</div>
                                    <div class="win_value">{{ currInfo.pm10.value }}</div>
                                </div>
                            </div>
                            <div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
                                <div class="win_item_box">
                                    <div class="win_title" :style="{background:`${currInfo.o3.bgcolor}`, color:`${currInfo.o3.color}`}">O3</div>
                                    <div class="win_value">{{ currInfo.o3.value }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-row layui-col-space5">
                            <div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
                                <div class="win_item_box">
                                    <div class="win_title" :style="{background:`${currInfo.so2.bgcolor}`, color:`${currInfo.so2.color}`}">SO2</div>
                                    <div class="win_value">{{ currInfo.so2.value }}</div>
                                </div>
                            </div>
                            <div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
                                <div class="win_item_box">
                                    <div class="win_title" :style="{background:`${currInfo.no2.bgcolor}`, color:`${currInfo.no2.color}`}">NO2</div>
                                    <div class="win_value">{{ currInfo.no2.value }}</div>
                                </div>
                            </div>
                            <div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
                                <div class="win_item_box">
                                    <div class="win_title" :style="{background:`${currInfo.co.bgcolor}`, color:`${currInfo.co.color}`}">CO</div>
                                    <div class="win_value">{{ currInfo.co.value }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <h6 class="title_bottom">更新于：{{ currInfo.time }}</h6>
                <div style="height:1px;">
                    <img v-if="arrowIsDown" src="~@/assets/image/down.png" />
                    <img v-else src="~@/assets/image/down.png" style="transform: rotate(180deg); top: -10px;" />
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
    import {getAirQuality, getXiangzhenData} from '@/service/api.js';
    import mapMarkerStyle from '@/utils/mapMarkerStyle';
    import { mapState } from 'vuex';
    import bus from  '@/bus/index';

    export default {
        data() {
            return {
                currInfo: {},
                isShow: false,
                isOver: true,
                infoWinTop: 0,
                infoWinLeft: 0,
                arrowIsDown: true,
                airQualityData: {},
                xiangzhenData: [],
                list: [],
                positionList: [
                    {
                        pointId: "4e4860553999471883954ecde87d540c",    //辛老路
                        top: "40%",
                        left: "29%"
                    },{
                        pointId: "172515c7a57042d19213988d65d2fa00",    //王稳庄镇
                        top: "82%",
                        left: "80%"
                    },{
                        pointId: "38ec3358c4e24869b0a14cdb4a9f5b02",    //辛口镇
                        top: "30.5%",
                        left: "18.2%"
                    },{
                        pointId: "4df4622633de48129826765410abcb96",    //开发区
                        top: "40%",
                        left: "65%"
                    },{
                        pointId: "523a63eeadb2466d8ec147778c5f75fd",    //杨柳青镇
                        top: "17%",
                        left: "29%"
                    },{
                        pointId: "5c10a9d149b2454abfcc4236edae8e45",    //大寺镇
                        top: "40%",
                        left: "70%"
                    },{
                        pointId: "67545bbf23f94a63af8aa2196e343c22",    //精武镇
                        top: "39%",
                        left: "46%"
                    },{
                        pointId: "adb3f2b4a8e54c9db7eed777a070e3f7",    //张家窝镇（参照点）
                        top: "41%",
                        left: "35.2%"
                    },{
                        pointId: "af0dd1c3a32a46a69a5d9259c3827d75",    //中北镇
                        top: "13.2%",
                        left: "41.7%"
                    },{
                        pointId: "b2eb2f142124436098787a688525c67b",    //西营门街
                        top: "2.3%",
                        left: "41.2%"
                    },{
                        pointId: "e48ae20a578d4b08b096fc7d04342eef",    //李七庄街
                        top: "28%",
                        left: "48%"
                    }
                ],
                waterPointList: [],
            }
        },
        computed: {
            ...mapState('page1', ['riverTree'])
        },
        created () {
            this.airQualityData = Object.assign(this.airQualityData, this.$store.state.page1.shizhan.filter(function(v){
                return v.pointId === window.xinlaoluId;	//取的辛老路数据
            })[0]);
            // this.xiangzhenData = Object.assign([], this.$store.state.page1.xiangzhen);
            this.xiangzhenData = this.$store.state.page1.xiangzhen.map(v => Object.assign({}, v));
			this.getAirQuality();
            this.getXiangzhenData();
            this.list = [this.airQualityData].concat(this.xiangzhenData);
            this.list.forEach(v => {
                v.top = this.positionList.filter(function(v1){
                    return v.pointId === v1.pointId
                })[0].top;
                v.left = this.positionList.filter(function(v1){
                    return v.pointId === v1.pointId
                })[0].left;
            })
            this.currInfo = this.list[0];
            // 处理河流pointer数据
            this.waterPointList = this.riverTree.map(v => this.getWaterPointInfo(v));
        },
        mounted () {
            document.addEventListener('click', () => {
                this.isShow = false;
            });
            bus.$on('stationChange', ({currStation}) => {
                const domlist = document.querySelectorAll(`.map_point_water:not(#map_point_water_${currStation})`);
                for(let i=0; i<domlist.length; i++){
                    domlist[i].classList.remove('mapicon_zoom');
                }
                document.querySelector(`#map_point_water_${currStation}`).classList.add("mapicon_zoom");
            });
        },
        methods: {
            // 获取空气质量信息
            getAirQuality() {
                var arr = ['aqi', 'pm2_5', 'pm10', 'so2', 'no2', 'co', 'o3'];
                arr.forEach(v => {
                    this.airQualityData[v] = mapMarkerStyle(v, this.airQualityData[v], 1);
                });
                this.airQualityData['areaType'] = 'shizhan';
			},
			// 获取乡镇数据
			getXiangzhenData() {
                var arr = ['aqi', 'pm2_5', 'pm10', 'so2', 'no2', 'co', 'o3'];
                this.xiangzhenData.forEach(function(v){
                    arr.forEach(function(v1){
                        v[v1] = mapMarkerStyle(v1, v[v1], 2)
                    })
                    v['areaType'] = 'xiangzhen'
                })
            },
            onMouseOver(vo, e) {
                if(this.isOver){
                    this.isShow = true;
                    this.currInfo = vo;
                    if(e.clientY-180-30 <= 0){
                        this.infoWinTop = e.clientY + 40;
                        this.arrowIsDown = false;
                    }else{
                        this.infoWinTop = e.clientY - 180 - 30;
                        this.arrowIsDown = true;
                    }
                    
                    this.infoWinLeft = e.clientX - 130;
                }
                this.isOver = false;
            },
            onMouseOut() {
                this.isOver = true;
            },
            // 处理水环境站点数据
            getWaterPointInfo(v) {
                let opt = {id: v.id, name:v.name, top:'', left:''};
                switch (v.id) {
                    case '1045':            //大柳滩泵站
                        opt.top = '17%';
                        opt.left = '24%';
                        break;
                    case '1044':            //当城桥
                        opt.top = '31%';
                        opt.left = '16.6%';
                        break;
                    case '1106':            //纪庄子桥
                        opt.top = '29%';
                        opt.left = '62.3%';
                        break;
                    case '1042':            //十一堡新桥
                        opt.top = '50%';
                        opt.left = '10%';
                        break;
                    case '19121106':        //天河桥
                        opt.top = '1%';
                        opt.left = '45%';
                        break;
                    case '1046':            //万达鸡场
                        opt.top = '7%';
                        opt.left = '23%';
                        break;
                    case '4178':            //大柳滩
                        opt.top = '22%';
                        opt.left = '25.5%';
                        break;
                    case '19121107':        //复康路桥
                        opt.top = '33%';
                        opt.left = '53.7%';
                        break;
                    default:
                        break;
                }
                return opt
            },
        },
    }
</script>

<style lang="scss" scoped>
    .center-top{
        

        .center-top-img{
            position: absolute;
            left: 50%;
            margin-left: -4.70rem;
            bottom: 0;
            height: 5.24rem;
            width: 9.40rem;

            .center-top-img-map{
                height: 100%;
                width: 100%;
                background: url('~@/assets/image/page1_map.gif') no-repeat center;
                background-size: 100% 100%;
            }
            .map_point_water{
                position: absolute;
                width: 5px;
                height: 5px;
                background-color: #1600ff;
                cursor: pointer;
                transform: scale(1);
                border-radius: 50%;
                box-shadow: 0px 0px 2px 4px #1600ff;
                transition: transform 0.2s linear;
            }
            @keyframes mapiconZoom {
                0%   {
                    transform: scale(1);
                    opacity: 0.5;
                }
                50% {
                    transform: scale(2);
                    opacity: 1;
                }
                100% {
                    transform: scale(1);
                    opacity: 0.5;
                }
            }
            @-webkit-keyframes mapiconZoom {
                0%   {
                    -webkit-transform: scale(1);
                    opacity: 0.5;
                }
                50% {
                    -webkit-transform: scale(2);
                    opacity: 1;
                }
                100% {
                    -webkit-transform: scale(1);
                    opacity: 0.5;
                }
            }
            .mapicon_zoom{
                background-color: #ff3d00;
                box-shadow: 0px 0px 2px 4px #ff3d00;
                animation: mapiconZoom 0.66s linear infinite forwards;
                -webkit-animation: mapiconZoom 0.66s linear infinite forwards;
            }
            .map_icon{
                position: absolute;
                width: 28px;
                height: 28px;
                background-image: url('~@/assets/image/icon_dong.gif');
                background-repeat: no-repeat;
                background-position: -28px -28px;
                cursor: pointer;
                transform: scale(0.8);
                transition: transform 0.2s linear;
                border-radius: 50%;
            }
            .map_icon:hover{
                transform: scale(1);
            }
        }

        .cus-svg-icon{
            width: 0.25rem;
            height: 0.25rem;
            vertical-align: middle;
        }
        .center-top-title{
            background-color: rgba(8, 40, 113, 0.59); 
            height: 0.32em; 
            line-height: 0.05; 
            padding: 0 0.08rem; 
            border-radius: 0.03rem;
            @include text-beyond;
        }
    }

    // 以下样式专为百度地图弹框服务
    .BMap_bubble_title {
        color:white;
        font-size:13px;
        font-weight:bold;
        text-align:left;
        padding-left:5px;
        padding-top:5px;
        border-bottom:1px solid gray;
        background-color:#605ca8;
    }
    .BMap_bubble_content {
        background-color:white;
        padding-left:3px;
        padding-right: 3px;
        padding-top:3px;
        padding-bottom:3px;
        border-radius: 3px;
    }
    .windowTable td.title{
        text-align: center;
        width: 25%;
        background: #34A6CB;
        color: white;
    }
    .windowTable td.value{
        text-align: center;
        width: 25%;
        font-size: 18px;
        font-weight: bold;
    }
    .BMap_pop>img{
        display: none;
    }
    .BMap_pop>div:nth-child(5) {
        display: none;
    }
    .BMap_pop>div:nth-child(8)>img {
        display: none;
    }
    .BMap_pop>div:nth-child(9) {
        top:35px !important;
        border-radius:7px;
    }
    .BMap_top {
        display:none;
    }
    .BMap_bottom {
        display:none;
    }
    .BMap_center {
        display:none;
    }
    .BMap_pop>div:nth-child(1) div {
        display:none;
    }
    .BMap_pop>div:nth-child(3) {
        display:none;
    }
    .BMap_pop>div:nth-child(7) {
        display:none;
    }
    .BMap_pop>div:nth-child(8) {
        top: 162px!important;
    }
    .BMap_pop>div:nth-child(9) {
        overflow: visible!important;
        height: auto!important;
    }
    .title_top{
        background: url("~@/assets/image/dian.png");
        background-position: left center;
        padding-left: 15px;
        background-size: 8px 8px;
        background-repeat: no-repeat;
        font-size: 0.18rem;
        font-weight: 400;
        line-height: 100%;
        margin: 0;
        text-align: left;
        color: #000;
    }
    .tipBoxItem{
        border: 1px solid #ccc;
        border-radius: 8px;
        overflow: hidden;
    }
    .layui-layer-adminRight{
        top: 0px!important;
    }
    .layui-layer-setwin .layui-layer-close2{
        right: -5px!important;
        top: -9px!important;
    }
    .layui-layer-adminRight>div.layui-layer-btn{
        position: fixed;
        right: 0px;
        bottom: 0px;
    }
    .contentBox{
        padding: 10px;
        box-sizing: border-box;
        width:250px; 
        background-color:#FFFFFF;
        position: fixed;
        top: 0;
        left: 0;
        border-radius: 3px;
        box-shadow: 0px 0px 80px 3px #000;
    }
    .contentBox .title_bottom{
        text-align: right;
        font-size: 0.15rem;
        font-weight: 400;
        line-height: 100%;
        margin: 0;
        color: rgb(0, 0, 0);
        padding-top: 5px;
    }
    .contentBox .title{
        background:#13aeff; 
    }
    .contentBox>div>img{
        position: absolute;
        bottom: -10px;
        left: 108px;
    }
    .contentBox .api_item{
        border: 1px solid #ccc;
        text-align: center;
        height: 110px;
        line-height: 50%;
        border-radius: 5px;
    }
    .contentBox .api_title{
        height: 45px;
        line-height: 43px;
        color: white;
        font-size: 25px;
        font-weight: bold;
    }
    .contentBox .api_value{
        position: relative;
        height: 70px;
        line-height: 47px;
        font-size: 25px;
        font-weight: bold;
        color: rgb(0, 0, 0);
    }
    .contentBox .api_value .layui-badge{
        height: 20px;
        position: absolute;
        left: 0px;
        width: 100%;
        line-height: 19px;
        bottom: 5px;
        box-sizing: border-box;
    }
    .contentBox .win_title{
        color: white;
        height: 25px;
        line-height: 25px;
        text-align: center;
    }
    .contentBox .win_value{
        height: 25px;
        line-height: 25px;
        text-align: center;
        color: rgb(0, 0, 0);
        font-size: 14px;
    }
    .contentBox .win_item_box{
        border: 1px solid #ccc;
        border-radius: 5px;
        overflow: hidden;
        font-size: 0.15rem;
    }
</style>