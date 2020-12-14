<template>
  <div class="main-right">
    <block-container _title="各街镇环境空气实时数据" height="2.95rem">
      <div style="position: relative; height: 100%; padding-top: 0.35rem" 
        @mouseenter="stopAutoSwitch_1()" 
        @mouseleave="zbAutoSwitch_1()"
      >
        <div class="right_1_tab" style=" position: absolute; width: 100%; height: 0.35rem; top: 0; left: 0;">
          <div class="right_1_tab_item" 
              :class="{ active: true, 'right_1_tab_item_active': vo.name === currzb_1 }" 
              v-for="(vo, index) in zblist"
              :key="vo.name" 
              v-html="vo.bigName" 
              @click="currzb_1=vo.name; index_1=index">
          </div>
        </div>
        <div style="height: 100%; position: relative" id="right_1_1">
          <div class="cus_tab_order">
              <div class="cus_tab_order_item cus_tab_order_active" @click="switchAscOrDesc('desc', $event)">正序</div>
              <div class="cus_tab_order_item" @click="switchAscOrDesc('asc', $event)">倒序</div>
          </div>
          <div style="height: 100%" ref="right_1_1"></div>
        </div>
      </div>
    </block-container>
    <block-container _title="大气环境质量月历浏览表" height="3.24rem">
        <el-calendar v-model="currMonth" :first-day-of-week="firstDayOfWeek">
        </el-calendar>
    </block-container>
    <block-container _title="风场" height="3.35rem" :btn="{type:'link', text: '详情', href: fengchangDetailUrl}">
        <iframe class="fengchang-iframe" :src="fengchangSrc" frameborder="0"></iframe>
    </block-container>
  </div>
</template>

<script>
import BlockContainer from "@/components/BlockContainer";
import vueSeamlessScroll from "vue-seamless-scroll";
import { mapState } from "vuex";
import mapMarkerStyle from '@/utils/mapMarkerStyle';
import getColorArr from '@/utils/getColorArr';
import airNormlist from "@/mock/airNormlist.js";

export default {
  components: {
    BlockContainer,
    vueSeamlessScroll,
  },
  data() {
    return {
      zblist: airNormlist.data,

      currzb_1: 'aqi', //右上的当前指标
      order_1: 'desc',   // 右上的当前排序方式
      timer_1: '',     //右上定时器
      index_1: 0,      //右上计数器

      currMonth: new Date(),
      firstDayOfWeek: 1,
      mcColorlist: [],

      fengchangSrc: "",
      fengchangDetailUrl: "",
    };
  },
  computed: {
    // optionSetting() {
    //   return {
    //     step: 0.25, // 数值越大速度滚动越快
    //     limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
    //     hoverStop: true, // 是否开启鼠标悬停stop
    //     direction: 1, // 0向下 1向上 2向左 3向右
    //     openWatch: true, // 开启数据实时监控刷新dom
    //     singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
    //     singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
    //     waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
    //   };
    // },
    ...mapState('page2', ['xiangzhen', 'pollutionListA', 'monthCalendar'])
  },
  mounted() {
    this.fengchangSrc = `${process.env.VUE_APP_PAGEURL}views/daqi/index_zonghefenxi_iframe.html`;
    this.fengchangDetailUrl = `${process.env.VUE_APP_PAGEURL}views/daqi/index_zonghefenxi_iframe.html`;

    this.handleData1();
    this.zbAutoSwitch_1();

    this.handleData3();
  },
  beforeDestroy () {
    //清除定时器
    clearInterval(this.timer_1);
  },
  watch: {
    currzb_1(now, old) {
        this.handleData1();
    },
    order_1(now, old) {
        this.handleData1();
    },
  },
  methods: {
    handleData1() {
      // this.order_1             asc | desc
      const odata = this.xiangzhen;
      let x = [], y=[], colors=[];
      const zb = this.currzb_1;
      let tempArr = [];
      if(odata && odata.length > 0){
          tempArr = odata.map(v => {
              return {
                  x: v.pointName,
                  y: v[zb],
                  color: getColorArr(zb, (''+v[zb]).split()).join()
              }
          });
          tempArr.sort((v1, v2) => this.order_1 === 'asc' ? (v1.y-v2.y) : (v2.y-v1.y));
          x = tempArr.map(v => v.x);
          y = tempArr.map(v => v.y);
          colors = tempArr.map(v => v.color);
      }else{
          x = ["王稳庄镇", "辛口镇", "开发区", "杨柳青镇", "大寺镇", "精武镇", "张家窝镇（参照点）", "中北镇", "西营门街", "李七庄街"]
          x.forEach(function(v){
              y.push('');
              colors('rgba(0,0,0,0)');
          })
      }
      this.initCharts_1(x, y, colors);
    },
    switchAscOrDesc (ordertype, e) {
        if(!e.target.classList.contains('cus_tab_order_active')){
            const tabList = document.querySelectorAll("#right_1_1 .cus_tab_order_item");
            for(let i=0; i<tabList.length; i++){
                tabList[i].classList.remove('cus_tab_order_active');
            }
            e.target.classList.add('cus_tab_order_active');
            this.order_1 = ordertype;
        }
    },
    zbAutoSwitch_1 () {
        // 立即执行一次 
        this.currzb_1 = this.zblist[this.index_1].name;
        this.index_1++;
        if(this.index_1 >= this.zblist.length){
            this.index_1 = 0;
        }
        // 同时开启定时器
        this.timer_1 = setInterval(() => {
            this.currzb_1 = this.zblist[this.index_1].name;
            this.index_1++;
            if(this.index_1 >= this.zblist.length){
                this.index_1 = 0;
            }
        }, 7000);
    },
    stopAutoSwitch_1 () {
        clearInterval(this.timer_1)
    },

    handleData3(){
      const obj = {};
      for(let i in this.monthCalendar[0]){
        obj[i] = mapMarkerStyle('aqi', this.monthCalendar[0][i], 0)
      }
      // console.log(obj);
      // console.log(obj['01']);
      const domList = document.querySelectorAll(".main-right .el-calendar .el-calendar__body .el-calendar-table .el-calendar-table__row .current");
      // console.log(domList);
      for(let i=0; i<domList.length; i++){
        const key = i+1<10 ? '0'+(i+1) : ''+(i+1);
        domList[i].style.backgroundColor = obj[key].bgcolor;
        domList[i].style.color = obj[key].color;
      }
    },

    initCharts_1(x, y, colors) {
      const _echarts = this.$echarts;
      let myChart = _echarts.init(this.$refs.right_1_1); // 绘制图表
      const xdata = x;
      const seriesData = y;
      const color1 = colors;
      const color2 = colors.map(v => 'rgba(0,0,0,0.1)');
      myChart.setOption({
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "7%",
          right: "3%",
          bottom: "22%",
          top: "20%",
        },
        xAxis: [
          {
            type: "category",
            data: xdata,
            axisPointer: {
              //指示器
              type: "line",
              lineStyle: {
                color: "#ff0000",
                width: 2,
                type: "dotted",
              },
            },
            axisLabel: {
              interval: 0,
              color: "#15E3FB",
              fontSize: 9,
              margin: 4,
              formatter: function (value, index) {
                var ret = ""; //拼接加\n返回的类目项
                var maxLength = 3; //每项显示文字个数
                var valLength = value.length; //X轴类目项的文字个数
                var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                if (rowN > 1) {
                  //如果类目项的文字大于3,
                  for (var i = 0; i < rowN; i++) {
                    var temp = ""; //每次截取的字符串
                    var start = i * maxLength; //开始截取的位置
                    var end = start + maxLength; //结束截取的位置
                    //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                    temp = value.substring(start, end) + "\n";
                    ret += temp; //凭借最终的字符串
                  }
                  return ret;
                } else {
                  return value;
                }
              },
            },
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "#15E3FB",
                width: 1,
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "单位",
            nameGap: 10,
            nameTextStyle: {
              color: "#15E3FB",
              fontSize: 9,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#1B313F",
                type: "dotted",
              },
            },
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "#15E3FB",
                width: 1,
              },
            },
            axisLabel: {
              formatter: "{value}",
              margin: 4,
              color: "#15E3FB",
              fontSize: 9,
            },
            axisTick: {
              inside: false,
              length: 3,
            },
          },
        ],
        series: [
          {
            name: "参数",
            type: "bar",
            barMaxWidth: 12,
            itemStyle: {
              normal: {
                // barBorderRadius: [5,5,0,0],
                color: function (p) {
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
                },
              },
            },
            data: seriesData,
          },
        ],
      });
      window.addEventListener("resize", debounce(function () {
        myChart.resize();
      }));
    },
  },
};
</script>

<style lang="scss">
.main-right {
  .right_1_tab {
    display: -webkit-flex;
    display: flex;
    justify-content: space-between;
  }
  .right_1_tab_item {
    height: 100%;
    line-height: 0.35rem;
    text-align: center;
    color: #ffffff;
    font-size: 0.14rem;
    background-color: #0d4884;
    border: 1px solid #8babfe;
    width: 13.9%;
    cursor: pointer;
  }
  .right_1_tab_item_active {
    background-color: #3349f5;
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
  .cus_tab_order_item {
    width: 49.8%;
    height: 100%;
    line-height: 0.2rem;
    text-align: center;
    font-size: 0.12rem;
    color: #ffffff;
    background-color: #002b58;
    border-radius: 0.02rem;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
  }
  .cus_tab_order_active {
    background-color: #00a2ff;
  }

  // 表格
  .cus_table_head {
    position: absolute;
    width: 100%;
    height: 0.24rem;
    top: 0;
    left: 0;
    background-color: #256adf;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    align-items: center;
  }
  .cus_table_th {
    width: 20%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
  }
  .cus_table_tr {
    height: 0.26rem;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .cus_table_tr:nth-child(2n-1) {
    background-color: #033f7d;
  }
  .cus_table_tr:nth-child(2n) {
    background-color: #011e3e;
  }
  .cus_table_td {
    width: 20%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
  }
  .seamless-warp {
    height: 100%;
    overflow: hidden;
  }

  //日历
  .el-calendar {
    background: none;
    height: 100%;
    overflow: hidden;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
  }
  .el-calendar__header {
    display: block;
    padding: 0;
    border-bottom: 1px solid #002358;
    background-color: #0089FE;
    font-size: 0.13rem;
  } 
  .el-calendar__title{
    height: 0.3rem;
    line-height: 0.3rem;
    color: #ffffff;
  }
  .el-calendar__button-group{
    display: none !important;
  }
  .el-calendar__body{
    flex: 1;
    flex-basis: auto;
    overflow: hidden;
    box-sizing: border-box;
    font-size: 0.13rem;
    padding: 0;
  }  
  .el-calendar-table thead th{
    padding: 0.05rem 0;
    background-color: #00BAFF;
    border-right: 1px solid #002B74;
    color: #ffffff;
  }
  .el-calendar-table thead th:nth-last-child(1){
    border-right: 0;
  }
  .el-calendar-table .el-calendar-day{
    padding: 0;
    // height: 0.395rem;
    height: 0.32rem;
    background: transparent !important;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    align-items: center;
  }
  .el-calendar-table:not(.is-range) td.next, .el-calendar-table:not(.is-range) td.prev{
    visibility: hidden;
  }
  .el-calendar-table td{
    border: 0;
    color: #000000;
    background-color: #FFFF00;
    border: 1px solid #000;
  }
  .el-calendar-table td.is-today{
    background: transparent;
    color: #000000;
  }
  .el-calendar-table td.is-selected{
    background: #FFFF00;
  }

  .fengchang-iframe{
    display: block; 
    width: 100%; 
    height: 100%;
    border: 2px solid #0089FE;
    border-radius: 3px;
  }
}
</style>