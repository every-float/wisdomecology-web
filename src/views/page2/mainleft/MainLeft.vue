<template>
    <div class="main-left">
        <block-container _title="大气环境实时数据" height="2.67rem">
            <div style="width: 100%; height: 100%; dispaly: flex; display:-webkit-flex;">
                <div class="left_1_1">
                    <p style="color: #F6FFFF; font-size: 0.3rem;">92</p>
                    <p style="font-size: 0.18rem; color: #F6FFFF; margin-top:0.1rem;">
                        AQI
                        <span style="color: #E3FF1A;">良</span>
                    </p>
                </div>
                <div class="left_1_2" ref="left_1_2"></div>
                <div style="font-size: 0.12rem;">
                    <p style="color: #00B009; margin-top: 82%;">优</p>
                    <p style="color: #D2EE27; margin-top: 36%;">良</p>
                    <p style="color: #D2EE27; margin-top: 46%;">良</p>
                    <p style="color: #00B009; margin-top: 47%;">优</p>
                    <p style="color: #D2EE27; margin-top: 38%;">良</p>
                    <p style="color: #D2EE27; margin-top: 36%;">良</p>
                </div>
            </div>
        </block-container>
        <block-container _title="大气环境质量变化趋势" height="3.63rem">
            <div style="position: relative; height: 100%; padding-top: 0.35rem;">
                <div class="left_2_tab" style="position: absolute; width: 100%; height: 0.35rem; top: 0; left: 0;">
                    <div class="left_2_tab_item left_2_tab_item_active">AQI</div>
                    <div class="left_2_tab_item">PM2.5</div>
                    <div class="left_2_tab_item">PM10</div>
                    <div class="left_2_tab_item">SO<sub>2</sub></div>
                    <div class="left_2_tab_item">NO<sub>2</sub></div>
                    <div class="left_2_tab_item">O<sub>3</sub></div>
                    <div class="left_2_tab_item">CO</div>
                </div>
                <div style="height: 100%; position: relative;">
                    <div class="cus_tab_order">
                        <div class="cus_tab_order_item cus_tab_order_active">日变化</div>
                        <div class="cus_tab_order_item">周变化</div>
                    </div>
                    <div id="left_2_1" style="height: 100%;" ref="left_2_1"></div>
                </div>
            </div>
        </block-container>
        <block-container _title="大气环境质量天津市考核排名" height="3.41rem">
            <div style="position: relative; height: 100%; padding-top: 0.35rem;">
                <div class="left_2_tab" style="position: absolute; width: 100%; height: 0.35rem; top: 0; left: 0;">
                    <div class="left_2_tab_item left_2_tab_item_active">AQI</div>
                    <div class="left_2_tab_item">PM2.5</div>
                    <div class="left_2_tab_item">PM10</div>
                    <div class="left_2_tab_item">SO<sub>2</sub></div>
                    <div class="left_2_tab_item">NO<sub>2</sub></div>
                    <div class="left_2_tab_item">O<sub>3</sub></div>
                    <div class="left_2_tab_item">CO</div>
                </div>
                <div style="height: 100%; position: relative;">
                    <div class="cus_tab_order">
                        <div class="cus_tab_order_item cus_tab_order_active">正序</div>
                        <div class="cus_tab_order_item">倒序</div>
                    </div>
                    <div id="left_3_1" style="height: 100%;" ref="left_3_1"></div>
                </div>
            </div>
        </block-container>
    </div>
</template>

<script>
    import BlockContainer from "@/components/BlockContainer"

    export default {
        data() {
            return {
               
            }
        },
        components: {
            BlockContainer,
        },
        methods: {
            initCharts () {
                const _echarts = this.$echarts;
            　　let myChart = _echarts.init(this.$refs.left_1_2);
            　　// 绘制图表
                var salvProName =["PM2.5","PM10","SO2","NO2","CO","O3"];
                var salvProValue =[15, 58, 72, 0.2, 1.2, 0.8];
                var salvProMax =[];//背景按最大值
                for (let i = 0; i < salvProValue.length; i++) {
                    salvProMax.push(salvProValue[0])
                }
            　　myChart.setOption({
                    grid: {
                        left: '2%',
                        right: '6%',
                        bottom: '2%',
                        top: '2%',
                        containLabel: true
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'none'
                        },
                        formatter: function(params) {
                            return params[0].name  + ' : ' + params[0].value
                        }
                    },
                    xAxis: {
                        show: false,
                        type: 'value'
                    },
                    yAxis: [{
                        type: 'category',
                        inverse: true,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            },
                        },
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        data: salvProName
                    }, {
                        type: 'category',
                        inverse: true,
                        axisTick: 'none',
                        axisLine: 'none',
                        show: true,
                        axisLabel: {
                            textStyle: {
                                color: '#ffffff',
                                fontSize: '12'
                            },
                        },
                        data:salvProValue
                    }],
                    series: [{
                            name: '值',
                            type: 'bar',
                            zlevel: 1,
                            itemStyle: {
                                normal: {
                                    barBorderRadius: 30,
                                    color: new _echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                        offset: 0,
                                        color: '#00FB1F'
                                    }, {
                                        offset: 1,
                                        color: '#FF9913'
                                    }]),
                                },
                            },
                            barWidth: '40%',
                            data: salvProValue
                        },
                        {
                            name: '背景',
                            type: 'bar',
                            barWidth: '40%',
                            barGap: '-100%',
                            data: salvProMax,
                            itemStyle: {
                                normal: {
                                    color: 'rgba(24,31,68,1)',
                                    barBorderRadius: 30,
                                }
                            },
                        },
                    ]
                });
        　　    window.addEventListener("resize", function () {
                    myChart.resize();
                });
            },
            initCharts_2 () {
                const _echarts = this.$echarts;
            　　let myChart = _echarts.init(this.$refs.left_2_1);
            　　// 绘制图表
                var data_val = [46, 56, 66, 76, 80, 75, 96, 104, 100, 102, 112, 122, 132],
                    xdata = ['0点', '2点', '4点', '6点', '8点', '10点', '12点', '14点', '16点', '18点', '20点', '22点', '24点'];
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
                        backgroundColor: '#E8E093',
                        borderColor: '#E8E093',
                        borderWidth: 4,
                        textStyle: {
                            color: '#354060'
                        },
                        formatter: '{b} : {c}',
                        extraCssText: 'box-shadow: 0 0 10px rgba(37,47,77,0.8)'
                    },
                    xAxis: {
                        type: 'category',
                        data: xdata,
                        boundaryGap: false,
                        axisLabel: {
                            interval: 0,
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
                        }
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
                                        show: true,
                                        position: 'top',
                                        textStyle: {
                                            color: '#36F4DA',
                                            fontSize: 9
                                        }
                                    }
                                }
                            },
                            // areaStyle: {
                            //     normal: {
                            //         color: new _echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            //             offset: 0,
                            //             color: 'rgba(78,197,163,0.7)'
                            //         }, {
                            //             offset: 1,
                            //             color: 'rgba(89,170,147,0.02)'
                            //         }]),
                            //     }
                            // }
                        }
                    ]
                });
        　　    window.addEventListener("resize", function () {
                    myChart.resize();
                });
            },
            initCharts_3 () {
                const _echarts = this.$echarts;
            　　let myChart = _echarts.init(this.$refs.left_3_1);
            　　// 绘制图表
                const xdata = ['和平区', '南开区', '河西区', '河北区', '红桥区', '河东区', '西青区', '北辰区', '津南区', '武清区'];
                const seriesData = [3, 8, 11, 16, 20, 25, 30, 36, 44, 50];
                const color1=["rgba(21,158,130,1)", "rgba(47,187,124,1)", "rgba(114,228,117,1)", "rgba(175,247,43,1)", "rgba(224,247,0,1)", "rgba(244,232,0,1)", "rgba(255,198,22,1)", "rgba(229,133,75,1)", "rgba(199,49,172,1)", "rgba(133,12,253,1)"]
                const color2=["rgba(21,158,130,0.2)", "rgba(47,187,124,0.2)", "rgba(114,228,117,0.2)", "rgba(175,247,43,0.2)", "rgba(224,247,0,0.2)", "rgba(244,232,0,0.2)", "rgba(255,198,22,0.2)", "rgba(229,133,75,0.2)", "rgba(199,49,172,0.2)", "rgba(133,12,253,0.2)"]
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
                        data: xdata,
                        axisPointer: {	//指示器
                            type: 'line',
                            lineStyle: {
                                color: "#ff0000",
                                width: 2,
                                type: "dotted"
                            }
                        },
                        axisLabel: {
                            interval: 0,
                            color: '#EBFAFF',
                            fontSize: 9,
                            margin: 4,
                            formatter:function(value,index) {
                                var ret = "";//拼接加\n返回的类目项  
                                var maxLength = 2;//每项显示文字个数  
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
                            data: seriesData
                        }
                    ]
                });
        　　    window.addEventListener("resize", function () {
                    myChart.resize();
                });
            },
        },
        mounted () {
            this.initCharts();
            this.initCharts_2();
            this.initCharts_3();
        },
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
            background: url("~@/assets/image/circle.png") no-repeat center;
            background-size: contain;
            display: flex;
            display: -webkit-flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-weight: 600;
        }
        .left_1_2{
            flex: 1;
            height: 100%;
            overflow: hidden;
            padding-top: 0.1rem;
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
        }
        .cus_tab_order_active{
            background-color: #00A2FF;
        }
    }
</style>