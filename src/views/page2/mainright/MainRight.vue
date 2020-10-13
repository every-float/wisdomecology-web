<template>
  <div class="main-right">
    <block-container _title="各街镇环境空气实时数据" height="2.95rem">
      <div style="position: relative; height: 100%; padding-top: 0.35rem">
        <div
          class="right_1_tab"
          style="
            position: absolute;
            width: 100%;
            height: 0.35rem;
            top: 0;
            left: 0;
          "
        >
          <div class="right_1_tab_item right_1_tab_item_active">AQI</div>
          <div class="right_1_tab_item">PM2.5</div>
          <div class="right_1_tab_item">PM10</div>
          <div class="right_1_tab_item">SO<sub>2</sub></div>
          <div class="right_1_tab_item">NO<sub>2</sub></div>
          <div class="right_1_tab_item">O<sub>3</sub></div>
          <div class="right_1_tab_item">CO</div>
        </div>
        <div style="height: 100%; position: relative">
          <div class="cus_tab_order">
            <div class="cus_tab_order_item cus_tab_order_active">正序</div>
            <div class="cus_tab_order_item">倒序</div>
          </div>
          <div id="right_1_1" style="height: 100%" ref="right_1_1"></div>
        </div>
      </div>
    </block-container>
    <block-container _title="废气排放重点污染源实时数据" height="3.36rem">
      <div
        style="
          height: 100%;
          padding-top: 0.24rem;
          position: relative;
          font-size: 0.12rem;
          color: #ffffff;
        "
      >
        <div class="cus_table_head">
          <div class="cus_table_th" style="width: 80%">企业名称</div>
          <div class="cus_table_th" style="width: 80%">行业类别</div>
          <div class="cus_table_th" style="width: 20%">数量</div>
          <div class="cus_table_th" style="width: 20%">参数</div>
        </div>
        <div class="cus_table_body" style="height: 100%">
          <vue-seamless-scroll
            :data="zdqywryglTable"
            :class-option="optionSetting"
            class="seamless-warp"
          >
            <ul>
              <li
                class="cus_table_tr"
                v-for="vo in zdqywryglTable"
                :key="vo.id"
              >
                <div class="cus_table_td" style="width: 80%">{{ vo.companyName }}</div>
                <div class="cus_table_td" style="width: 80%">{{ vo.hylb }}</div>
                <div class="cus_table_td" style="width: 20%">{{ vo.number }}</div>
                <div class="cus_table_td" style="width: 20%">{{ vo.param }}</div>
              </li>
            </ul>
          </vue-seamless-scroll>
        </div>
      </div>
    </block-container>
    <block-container _title="大气环境质量月历浏览表" height="3.24rem">
        <el-calendar v-model="currMonth" :first-day-of-week="firstDayOfWeek">
        </el-calendar>
    </block-container>
  </div>
</template>

<script>
import rightTable from "@/mock/rightTable.js";
import BlockContainer from "@/components/BlockContainer";
import vueSeamlessScroll from "vue-seamless-scroll";

export default {
  components: {
    BlockContainer,
    vueSeamlessScroll,
  },
  data() {
    return {
      zdqywryglTable: [],
      currMonth: new Date(),
      firstDayOfWeek: 7
    };
  },
  created() {
    this.zdqywryglTable = rightTable.data;
  },
  mounted() {
    this.initCharts_1();
  },
  computed: {
    optionSetting() {
      return {
        step: 0.5, // 数值越大速度滚动越快
        limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },
  methods: {
    initCharts_1() {
      const _echarts = this.$echarts;
      let myChart = _echarts.init(this.$refs.right_1_1); // 绘制图表
      const xdata = [
        "王稳庄镇",
        "辛口镇",
        "开发区",
        "杨柳青镇",
        "大寺镇",
        "精武镇",
        "张家窝镇",
        "中北镇",
        "西营门街",
        "李七庄街",
      ];
      const seriesData = [50, 44, 36, 30, 25, 20, 16, 11, 8, 3];
      const color1 = [
        "rgba(21,158,130,1)",
        "rgba(47,187,124,1)",
        "rgba(114,228,117,1)",
        "rgba(175,247,43,1)",
        "rgba(224,247,0,1)",
        "rgba(244,232,0,1)",
        "rgba(255,198,22,1)",
        "rgba(229,133,75,1)",
        "rgba(199,49,172,1)",
        "rgba(133,12,253,1)",
      ];
      const color2 = [
        "rgba(21,158,130,0.2)",
        "rgba(47,187,124,0.2)",
        "rgba(114,228,117,0.2)",
        "rgba(175,247,43,0.2)",
        "rgba(224,247,0,0.2)",
        "rgba(244,232,0,0.2)",
        "rgba(255,198,22,0.2)",
        "rgba(229,133,75,0.2)",
        "rgba(199,49,172,0.2)",
        "rgba(133,12,253,0.2)",
      ];
      myChart.setOption({
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "7%",
          right: "3%",
          bottom: "20%",
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
                var maxLength = 2; //每项显示文字个数
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
                  return new _echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#24D688",
                    },
                    {
                      offset: 1,
                      color: "#F4FB21",
                    },
                  ]);
                },
              },
            },
            data: seriesData,
          },
        ],
      });
      window.addEventListener("resize", function () {
        myChart.resize();
      });
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
    height: 0.395rem;
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
    background: #FFFF00;
    color: #000000;
  }
  .el-calendar-table td.is-selected{
    background: #FFFF00;
  }
}
</style>