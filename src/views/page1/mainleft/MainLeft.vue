<template>
    <div class="main-left">
        <block-container _title="大气环境实时数据" height="2.67rem">
            <div style="width: 100%; height: 100%; dispaly: flex; display:-webkit-flex;">
                <div class="left_1_1">
                    <div class="left_1_1_rotate_outer" ref="left_1_1_rotate_outer"></div>
                    <div class="left_1_1_rotate_inner" ref="left_1_1_rotate_inner"></div>
                    <div class="left_1_1_text">
                        <p style="color: #F6FFFF; font-size: 0.3rem;">{{ xinlaoluData.aqi.value }}</p>
                        <p style="font-size: 0.18rem; color: #F6FFFF; margin-top:0.1rem;">
                            AQI
                            <span :style="{color: xinlaoluData.aqi.bgcolor }">{{ xinlaoluData.aqi.level }}</span>
                        </p>
                    </div>
                </div>
                <div class="left_1_2">
                    <div class="left_1_2_item" v-for="vo in left_1_2_list" :key="vo.name">
                        <span style="color: #F2FFFF; width: 0.5rem; text-align: right;">{{ vo.name }}</span>
                        <div class="item_outer">
                            <div class="item_inner" :style="{width: vo.percentage, background: vo.bgcolor}"></div>
                        </div>
                        <span style="color: #F2FFFF; width: 0.5rem; text-align: center; margin: 0;">{{ parseInt(vo.value) }}</span>
                        <span :style="{color: vo.bgcolor, width: '0.5rem', margin: '0'}">{{ vo.level }}</span>
                    </div>
                </div>
            </div>
        </block-container>
        <block-container _title="大气环境质量变化趋势" height="3.63rem">
            <div style="position: relative; height: 100%; padding-top: 0.35rem;" 
                @mouseenter="stopAutoSwitch(); mouseIsInSelf=true;" 
                @mouseleave="mouseleaveIsOpenTimer1 && zbAutoSwitch(); mouseIsInSelf=false;"
            >
                <div class="left_2_tab" style="position: absolute; width: 100%; height: 0.35rem; top: 0; left: 0;">
                    <div class="left_2_tab_item"
                        :class="{ 'left_2_tab_item_active': vo.name === currzb_1 }" 
                        v-for="(vo, index) in zblist" 
                        :key="vo.name" 
                        v-html="vo.bigName"
                        @click="tabItemClick(vo, index, $event)"
                    >
                    </div>
                </div>
                <div style="height: 100%; position: relative;" id="left_2_1">
                    <div class="cus_tab_order">
                        <div class="cus_tab_order_item cus_tab_order_active" @click="switchDayOrMonth('day', $event)">日变化</div>
                        <div class="cus_tab_order_item" @click="switchDayOrMonth('month', $event)">月变化</div>
                    </div>
                    <div style="height: 100%;" ref="left_2_1"></div>
                </div>
            </div>
        </block-container>
        <block-container _title="大气环境质量天津市考核排名" height="3.41rem">
            <div style="position: relative; height: 100%; padding-top: 0.35rem;" @mouseover="stopAutoSwitch_2()" @mouseout="zbAutoSwitch_2()">
                <div class="left_2_tab" style="position: absolute; width: 100%; height: 0.35rem; top: 0; left: 0;">
                    <div class="left_2_tab_item" 
                        :class="{ active: true, 'left_2_tab_item_active': vo.name === currzb_2 }" 
                        v-for="(vo, index) in zblist"
			            :key="vo.name" 
                        v-html="vo.bigName" 
                        @click="currzb_2=vo.name; index_2=index">
			        </div>
                </div>
                <div style="height: 100%; position: relative;" id="left_3_1">
                    <div class="cus_tab_order">
                        <div class="cus_tab_order_item cus_tab_order_active" @click="switchAscOrDesc('desc', $event)">正序</div>
                        <div class="cus_tab_order_item" @click="switchAscOrDesc('asc', $event)">倒序</div>
                    </div>
                    <div style="height: 100%;" ref="left_3_1"></div>
                </div>
            </div>
        </block-container>
    </div>
</template>

<script>
    import BlockContainer from "@/components/BlockContainer";
    import { mapActions, mapState } from "vuex";
    import mapMarkerStyle from '@/utils/mapMarkerStyle';
    import getColorArr from '@/utils/getColorArr';
    import airNormlist from "@/mock/airNormlist.js";
    import { getDataByDay } from "@/service/api.js";
    import moment from 'moment';
    import { Loading } from 'element-ui';

    export default {
        data() {
            return {
               xinlaoluData: {},
               left_1_2_list: [],
               zblist: airNormlist.data,

               xinlaoluTime: '',

               currzb_1: '', //左中的当前指标
               currtimetype_1: 'day',   // 左中的当前时间类型
               timer_1: '',     //左中定时器
               index_1: 0,      //左中计数器
               mouseleaveIsOpenTimer1: true,
               mouseIsInSelf: false,
               timer1IsOpen: false,

               currzb_2: 'aqi', //左下的当前指标
               order_2: 'desc',   // 左下的当前排序方式
               timer_2: '',     //左下定时器
               index_2: 0,      //左下计数器
            }
        },
        components: {
            BlockContainer,
        },
        computed: {
            ...mapState('page1', ['shizhan', 'dataByDay', 'dataByMonth', 'leftBottomData'])
        },
        beforeMount () {
            this.handleData1();    //左上角不牵扯dom，挂载之前将数据准备好
        },
        async mounted () {
            /**
             * 这是一堆初始化工作
             */
            this.calcLeft_1_1_rotate_height();
            window.addEventListener('resize', () => {
                this.calcLeft_1_1_rotate_height();
            });
            this.handleData2();     //echarts元素已挂载
            this.handleData3();     //echarts元素已挂载
            this.zbAutoSwitch_2();  //左下角的数据
            
            this.xinlaoluTime = Object.assign({}, this.shizhan.filter(v => v.pointId===window.xinlaoluId)[0])['time'];
            // 1、先获取第一个指标的数据展示到页面
            await this.getXinlaoluR({
                ids: window.xinlaoluId,
                time: moment(this.xinlaoluTime).format("YYYY-MM-DD"),
                index: this.zblist[0]['index'],
                name: this.zblist[0]['name']
            });
            this.currzb_1 = this.zblist[this.index_1]['name'];
            // 2、再获取剩余的其他指标的数据，并开启状态变化，开启定时器
            await this.getXinlaoluR_batch({
                xinlaoluTime: this.xinlaoluTime,
                zblist: this.zblist
            });
            if(!this.mouseIsInSelf && !this.timer1IsOpen){
                this.zbAutoSwitch();
            }
        },
        beforeDestroy () {
            //清除定时器
            this.stopAutoSwitch();
            this.stopAutoSwitch_2();
        },
        watch: {
            currzb_1(now, old) {
                this.handleData2();
            },
            // currtimetype_1(now, old) {
            //     this.handleData2();
            // },
            currzb_2(now, old) {
                this.handleData3();
            },
            order_2(now, old) {
                this.handleData3();
            }
        },
        methods: {
            ...mapActions('page1', ['getXinlaoluR', 'getXinlaoluR_batch', 'getXinlaoluD_batch']),
            // 动态计算left_1的圆圈的高度
            calcLeft_1_1_rotate_height() {
                const outerwidth = this.$refs.left_1_1_rotate_outer.clientWidth;
                this.$refs.left_1_1_rotate_outer.style.height = outerwidth + "px";
                this.$refs.left_1_1_rotate_inner.style.width = outerwidth * 0.9411764705882353 + "px";
                this.$refs.left_1_1_rotate_inner.style.height = outerwidth * 0.9411764705882353 + "px";
            },
            // left_1
            handleData1 () {
                this.xinlaoluData = Object.assign(this.xinlaoluData, this.shizhan.filter( v => v.pointId === window.xinlaoluId)[0]);
                airNormlist.data.forEach(v => {
                    this.xinlaoluData[v.name] = mapMarkerStyle(v.name, this.xinlaoluData[v.name]);
                    const vname = this.xinlaoluData[v.name];
                    const percentage = Number(vname['value']) / (v['max'] - v['min'])>1 ? 1 : Number(vname['value']) / (v['max'] - v['min']);
                    this.xinlaoluData[v.name]['percentage'] = percentage*100 + '%';
                });
                this.left_1_2_list = airNormlist.data.map( v => {
                    return Object.assign(this.xinlaoluData[v.name], {
                        name: v.name === 'pm2_5' ? 'pm2.5' : v.name
                    })
                }).filter( v => v.name !== 'aqi');
            },
            // left_2
            async tabItemClick (vo, index, e) {
                if(!this.dataByDay[vo.name]){
                    this.mouseleaveIsOpenTimer1 = false;
                    const loading = Loading.service({
                        target: e.currentTarget,
                        lock: true,
                        text: '',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.8)'
                    });
                    await this.getXinlaoluR({
                        ids: window.xinlaoluId,
                        time: moment(this.xinlaoluTime).format("YYYY-MM-DD"),
                        index: vo.index,
                        name: vo.name
                    });
                    loading.close();
                    if(!this.mouseIsInSelf && !this.timer1IsOpen){
                        this.zbAutoSwitch();
                    }
                    this.mouseleaveIsOpenTimer1 = true;
                }
                this.currzb_1 = vo.name;
                this.index_1 = index;
            },
            async handleData2 (e = null) {
                let odata;
                if(this.currtimetype_1 === 'day'){
                    odata = this.dataByDay;
                }else if(this.currtimetype_1 === 'month'){
                    if(this.dataByMonth[this.currzb_1]){
                        odata = this.dataByMonth;
                    }else{
                        this.mouseleaveIsOpenTimer1 = false;
                        const loading = Loading.service({
                            target: e.currentTarget,
                            lock: true,
                            text: '',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.8)'
                        });
                        await this.getXinlaoluD_batch({
                            xinlaoluTime: this.xinlaoluTime,
                            zblist: this.zblist
                        });
                        loading.close();
                        if(!this.mouseIsInSelf && !this.timer1IsOpen){
                            this.zbAutoSwitch();
                        }
                        this.mouseleaveIsOpenTimer1 = true;
                        odata = this.dataByMonth
                    }
                }
                let x = [], y=[];
                const zb = this.currzb_1;
                if(odata[zb] && odata[zb].length > 0){
                    const step1 = Object.keys(odata[zb][0]).filter(v => v!=='id'&&v!=='name');
                    const step2 = step1.sort((v1, v2) => v1-v2);
                    const step3 = step2.map(v => odata[zb][0][v]);
                    x = step2;
                    y = step3;
                }else{
                    for(let i=0; i<24; i++){
                        x.push(i<10 ? '0'+i : ''+i);
                        y.push('');
                    }
                }
                this.initCharts_2(x, y);
            },
            switchDayOrMonth (timetype, e) {
                if(!e.target.classList.contains('cus_tab_order_active')){
                    const tabList = document.querySelectorAll("#left_2_1 .cus_tab_order_item");
                    for(let i=0; i<tabList.length; i++){
                        tabList[i].classList.remove('cus_tab_order_active');
                    }
                    e.target.classList.add('cus_tab_order_active');
                    this.currtimetype_1 = timetype;
                    this.handleData2(e)
                }
            },
            zbAutoSwitch () {
                console.log('定时器开启');
                this.timer1IsOpen = true;
                // 立马执行一次
                this.index_1++;
                if(this.index_1 >= this.zblist.length){
                    this.index_1 = 0;
                }
                this.currzb_1 = this.zblist[this.index_1].name;
                // 同时开启定时器
                this.timer_1 = setInterval(() => {
                    this.index_1++;
                    if(this.index_1 >= this.zblist.length){
                        this.index_1 = 0;
                    }
                    this.currzb_1 = this.zblist[this.index_1].name;
                }, 5000);
            },
            stopAutoSwitch () {
                console.log('定时器关闭');
                this.timer1IsOpen = false;
                clearInterval(this.timer_1);
            },
            // left_3
            handleData3 () {
                // this.order_2             asc | desc
                const odata = this.leftBottomData;
                let x = [], y=[], colors=[];
                const zb = this.currzb_2;
                let tempArr = [];
                if(odata && odata.length > 0){
                    tempArr = odata.map(v => {
                        return {
                            x: v.pointName,
                            y: v[zb],
                            color: getColorArr(zb, (''+v[zb]).split()).join()
                        }
                    });
                    tempArr.sort((v1, v2) => this.order_2 === 'asc' ? (v1.y-v2.y) : (v2.y-v1.y));
                    x = tempArr.map(v => v.x);
                    y = tempArr.map(v => v.y);
                    colors = tempArr.map(v => v.color);
                }else{
                    x = ["南开区", "和平区", "滨海新区", "武清区", "河西区", "北辰区", "宁河区", "宝坻区", "西青区", "河东区", "东丽区", "蓟州区", "红桥区", "河北区", "静海区", "津南区"]
                    x.forEach(function(v){
                        y.push('');
                        colors('rgba(0,0,0,0)');
                    })
                }
                this.initCharts_3(x, y, colors);
            },
            switchAscOrDesc (ordertype, e) {
                if(!e.target.classList.contains('cus_tab_order_active')){
                    const tabList = document.querySelectorAll("#left_3_1 .cus_tab_order_item");
                    for(let i=0; i<tabList.length; i++){
                        tabList[i].classList.remove('cus_tab_order_active');
                    }
                    e.target.classList.add('cus_tab_order_active');
                    this.order_2 = ordertype;
                }
            },
            zbAutoSwitch_2 () {
                // 立马执行一次
                this.currzb_2 = this.zblist[this.index_2].name;
                this.index_2++;
                if(this.index_2 >= this.zblist.length){
                    this.index_2 = 0;
                }
                // 同时开启定时器
                this.timer_2 = setInterval(() => {
                    this.currzb_2 = this.zblist[this.index_2].name;
                    this.index_2++;
                    if(this.index_2 >= this.zblist.length){
                        this.index_2 = 0;
                    }
                }, 5000);
            },
            stopAutoSwitch_2 () {
                clearInterval(this.timer_2)
            },
            
            // echarts图表渲染方法
            initCharts_2 (x, y) {
                const _echarts = this.$echarts;
            　　let myChart = _echarts.init(this.$refs.left_2_1);
            　　// 绘制图表
                var data_val = y,
                    xdata = x;
            　　myChart.setOption({
                    grid: {
                        left: '4%',
                        right: '4%',
                        bottom: '10%',
                        top: '20%',
                        containLabel: true
                    },
                    tooltip: {
                        show: true,
                        trigger: 'axis',
                        // backgroundColor: '#E8E093',
                        // borderColor: '#E8E093',
                        // borderWidth: 4,
                        // textStyle: {
                        //     color: '#354060'
                        // },
                        formatter: '{b} : {c}',
                        // extraCssText: 'box-shadow: 0 0 10px rgba(37,47,77,0.8)'
                    },
                    xAxis: {
                        type: 'category',
                        data: xdata,
                        boundaryGap: false,
                        axisLabel: {
                            // interval: 0,
                            textStyle: {
                                color: "#EBFAFF",
                                fontSize: 9
                            }
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "#4F84A3"
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisPointer: {	//指示器
                            type: 'line',
                            lineStyle: {
                                color: "rgba(255,255,255,0.3)",
                                width: 1,
                                type: "dotted"
                            }
                        },
                    },
                    yAxis: {
                        name: "单位",
                        nameTextStyle: {
                            color: "#EBFAFF",
                            fontSize: 10
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "#5B88B2",

                            }
                        },
                        axisTick: {
                            show: true
                        },
                        axisLabel: {
                            color: "#EBFAFF",
                            fontSize: 9
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#09173C',
                                width:  1
                            }
                        },

                    },
                    series: [{
                            type: 'bar',
                            name: 'linedemo',
                            tooltip: {
                                show: false
                            },
                            animation: false,
                            barWidth: 1,
                            hoverAnimation: false,
                            data: data_val,
                            itemStyle: {
                                normal: {
                                    color: new _echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: '#50C0C1'
                                    }, {
                                        offset: 1,
                                        color: '#0D1B40'
                                    }]),
                                    opacity: 0.6,
                                    label: {
                                        show: false
                                    }
                                }
                            }
                        },
                        {
                            type: 'line',
                            name: 'linedemo',
                            smooth: false,
                            symbolSize: 8,
                            animation: true,
                            lineWidth: 1.2,
                            hoverAnimation: true,
                            data: data_val,
                            symbol: 'emptyCircle',
                            itemStyle: {
                                normal: {
                                    color: '#36F4DA',
                                    shadowBlur: 10,
                                    shadowColor: "rgba(37,47,77,0.8)",
                                    label: {
                                        show: false,
                                        position: 'top',
                                        textStyle: {
                                            color: '#36F4DA',
                                            fontSize: 9
                                        }
                                    }
                                }
                            },
                        }
                    ]
                });
        　　    window.addEventListener("resize", function () {
                    myChart.resize();
                });
            },
            initCharts_3 (x, y, colors) {
                const _echarts = this.$echarts;
                let myChart = _echarts.init(this.$refs.left_3_1);
                const data_x = x;
                const data_val = y;
                const color1 = colors;
                const color2 = colors.map(v => 'rgba(0,0,0,0.1)');
                // const color1=["rgba(20,161,144,1)", "rgba(44,222,186,1)", "rgba(55,222,170,1)", "rgba(42,255,131,1)", "rgba(88,251,124,1)", "rgba(136,246,99,1)", "rgba(167,227,54,1)", "rgba(182,217,35,1)", "rgba(228,242,0,1)", "rgba(244,223,12,1)"]
                // const color2=["rgba(20,161,144,0.2)", "rgba(44,222,186,0.2)", "rgba(55,222,170,0.2)", "rgba(42,255,131,0.2)", "rgba(88,251,124,0.2)", "rgba(136,246,99,0.2)", "rgba(167,227,54,0.2)", "rgba(182,217,35,0.2)", "rgba(228,242,0.2)", "rgba(244,223,12,0.2)"]
            　　myChart.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '7%',
                        right: '3%',
                        bottom: '20%',
                        top: '23%'
                    },
                    xAxis: [{
                        type: 'category',
                        data: data_x,
                        axisPointer: {	//指示器
                            type: 'line',
                            lineStyle: {
                                color: "rgba(255,255,255,0.3)",
                                width: 1,
                                type: "dotted"
                            }
                        },
                        axisLabel: {
                            interval: 0,
                            color: '#EBFAFF',
                            fontSize: 10,
                            margin: 4,
                            formatter:function(value,index) {
                                var ret = "";//拼接加\n返回的类目项  
                                var maxLength = 1;//每项显示文字个数  
                                var valLength = value.length;//X轴类目项的文字个数  
                                var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
                                if (rowN > 1)//如果类目项的文字大于3,  
                                {  
                                    for (var i = 0; i < rowN; i++) {  
                                        var temp = "";//每次截取的字符串  
                                        var start = i * maxLength;//开始截取的位置  
                                        var end = start + maxLength;//结束截取的位置  
                                        //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
                                        temp = value.substring(start, end) + "\n";  
                                        ret += temp; //凭借最终的字符串  
                                    }  
                                    return ret;  
                                }  
                                else {  
                                    return value;  
                                }  
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: '#4785AE',
                                width: 1
                            }
                        },
                        axisTick: {
                            show: false
                        }
                    }],
                    yAxis: [
                        {
                            type: 'value',
                            name: "单位",
                            nameTextStyle: {
                                color: "#EBFAFF",
                                fontSize: 10
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: "#142247",

                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    type: 'solid',
                                    color: '#4785AE',
                                    width: 1
                                }
                            },
                            axisLabel: {
                                formatter: '{value}',
                                margin: 4,
                                color: '#EBFAFF',
                                fontSize: 9
                            },
                            axisTick: {
                                inside: false,
                                length: 3
                            }
                        }
                    ],
                    series: [
                        {
                            name: '参数',
                            type: 'bar',
                            barMaxWidth: 10,
                            itemStyle: {
                                normal: {
                                    barBorderRadius: [5,5,0,0],
                                    color: function(p) {
                                        return new _echarts.graphic.LinearGradient(
                                            0,0,0,1,[
                                                {
                                                    offset: 0,
                                                    color: color1[p.dataIndex]
                                                }, {
                                                    offset: 1,
                                                    color: color2[p.dataIndex]
                                                }
                                            ]
                                        )
                                    }
                                },
                            },
                            data: data_val
                        }
                    ]
                });
        　　    window.addEventListener("resize", function () {
                    myChart.resize();
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .main-left{

        .left_1{
            display: flex;
            display: -webkit-flex;
        }
        .left_1_1{
            width: 30.802%;
            height: 100%;
            position: relative;

            .left_1_1_rotate_outer{
                position: absolute;
                width: 100%;
                z-index: 1;
                left: 0;
                top: 50%;
                transform: translateY(-50%) rotate(0deg) scale(0.95);
                background: url("~@/assets/image/circle-outer.png") no-repeat center;
                background-size: 100% 100%;
                animation: antiClockWiseRotate 6.8s linear infinite;
            }
            .left_1_1_rotate_inner{
                position: absolute;
                z-index: 2;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%) rotate(0deg) scale(0.95);
                background: url("~@/assets/image/circle-inner.png") no-repeat center;
                background-size: 100% 100%;
                animation: clockWiseRotate 6.8s linear infinite;
            }
            .left_1_1_text{
                position: absolute;
                width: 100%;
                height: 100%;
                display: flex;
                display: -webkit-flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-weight: 600;
                z-index: 9;
            }
        }
        .left_1_2{
            flex-grow: 1;
            display: flex;
            display: -webkit-flex;
            flex-direction: column;
            padding-left: 0.1rem;

            .left_1_2_item{
                flex-grow: 1;
                display: flex;
                display: -webkit-flex;
                font-size: 0.13rem;
                align-items: center;
                
                *{
                    margin: 0 0.05rem;
                }
                .item_outer{
                    flex: 1;
                    height: 0.15rem;
                    border: 1px solid #1A3C55;
                    background-color: #00182C;
                    border-radius: 2px;
                }
                .item_inner{
                    height: 100%;
                    border-radius: 2px;
                    margin: 0;
                }
            }
        }
        .left_2_tab{
            display: -webkit-flex;
            display: flex;
            justify-content: space-between;
        }
        .left_2_tab_item{
            height: 100%;
            line-height: 0.35rem;
            text-align: center;
            color: #FFFFFF;
            font-size: 0.14rem;
            background-color: #0D4884;
            border: 1px solid #8BABFE;
            width: 13.9%;
            cursor: pointer;

            /deep/ .el-loading-spinner{
                margin-top: -0.175rem;
            }
        }
        .left_2_tab_item_active{
            background-color: #3349F5;
        }
        .cus_tab_order {
            position: absolute;
            width: 1.5rem;
            height: 0.2rem;
            top: 0.05rem;
            right: 0;
            display: -webkit-flex;
            display: flex;
            justify-content: space-between;
            z-index: 99;
        }
        .cus_tab_order_item{
            width: 49.8%;
            height: 100%;
            line-height: 0.2rem;
            text-align: center;
            font-size: 0.12rem;
            color: #FFFFFF;
            background-color: #002B58;
            border-radius: 0.02rem;
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: clip;

            /deep/ .el-loading-spinner{
                margin-top: -0.1rem;
            }
        }
        .cus_tab_order_active{
            background-color: #00A2FF;
        }
    }
</style>