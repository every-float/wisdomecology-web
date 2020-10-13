<template>
    <div class="main-right">
        <block-container _title="水环境实时数据" height="2.95rem">
            <div class="right_1_con">
                <div class="right_1_data" style="flex: 1; height: 100%;">
                    <div class="right_1_data_l">
                        <span style="margin-top: -0.2rem">IV类</span>
                    </div>
                    <div class="right_1_data_r">
                        <div class="cus_bar_con">
                            <div class="cus_bar_text">COD</div>
                            <div class="cus_bar_shade">
                                <span class="cus_bar_main" style="background-color: #3E47EA; width: 56%;"></span>
                                <span class="cus_bar_value">43(mg/L)</span>
                            </div>
                        </div>
                        <div class="cus_bar_con">
                            <div class="cus_bar_text">氨氮</div>
                            <div class="cus_bar_shade">
                                <span class="cus_bar_main" style="background-color: #E6C341; width: 30%;"></span>
                                <span class="cus_bar_value">43(mg/L)</span>
                            </div>
                        </div>
                        <div class="cus_bar_con">
                            <div class="cus_bar_text">总磷</div>
                            <div class="cus_bar_shade">
                                <span class="cus_bar_main" style="background-color: #0241FE; width: 40%;"></span>
                                <span class="cus_bar_value">43(mg/L)</span>
                            </div>
                        </div>
                        <div class="cus_bar_con">
                            <div class="cus_bar_text">高锰酸盐</div>
                            <div class="cus_bar_shade">
                                <span class="cus_bar_main" style="background-color: #3DF5FF; width: 75%;"></span>
                                <span class="cus_bar_value">43(mg/L)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="height: 0.83rem; display: flex; display: -webkit-flex; flex-direction: column; justify-content: space-between;">
                    <div class="right_1_btn_top">
                        <div class="cus_btn_active">赤龙河</div>
                        <div>陈台子排水河</div>
                        <div>大沽排水河</div>
                    </div>
                    <div class="right_1_btn_bot">
                        <div>外环河</div>
                        <div>南运河</div>
                        <div>子牙河</div>
                        <div>中亭河</div>
                    </div>
                </div>
            </div>
        </block-container>
        <block-container _title="水环境质量变化趋势" height="3.36rem">
            <div style="height: 100%; position: relative;">
                <div class="cus_tab_order">
                    <div class="cus_tab_order_item cus_tab_order_active">日变化</div>
                    <div class="cus_tab_order_item">月变化</div>
                </div>
                <div id="right_2_1" style="height: 100%;" ref="right_2_1"></div>
            </div>
        </block-container>
        <block-container _title="水环境质量天津市考核排名" height="3.40rem">
            <div style="position: relative; height: 100%; padding-top: 0.35rem;">
                <div class="right_3_tab" style="position: absolute; width: 100%; height: 0.35rem; top: 0; left: 0;">
                    <div class="right_3_tab_item right_3_tab_item_active">COD</div>
                    <div class="right_3_tab_item">氨氮</div>
                    <div class="right_3_tab_item">总磷</div>
                    <div class="right_3_tab_item">高锰酸盐</div>
                </div>
                <div style="height: 100%; position: relative;">
                    <div class="cus_tab_order">
                        <div class="cus_tab_order_item cus_tab_order_active">正序</div>
                        <div class="cus_tab_order_item">倒序</div>
                    </div>
                    <div id="right_3_1" style="height: 100%;" ref="right_3_1"></div>
                </div>
            </div>
        </block-container>
    </div>
</template>

<script>
    import BlockContainer from "@/components/BlockContainer"

    export default {
        components: {
            BlockContainer,
        },
        methods: {
            initCharts_2 () {
                const _echarts = this.$echarts;
            　　let myChart = _echarts.init(this.$refs.right_2_1);
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
                    series: [
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
        　　    window.addEventListener("resize", function () {
                    myChart.resize();
                });
            },
            initCharts_3 () {
                const _echarts = this.$echarts;
            　　let myChart = _echarts.init(this.$refs.right_3_1);
            　　// 绘制图表
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
                        data: ['和平区', '南开区', '河西区', '河北区', '红桥区', '河东区', '西青区', '北辰区', '津南区', '武清区'],
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
                            data: [50, 44, 36, 30, 25, 20, 16, 11, 8, 3]
                        }
                    ]
                });
        　　    window.addEventListener("resize", function () {
                    myChart.resize();
                });
            },
        },
        mounted () {
            this.initCharts_2();
            this.initCharts_3();
        },
    }
</script>

<style lang="scss" scoped>
    .main-right{

        .right_1_con{
            height: 100%;
            display: flex;
            display: -webkit-flex;
            flex-direction: column;

            .right_1_data{
                display: flex;
                display: -webkit-flex;
            }
            .right_1_data_l{
                height: 100%;
                width: 27.876%;
                background: url("~@/assets/image/water_evn.png") no-repeat center;
                background-size: 60% auto;
                font-size: 0.2rem;
                font-weight: 600;
                color: #F4EA26;
                display: flex;
                display: -webkit-flex;
                justify-content: center;
                align-items: center;
            }
            .right_1_data_r{
                flex: 1;

                .cus_bar_con{
                    height: 0.38rem;
                    display: flex;
                    display: -webkit-flex;
                    align-items: center;
                }
                .cus_bar_text{
                    height: 100%;
                    width: 11.552%;
                    color: #FCFEFF;
                    font-size: 0.13rem;
                    word-break: break-all;
                    overflow: hidden;
                    display: flex;
                    display: -webkit-flex;
                    align-items: center;
                    line-height: 1;
                }
                .cus_bar_shade{
                    flex: 1;
                    height: 0.24rem;
                    width: 100%;
                    background-color: #091B43;
                    border-radius: 0.12rem;
                    padding: 0.03rem 0;
                    display: flex;
                    display: -webkit-flex;

                    .cus_bar_main{
                        height: 100%;
                        border-radius: 0.12rem;
                    }
                    .cus_bar_value{
                        font-size: 0.12rem;
                        color: #2581C0;
                        line-height: 1;
                        margin-left: 0.1rem;
                    }
                }
            }

            .right_1_btn_top{
                height: 0.35rem;
                display: flex;
                display: -webkit-flex;
                justify-content: space-between;

                div{
                    width: 31.416%;
                    height: 100%;
                    line-height: 0.35rem;
                    background-color: #051235;
                    border-radius: 0.06rem;
                    color: #FCFEFF;
                    font-size: 0.16rem;
                    box-shadow: 0 0 8px -4px #0241FE inset;
                    text-align: center;
                    cursor: pointer;
                    @include text-beyond;
                }
            }
            .right_1_btn_bot{
                height: 0.35rem;
                display: flex;
                display: -webkit-flex;
                justify-content: space-between;

                div{
                    width: 23.894%;
                    height: 100%;
                    line-height: 0.35rem;
                    background-color: #051235;
                    border-radius: 0.06rem;
                    color: #FCFEFF;
                    font-size: 0.16rem;
                    box-shadow: 0 0 8px -4px #0241FE inset;
                    text-align: center;
                    cursor: pointer;
                    @include text-beyond;
                }
            }
			.cus_btn_active{
                background: #F03F16;
                background: -moz-linear-gradient(top,  #F37020 0%, #B40000 100%);
                background: -webkit-gradient(linear, 0 0, 100% 100%, from(#F37020), to(#B40000));
                background: -webkit-linear-gradient(left top,  #F37020 0%,#B40000 100%);
                background: -o-linear-gradient(left top,  #F37020 0%,#B40000 100%);
                background: -ms-linear-gradient(left top,  #F37020 0%,#B40000 100%);
                background: linear-gradient(to right bottom,  #F37020 0%,#B40000 100%);
                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#F37020', endColorstr='#B40000',GradientType=0 );
                color: #FFFFFF;
                box-shadow: none;
                border: 1px solid #ffffff;
                border-bottom-color: transparent;
            }
            :root .cus_btn_active{filter:none;}

            
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