<template>
  <div class="main-right">  <!-- 总9.54rem -->
    <block-container _title="水环境数据变化趋势" height="3.24rem">
      <div style="position: relative; height: 100%; padding-top: 0.35rem;">
          <div class="right_1_tab" style="position: absolute; width: 100%; height: 0.35rem; top: 0; left: 0;">
              <div class="right_1_tab_item right_1_tab_item_active">COD</div>
              <div class="right_1_tab_item">氨氮</div>
              <div class="right_1_tab_item">总磷</div>
              <div class="right_1_tab_item">高锰酸盐</div>
          </div>
          <div style="height: 100%; position: relative;">
              <div class="cus_tab_order">
                  <div class="cus_tab_order_item cus_tab_order_active">日变化</div>
                  <div class="cus_tab_order_item">月变化</div>
              </div>
              <div id="right_1_1" style="height: 100%;" ref="right_1_1"></div>
          </div>
      </div>
    </block-container>
    <block-container _title="污水排放重点源实时数据" height="3.1rem">
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
    <block-container _title="污水排放重点源现场监控" height="3.2rem">
        <div class="right_3_video_container">
          <div class="right_3_video_btns_wrap">
            <div class="right_3_video_btns">
              <span class="right_3_video_btn right_3_video_btn_active">大寺镇</span>
              <span class="right_3_video_btn">中北镇</span>
              <span class="right_3_video_btn">杨柳青镇</span>
              <span class="right_3_video_btn">张家窝镇</span>
              <span class="right_3_video_btn">精武镇</span>
            </div>
            <div class="right_3_video_btns_more">
              <span class="right_3_video_btn">更多</span>
            </div>
          </div>
          <div class="right_3_video_main_wrap">
            <img src="~@/assets/image/video_img_seize_seat.png" alt="">
          </div>
        </div>
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
      activeName: '1'
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
  　　let myChart = _echarts.init(this.$refs.right_1_1);
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
                      color: '#192939',
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
                          color: '#DEEA36',
                          shadowBlur: 10,
                          shadowColor: "rgba(213,225,55,0.8)",
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
                              color: 'rgba(255,201,21,0.6)'
                          }, {
                              offset: 1,
                              color: 'rgba(255,201,21,0.02)'
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
  },
};
</script>

<style lang="scss">
.main-right {
  .right_3_video_container{
    display: flex;
    display: -webkit-flex;
    width: 100%; 
    height: 100%; 
    flex-direction: column;
    font-size: 0.14rem;
  }
  .right_3_video_btns_wrap{
    height: 0.27rem;
    margin-bottom: 0.11rem;
    display: flex;
    display: -webkit-flex;
  }
  .right_3_video_btns_more{
    width: 0.6rem;
    height: 100%;
    line-height: 0.27rem;

    .right_3_video_btn{
      display: block;
      width: 100%;
      height: 100%;
      background-color: #05AFE5;
      color: #FFFFFF;
      cursor: pointer;
      // @include text-beyond;
    }
  }
  .right_3_video_btns{
    flex-grow: 1;
    line-height: 0.27rem;
    display: flex;
    display: -webkit-flex;

    .right_3_video_btn{
      flex-grow: 1;
      height: 100%;
      background-color: #05AFE5;
      color: #FFFFFF;
      border-right: 0.02rem solid #00374A;
      cursor: pointer;
      // @include text-beyond;
    }
    .right_3_video_btn_active{
      background-color: #093EBE;
    }
  }
  .right_3_video_main_wrap{
    flex: 1;
    flex-basis: auto;
    overflow: hidden;
    box-sizing: border-box;
    border: 0.02rem solid #1A69A1;
    background-color: #000000;

    img{
      display: block;
      height: 100%;
      margin: 0 auto;
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
  }
  .cus_tab_order_active{
      background-color: #00A2FF;
  }
  .right_1_tab{
      display: -webkit-flex;
      display: flex;
      justify-content: center;
  }
  .right_1_tab_item{
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
  .right_1_tab_item_active{
      background-color: #3349F5;
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

}
</style>