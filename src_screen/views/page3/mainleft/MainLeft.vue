<template>
    <div class="main-left">
        <block-container _title="水环境实时数据" height="2.95rem">
            <div class="right_1_con">
                <div class="right_1_data">
                    <div class="right_1_data_l" ref="right_1_1"></div>
                    <div class="right_1_data_r">
                        <div class="cus_bar_con"
                            v-for="vo in zblist_1"
                            :key="vo.name"
                        >
                            <div class="cus_bar_text">{{ vo.bigName }}</div>
                            <div class="cus_bar_shade">
                                <span class="cus_bar_main" 
                                    :style="{backgroundColor: vo.barColor, width: vo.percentage}"
                                >
                                    <span>{{ vo.value }}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right_btns_area">
                    <div class="right_btns_item"
                        v-for="(vo, index) in riverTree"
                        :key="vo.id"
                        :class="{ 'right_btns_item_active': vo.id === currStation_1 }"
                        :title="vo.name"
                        @click="btnItemClick(vo, index, $event)"
                    >
                        {{ vo.name }}
                    </div>
                </div>
            </div>
        </block-container>
        <block-container _title="水环境质量变化趋势" height="3.36rem">
            <div style="height: 100%; position: relative;" id="right_2_1">
                <div class="cus_tab_order">
                    <div class="cus_tab_order_item cus_tab_order_active" @click="switchDayOrMonth('std', $event)">日变化</div>
                    <div class="cus_tab_order_item" @click="switchDayOrMonth('day', $event)">月变化</div>
                </div>
                <div style="height: 100%;" ref="right_2_1"></div>
            </div>
        </block-container>
        <block-container _title="水环境质量天津市考核排名" height="3.40rem">
            <div style="position: relative; height: 100%; padding-top: 0.35rem;" 
                @mouseenter="stopAutoSwitch_3()" 
                @mouseleave="zbAutoSwitch_3()"
            >
                <div class="right_3_tab" style="position: absolute; width: 100%; height: 0.35rem; top: 0; left: 0;">
                    <div class="right_3_tab_item"
                        v-for="(vo, index) in zblist_3"
                        :class="{ active: true, 'right_3_tab_item_active': vo.name === currzb_3 }"
                        :key="vo.name"
                        @click="currzb_3=vo.name; index_3=index"
                    >
                        {{ vo.bigName }}
                    </div>
                </div>
                <div style="height: 100%; position: relative;" id="right_3_1">
                    <div class="cus_tab_order">
                        <div class="cus_tab_order_item cus_tab_order_active" @click="switchAscOrDesc('desc', $event)">正序</div>
                        <div class="cus_tab_order_item" @click="switchAscOrDesc('asc', $event)">倒序</div>
                    </div>
                    <div style="height: 100%;" ref="right_3_1"></div>
                </div>
            </div>
        </block-container>
    </div>
</template>

<script>
    import BlockContainer from "@/components/BlockContainer"
    import echartsLiquidfill from 'echarts-liquidfill';
    import { mapActions, mapState } from 'vuex';
    import { getRiverGridData } from "@/service/api.js";
    import { Loading } from 'element-ui';

    export default {
        components: {
            BlockContainer,
        },
        data() {
            return {
                zblist_1: [
                    {
                        name: 'item_hxxyl',
                        bigName: 'COD',
                        max: 40,
                        min: 0,
                        barColor: "#3E47EA",
                        value: '0',
                        percentage: '0%'
                    },{
                        name: 'item_ad',
                        bigName: '氨氮',
                        max: 2.0,
                        min: 0,
                        barColor: "#E6C341",
                        value: '0',
                        percentage: '0%'
                    },{
                        name: 'item_zonglin',
                        bigName: '总磷',
                        max: 0.4,
                        min: 0,
                        barColor: "#0241FE",
                        value: '0',
                        percentage: '0%'
                    },{
                        name: 'item_gmsyzs',
                        bigName: '高锰酸盐',
                        max: 15,
                        min: 0,
                        barColor: "#3DF5FF",
                        value: '0',
                        percentage: '0%'
                    }
                ],
                realData_1: {},
                currStation_1: '',
                timer_1: '',
                index_1: 0,

                currtimetype_2: 'std',  //std:日变化    day:月变化

                zblist_3: [
                    {
                        name: 'cod',
                        bigName: 'COD'
                    },{
                        name: 'andan',
                        bigName: '氨氮'
                    },{
                        name: 'zonglin',
                        bigName: '总磷'
                    },{
                        name: 'gaomengsuanyan',
                        bigName: '高锰酸盐'
                    }
                ],
                currzb_3: 'cod',
                order_3: 'desc',
                timer_3: '',
                index_3: 0,

            }
        },
        computed: {
            ...mapState('page3', ['riverTree', 'riverGridDataAllR', 'riverGridDataAllD', 'homeStatInfo'])
        },
        beforeMount () {
            this.currStation_1 = this.riverTree[0]['id'];
        },
        async mounted () {
            // 一堆初始化
            this.handleData3();
            this.zbAutoSwitch_3();
            
            // 获取第一个站点的日数据
            await this.getRiverGridDataR({
                sectionCode: this.currStation_1
            });
            this.handleData1();
            this.handleData2();
        },
        beforeDestroy () {
            //清除定时器
            // clearInterval(this.timer_1);
            clearInterval(this.timer_3);
        },
        watch: {
            // currStation_1(now, old) {
            
            // },
            // currtimetype_2(now, old) {
            //     
            // },
            currzb_3(now, old) {
                this.handleData3();
            },
            order_3(now, old) {
                this.handleData3();
            }
        },
        methods: {
            ...mapActions('page3', ['getRiverGridDataR', 'getRiverGridDataD_batch']),
            // right_1
            async btnItemClick(vo, index, e) {
                this.currStation_1 = vo.id;
                if(this.currtimetype_2 === 'std'){
                    if(!this.riverGridDataAllR[this.currStation_1]){
                        const loading = Loading.service({
                            target: e.currentTarget,
                            lock: true,
                            text: '',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.8)'
                        });
                        await this.getRiverGridDataR({
                            sectionCode: this.currStation_1
                        });
                        loading.close();
                    }
                }
                this.index_1 = index;
                this.handleData1();
                this.handleData2();
                this.$bus.$emit('stationChange_page3', {currStation: this.currStation_1, index: this.index_1} )
            },
            handleData1 () {
                const riverGridDataR = this.riverGridDataAllR[this.currStation_1];
                // console.log(riverGridDataR);
                if(riverGridDataR && riverGridDataR.length > 0){
                    this.realData_1 = riverGridDataR.filter(v => v.classname !== '—')[0] || null;
                }else{
                    this.realData_1 = null;
                }
                this.zblist_1.forEach(v => {
                    let zhi = '';
                    // console.log(this.realData_1);
                    if(this.realData_1 === null){
                        zhi = '-'
                    }else{
                        zhi = this.realData_1[v.name] || '-'
                    }
                    v['value'] = zhi;
                    if(zhi==='-'){
                        v['percentage'] = '0%'
                    }else{
                        if(Number(zhi) > v['max']){
                            v['percentage'] = '100%'
                        }else if(Number(zhi) < v['min']){
                            v['percentage'] = '0%'
                        }else{
                            v['percentage'] = (Number(zhi) / (v['max'] - v['min'])) * 100 + '%'
                        }
                    }
                })
                // console.log(this.zblist_1);
                this.initCharts_1(this.realData_1 ? this.realData_1['classname'] : '无');
            },
            stationAutoSwitch_1 () {
                this.timer_1 = setInterval(() => {
                    this.currStation_1 = this.riverTree[this.index_1].id;
                    this.index_1++;
                    if(this.index_1 >= this.riverTree.length){
                        this.index_1 = 0;
                    }
                }, 4000);
            },
            stopAutoSwitch_1 () {
                clearInterval(this.timer_1)
            },
            // right_2  (跟right_1是联动的)
            async handleData2 (e = null) {
                let baseData = [];
                if(this.currtimetype_2 === 'std'){
                    baseData = Object.assign([], this.riverGridDataAllR[this.currStation_1]).filter(v => v.classname !== '—');
                }else if(this.currtimetype_2 === 'day'){
                    if(this.riverGridDataAllD[this.currStation_1]){
                        baseData = Object.assign([], this.riverGridDataAllD[this.currStation_1]);
                    }else{
                        const loading = Loading.service({
                            target: e.currentTarget,
                            lock: true,
                            text: '',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.8)'
                        });
                        await this.getRiverGridDataD_batch({
                            riverTree: this.riverTree
                        });
                        loading.close();
                        baseData = Object.assign([], this.riverGridDataAllD[this.currStation_1]);
                    }
                }
                let x=[], y=[];
                if(baseData && baseData.length > 0){
                    x = baseData.map(v => {
                        if(this.currtimetype_2 === 'std'){
                            return v['monitortime'].split(':')[0];
                        }else if(this.currtimetype_2 === 'day'){
                            // return v['monitordate'].split('-')[2];
                            return `${v['monitordate'].split('-')[1]}-${v['monitordate'].split('-')[2]}`;
                        }
                    }).reverse();
                    y = baseData.map(v => {
                        const testArr = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', '劣Ⅴ'];
                        let isPass = false;
                        testArr.forEach(vt => {
                            vt === v['classname'] && (isPass = true) 
                        });
                        if(isPass){
                            return v['classname']+'类'
                        }else{
                            return '无'
                        }
                    }).reverse();
                }else{
                    // let start = this.currtimetype_2==='std' ? 0 : 1;
                    // let len = this.currtimetype_2==='std' ? 24 : 31;
                    // for(let i=start; i<len; i++){
                    //     x.push(i<10 ? '0'+i : ''+i);
                    //     y.push('');
                    // }
                }
                this.initCharts_2(x, y);
            },
            switchDayOrMonth (timetype, e) {
                if(!e.target.classList.contains('cus_tab_order_active')){
                    const tabList = document.querySelectorAll("#right_2_1 .cus_tab_order_item");
                    for(let i=0; i<tabList.length; i++){
                        tabList[i].classList.remove('cus_tab_order_active');
                    }
                    e.target.classList.add('cus_tab_order_active');
                    this.currtimetype_2 = timetype;
                    this.handleData2(e);
                }
            },
            // right_3
            handleData3 () {
                // this.order_3             asc | desc
                const odata = this.homeStatInfo;
                let x = [], y=[];
                const zb = this.currzb_3;

                let tempArr = odata.xaxis.map((v, index) => {
                    return {
                        x: v,
                        y: odata.series.filter(v1 => v1.name === zb)[0]['data'][index]
                    }
                });
                tempArr.sort((v1, v2) => this.order_3 === 'asc' ? (v1.y-v2.y) : (v2.y-v1.y));
                x = tempArr.map(v => v.x);
                y = tempArr.map(v => v.y);
                this.initCharts_3(x, y);
            },
            switchAscOrDesc (ordertype, e) {
                if(!e.target.classList.contains('cus_tab_order_active')){
                    const tabList = document.querySelectorAll("#right_3_1 .cus_tab_order_item");
                    for(let i=0; i<tabList.length; i++){
                        tabList[i].classList.remove('cus_tab_order_active');
                    }
                    e.target.classList.add('cus_tab_order_active');
                    this.order_3 = ordertype;
                }
            },
            zbAutoSwitch_3 () {
                // 立即执行一次
                this.currzb_3 = this.zblist_3[this.index_3].name;
                this.index_3++;
                if(this.index_3 >= this.zblist_3.length){
                    this.index_3 = 0;
                }
                // 同时开启定时器
                this.timer_3 = setInterval(() => {
                    this.currzb_3 = this.zblist_3[this.index_3].name;
                    this.index_3++;
                    if(this.index_3 >= this.zblist_3.length){
                        this.index_3 = 0;
                    }
                }, 5000);
            },
            stopAutoSwitch_3 () {
                clearInterval(this.timer_3)
            },


            initCharts_1 (classname) {
                const num = (function(){
                    switch (classname) {
                        case 'Ⅰ':
                            return 0.1;
                            break;
                        case 'Ⅱ':
                            return 0.2;
                            break;
                        case 'Ⅲ':
                            return 0.3;
                            break;
                        case 'Ⅳ':
                            return 0.4;
                            break;
                        case 'Ⅴ':
                            return 0.5;
                            break;
                        case '劣Ⅴ':
                            return 0.6;
                            break;
                        default:
                            return -0.04
                            break;
                    }
                })();
                const _echarts = this.$echarts;
                let myChart = _echarts.init(this.$refs.right_1_1);
                myChart.setOption(
                    {
                        series: [{
                            type: 'liquidFill',
                            data: [num, num+0.02, num+0.04],
                            shape: 'path://M879.992333 656.007667a367.992333 367.992333 0 0 1-735.984666 0C144.007667 452.875898 479.453123 0 512 0 536.532822 0 879.992333 452.875898 879.992333 656.007667z',
                            // color:['rgba(248,234,13,1)','rgba(248,234,13,0.8)','rgba(248,234,13,0.6)'],
                            color: ['rgba(0,162,255,1)', 'rgba(0,162,255,0.8)', 'rgba(0,162,255,0.6)'],
                            direction: 'left',
                            radius: '80%',
                            center: ['50%', '50%'],
                            outline: {
                                show: true,
                                borderDistance: 0,
                                itemStyle: {
                                    color: 'none',
                                    borderColor: 'rgba(0,147,242,1)',
                                    borderWidth: 4,
                                    shadowBlur: 20,
                                    shadowColor: 'rgba(0, 0, 0, 0.25)'
                                }
                            },
                            backgroundStyle: {
                                color: "rgba(1,28,39,1)"
                            },
                            itemStyle: {
                                normal: {
                                    opacity: 0.95,
                                    shadowBlur: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.4)'
                                },
                                emphasis: {
                                    opacity: 0.8
                                }
                            },
                            label:{
                                show: true,
                                formatter: classname + (classname === '无' ? '' : '类'),
                                color: 'rgba(255,255,255,1)',
                                insideColor: 'rgba(255,255,255,1)',
                                fontSize: 13,
                                // fontWeight: 'bold',
                                align: 'center',
                                baseline: 'middle',
                                position: 'inside'
                            },
                        }]
                    }                    
                )
                window.addEventListener("resize", debounce(function () {
                    myChart.resize();
                }));
            },
            initCharts_2 (x, y) {
                const _echarts = this.$echarts;
            　　let myChart = _echarts.init(this.$refs.right_2_1);
            　　// 绘制图表
                var data_val = y,
                    xdata = x,
                    ydata = ['Ⅰ类', 'Ⅱ类', 'Ⅲ类', 'Ⅳ类', 'Ⅴ类', '劣Ⅴ类']
            　　myChart.setOption({
                    grid: {
                        left: '2%',
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
                        type: "category",
                        name: "类别",
                        nameGap: 5,
                        // boundaryGap: true,
                        data: ydata,
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
                            show: true,
                            interval: 0,
                            // alignWithLabel: true
                        },
                        axisLabel: {
                            color: "#EBFAFF",
                            fontSize: 9
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#153554',
                                width:  1,
                                type: 'dotted'
                            }
                        },
                    },
                    series: [
                        {
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
                        },{
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
                                    color: '#2B91DB',
                                    shadowBlur: 10,
                                    shadowColor: "rgba(37,47,77,0.8)",
                                    label: {
                                        show: true,
                                        position: 'top',
                                        textStyle: {
                                            color: '#36F4DA',
                                            fontSize: 9
                                        }
                                    }
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: new _echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(0,28,91,0.9)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(0,28,91,0.02)'
                                    }]),
                                }
                            }
                        }
                    ]
                });
        　　    window.addEventListener("resize", debounce(function () {
                    myChart.resize();
                }));
            },
            initCharts_3 (x, y) {
                const _echarts = this.$echarts;
                let myChart = _echarts.init(this.$refs.right_3_1);
                const data_x = x;
                const data_val = y;
                const color1=["rgba(20,161,144,1)", "rgba(44,222,186,1)", "rgba(55,222,170,1)", "rgba(42,255,131,1)", "rgba(88,251,124,1)", "rgba(136,246,99,1)", "rgba(167,227,54,1)", "rgba(182,217,35,1)", "rgba(228,242,0,1)", "rgba(244,223,12,1)"]
                const color2=["rgba(20,161,144,0.2)", "rgba(44,222,186,0.2)", "rgba(55,222,170,0.2)", "rgba(42,255,131,0.2)", "rgba(88,251,124,0.2)", "rgba(136,246,99,0.2)", "rgba(167,227,54,0.2)", "rgba(182,217,35,0.2)", "rgba(228,242,0.2)", "rgba(244,223,12,0.2)"]
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
                            barMaxWidth: 12,
                            itemStyle: {
                                normal: {
                                    // barBorderRadius: [5,5,0,0],
                                    color: function(p) {
                                        return new _echarts.graphic.LinearGradient(
                                            0,0,0,1,[
                                                {
                                                    offset: 0,
                                                    color: "rgba(0,163,240,1)"
                                                }, {
                                                    offset: 1,
                                                    color: "rgba(70,46,188,0.05)"
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
        　　    window.addEventListener("resize", debounce(function () {
                    myChart.resize();
                }));
            },
        },
    }
</script>

<style lang="scss" scoped>
    .main-left{

        .right_1_con{
            height: 100%;
            display: flex;
            display: -webkit-flex;
            flex-direction: column;
            flex: 1;
            flex-basis: auto;
            min-width: 0;

            .right_1_data{
                height: 50%;
                flex-shrink: 0;

                .right_1_data_l{
                    float: left;
                    height: 100%;
                    width: 27%;
                }
                .right_1_data_r{
                    float: left;
                    height: 100%;
                    width: 73%;
                    display: flex;
                    display: -webkit-flex;
                    flex-direction: column;
                    justify-content: space-between;

                    .cus_bar_con{
                        height: 0.24rem;
                        display: flex;
                        display: -webkit-flex;
                        align-items: center;
                        flex-basis: auto;
                        min-width: 0;
                    }
                    .cus_bar_text{
                        width: 70px;
                        min-width: 70px;
                        text-align: right;
                        padding-right: 10px;
                        white-space: nowrap;
                        color: #FCFEFF;
                        font-size: 0.13rem;
                        line-height: 1;
                    }
                    .cus_bar_shade{
                        flex: 1;
                        flex-basis: auto;
                        height: 0.24rem;
                        background-color: #0F2452;
                        border-radius: 0.13rem;
                        padding: 0.03rem 0;

                        .cus_bar_main{
                            display: block;
                            height: 100%;
                            border-radius: 0.12rem;
                            font-size: 0.12rem;
                            font-weight: 700;
                            color: #ffffff;
                            text-align: right;
                            
                            span{
                                display: inline-block;
                                height: 100%;
                                background-color: rgba(0,0,0,0.3);
                                border-radius: 0.06rem;
                            }
                        }
                    }
                }
            }
            .right_1_data::after{
                clear: both;
            }
            
            // flex
            .right_btns_area{
                flex: 1;
                flex-basis: auto;
                display: flex;
                display: -webkit-flex;
                flex-wrap: wrap;
                // justify-content: flex-start;
                // align-items: center;
                align-content: center;

                .right_btns_item{
                    // width: 23.894%;
                    flex-grow: 1;
                    // flex-shrink: 1;
                    // height: 0.35rem;
                    // line-height: 0.35rem;
                    background-color: #051235;
                    border-radius: 0.06rem;
                    color: #FCFEFF;
                    font-size: 0.16rem;
                    box-shadow: 0 0 8px -4px #0241FE inset;
                    text-align: center;
                    padding: 0.02rem 0.05rem;
                    margin: 2px 5px;
                    cursor: pointer;
                    border: 1px solid transparent;
                    @include text-beyond;
                    position: relative;

                    /deep/ .el-loading-spinner{
                        margin-top: 0;
                        transform: translateY(-50%);
                    }
                }
                .right_btns_item_active{
                    // background: #F03F16;
                    // background: -moz-linear-gradient(top,  #F37020 0%, #B40000 100%);
                    // background: -webkit-gradient(linear, 0 0, 100% 100%, from(#F37020), to(#B40000));
                    // background: -webkit-linear-gradient(left top,  #F37020 0%,#B40000 100%);
                    // background: -o-linear-gradient(left top,  #F37020 0%,#B40000 100%);
                    // background: -ms-linear-gradient(left top,  #F37020 0%,#B40000 100%);
                    // background: linear-gradient(to right bottom,  #F37020 0%,#B40000 100%);
                    // filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#F37020', endColorstr='#B40000',GradientType=0 );
                    background-color: #0172AC;
                    color: #FFFFFF;
                    box-shadow: none;
                    // border: 1px solid #ffffff;
                    // border-bottom-color: transparent;
                }
                :root .right_btns_item_active{filter:none;}
            }
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
                margin-top: 0;
                transform: translateY(-50%);
            }
        }
        .cus_tab_order_active{
            background-color: #00A2FF;
        }
        .right_3_tab{
            display: -webkit-flex;
            display: flex;
            justify-content: center;
        }
        .right_3_tab_item{
            height: 100%;
            line-height: 0.35rem;
            text-align: center;
            color: #FFFFFF;
            font-size: 0.14rem;
            background-color: #0D4884;
            border: 1px solid #8BABFE;
            // width: 13.9%;
            cursor: pointer;
            margin-left: 0.6%;
            padding: 0 0.06rem;
        }
        .right_3_tab_item_active{
            background-color: #3349F5;
        }
    }
</style>