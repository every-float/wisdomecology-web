<template>
  <div class="main-right">  <!-- 总9.54rem -->
    <block-container _title="水环境数据变化趋势" height="3.24rem">
      <div style="position: relative; height: 100%; padding-top: 0.35rem;" 
        @mouseenter="stopAutoSwitch_1()" 
        @mouseleave="zbAutoSwitch_1()"
      >
          <div class="right_1_tab" style="position: absolute; width: 100%; height: 0.35rem; top: 0; left: 0;">
              <div class="right_1_tab_item"
                  v-for="(vo, index) in zblist_1"
                  :class="{ active: true, 'right_1_tab_item_active': vo.name === currzb_1 }"
                  :key="vo.name"
                  @click="currzb_1=vo.name; index_1=index"
              >
                  {{ vo.bigName }}
              </div>
          </div>
          <div style="height: 100%; position: relative;" id="right_1_1">
              <div class="cus_tab_order">
                  <div class="cus_tab_order_item cus_tab_order_active" @click="switchDayOrMonth('std', $event)">日变化</div>
                  <div class="cus_tab_order_item" @click="switchDayOrMonth('day', $event)">月变化</div>
              </div>
              <div style="height: 100%;" ref="right_1_1"></div>
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
          <div class="cus_table_th" style="width: 30%">机构代码</div>
          <!-- <div class="cus_table_th" style="width: 20%">数量</div>
          <div class="cus_table_th" style="width: 20%">参数</div> -->
        </div>
        <div class="cus_table_body" style="height: 100%">
          <vue-seamless-scroll
            :data="pollutionListW"
            :class-option="optionSetting"
            class="seamless-warp"
          >
            <ul>
              <li
                class="cus_table_tr"
                v-for="vo in pollutionListW"
                :key="vo.coId"
              >
                <div class="cus_table_td" style="width: 80%" :title="vo.coName">{{ vo.coName }}</div>
                <div class="cus_table_td" style="width: 30%" :title="vo.coCode">{{ vo.coCode }}</div>
                <!-- <div class="cus_table_td" style="width: 20%">{{ vo.number }}</div>
                <div class="cus_table_td" style="width: 20%">{{ vo.param }}</div> -->
              </li>
            </ul>
          </vue-seamless-scroll>
        </div>
      </div>
    </block-container>
    <block-container _title="污水排放重点源现场监控" height="3.2rem" :btn="{type:'link', text: '更多', href: moreUrl}">
        <div class="right_3_video_container" style="position: relative;">
          <!-- <div class="right_3_video_btns_wrap">
            <div class="right_3_video_btns">
              <span class="right_3_video_btn right_3_video_btn_active">大寺镇</span>
              <span class="right_3_video_btn">中北镇</span>
              <span class="right_3_video_btn">杨柳青镇</span>
              <span class="right_3_video_btn">张家窝镇</span>
              <span class="right_3_video_btn">精武镇</span>
            </div>
            <div class="right_3_video_btns_more">
              <a class="right_3_video_btn" :href="moreUrl">更多</a>
            </div>
          </div> -->
          <div class="right_3_video_main_wrap">
            <!-- <img src="~@/assets/image/video_img_seize_seat.png" alt=""> -->
            <img src="http://39.98.156.37:8300/wisdomecology-web/views/dq/images/channel_15.png" alt="加载失败">
          </div>
        </div>
    </block-container>
  </div>
</template>

<script>
import BlockContainer from "@/components/BlockContainer";
import vueSeamlessScroll from "vue-seamless-scroll";
import { mapActions, mapState } from 'vuex';
import { Loading } from 'element-ui';
import bus from  '@/bus/index';

export default {
  components: {
    BlockContainer,
    vueSeamlessScroll,
  },
  data() {
    return {
      currStation_1: '',
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
      currzb_1: 'item_hxxyl',
      currtimetype_1: 'std',  //std:日变化    day:月变化
      timer_1: '',
      index_1: 0,

      zdqywryglTable: [],
      activeName: '1',

      moreUrl: '',
    };
  },
  computed: {
    optionSetting() {
      return {
        step: 0.25, // 数值越大速度滚动越快
        limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
    ...mapState('page3', ['riverTree', 'riverGridDataAllR', 'riverGridDataAllD', 'pollutionListW'])
  },
  mounted() {
    this.handleData1();
    this.zbAutoSwitch_1();

    // 监听左边组件的站点切换
    bus.$on('stationChange', ({currStation}) => {
        this.currStation_1 = currStation;
    });

    // this.moreUrl = `${this.$store.state.pageUrl}views/index2.html?menuId=c616b74328504b6085ac923c1e117755#views/dq/overheadVideo_list.html`;
    this.moreUrl = `${this.$store.state.pageUrl}views/index2.html?menuId=26a6c508b37d465f910800d4e73f93d8&menuName=重点污染源管理#views/sop/companyVideo_list.html`;
  },
  watch: {
    currStation_1(now, old) {
        this.handleData1();
    },
    currzb_1(now, old) {
        this.handleData1();
    },
    // currtimetype_1(now, old) {
    //     this.handleData1();
    // },
  },
  methods: {
    ...mapActions('page3', ['getRiverGridDataD_batch']),
    async handleData1(e = null) {
      // console.log(this.riverGridDataAllR);
      let baseData = [];
      if(this.currtimetype_1 === 'std'){
          // console.log(Object.assign([], this.riverGridDataAllR[this.currStation_1]));
          // console.log(Object.assign([], this.riverGridDataAllR[this.currStation_1]).filter(v => v.classname !== '—'));
          // baseData = Object.assign([], this.riverGridDataAllR[this.currStation_1]);
          baseData = Object.assign([], this.riverGridDataAllR[this.currStation_1]).filter(v => v.classname !== '—');
      }else if(this.currtimetype_1 === 'day'){
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
              if(this.currtimetype_1 === 'std'){
                  return v['monitortime'].split(':')[0];
              }else if(this.currtimetype_1 === 'day'){
                  return v['monitordate'].split('-')[2];
              }
          }).reverse();
          y = baseData.map(v => {
              return v[this.currzb_1]
          }).reverse();
      }else{
          let start = this.currtimetype_1==='std' ? 0 : 1;
          let len = this.currtimetype_1==='std' ? 24 : 31;
          for(let i=start; i<len; i++){
              x.push(i<10 ? '0'+i : ''+i);
              y.push('');
          }
      }
      this.initCharts_1(x,y);
    },
    switchDayOrMonth(timetype, e) {
      if(!e.target.classList.contains('cus_tab_order_active')){
          const tabList = document.querySelectorAll("#right_1_1 .cus_tab_order_item");
          for(let i=0; i<tabList.length; i++){
              tabList[i].classList.remove('cus_tab_order_active');
          }
          e.target.classList.add('cus_tab_order_active');
          this.currtimetype_1 = timetype;
          this.handleData1(e);
      }
    },
    zbAutoSwitch_1 () {
        // 立即执行一次
        this.currzb_1 = this.zblist_1[this.index_1].name;
        this.index_1++;
        if(this.index_1 >= this.zblist_1.length){
            this.index_1 = 0;
        }
        // 同时开启定时器
        this.timer_1 = setInterval(() => {
            this.currzb_1 = this.zblist_1[this.index_1].name;
            this.index_1++;
            if(this.index_1 >= this.zblist_1.length){
                this.index_1 = 0;
            }
        }, 5000);
    },
    stopAutoSwitch_1 () {
        clearInterval(this.timer_1)
    },

    initCharts_1(x,y) {
      const _echarts = this.$echarts;
  　　let myChart = _echarts.init(this.$refs.right_1_1);
  　　// 绘制图表
      var data_val = y,
          xdata = x;
  　　myChart.setOption({
          grid: {
              left: '3%',
              right: '4%',
              bottom: '10%',
              top: '20%',
              containLabel: true
          },
          tooltip: {
              show: true,
              trigger: 'axis',
              formatter: '{b} : {c}'
          },
          xAxis: {
              type: 'category',
              data: xdata,
              axisPointer: {	//指示器
                  type: 'line',
                  lineStyle: {
                      color: "rgba(255,255,255,0.3)",
                      width: 1,
                      type: "dotted"
                  }
              },
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
                          // label: {
                          //     show: true,
                          //     position: 'top',
                          //     textStyle: {
                          //         color: '#36F4DA',
                          //         fontSize: 9
                          //     }
                          // }
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

    .cus_btn_more{
      position: absolute;
      top: 0.04rem;
      right: 0.1rem;
      z-index: 9;
      text-align: center;
      color: #fff !important;
      height: 0.24rem;
      padding: 0 0.15rem;
      line-height: 0.23rem;
      border-radius: 0.15rem;
      font-size: 0.13rem;
      letter-spacing: 0.01rem;
      background-color: transparent !important;
      background: #502AE3;
      background: -moz-linear-gradient(top, #54E8DF, #2F3AEF);
      background: -webkit-gradient(linear, 0 0, 0 bottom, from(#54E8DF), to(#2F3AEF));
      cursor: pointer;
      border: 0.01rem solid #091220;
    }
  }
  .right_3_video_btns_wrap{
    height: 0.27rem;
    margin-bottom: 0.11rem;
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
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

      /deep/ .el-loading-spinner{
          margin-top: 0;
          transform: translateY(-50%);
      }
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