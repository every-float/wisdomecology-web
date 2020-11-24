<template>
  <div class="bottom-menus">
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editableTabsValue: "1",
      editableTabs: [
        {
          title: "数据综合分析",
          name: "1",
          menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=c616b74328504b6085ac923c1e117755&menuName=大气环境监测#views/daqi/index_zonghefenxi.html`
        },
        {
          title: "微型空气站",
          name: "2",
          menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=c616b74328504b6085ac923c1e117755&menuName=大气环境监测#views/daqi/index_weizhan.html`
        },
        {
          title: "颗粒物监测",
          name: "3",
          menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=c616b74328504b6085ac923c1e117755&menuName=大气环境监测#views/daqi/index_keliwu.html`
        },
        // {
        //   title: "扬尘监测",
        //   name: "4",
        //   menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=c616b74328504b6085ac923c1e117755&menuName=大气环境监测#http://101.200.202.111:9000/login.aspx`
        // },
        {
          title: "油烟监测",
          name: "5",
          menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=c616b74328504b6085ac923c1e117755&menuName=大气环境监测#views/daqi/index_youyan.html`
        },
        {
          title: "遥感尾气监测",
          name: "6",
          menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=c616b74328504b6085ac923c1e117755&menuName=大气环境监测#views/dq/yaoganweiqi.html`
        },
        {
          title: "污染源监测",
          name: "7",
          menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=c616b74328504b6085ac923c1e117755&menuName=大气环境监测#views/daqi/index_wuranyuan.html`
        },
        {
          title: "工况用电监测",
          name: "8",
          menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=c616b74328504b6085ac923c1e117755&menuName=大气环境监测#http://111.33.57.10:8081/distb/#/login`
        },
        {
          title: "VOC监测",
          name: "90",
          menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=c616b74328504b6085ac923c1e117755&menuName=大气环境监测#views/daqi/index_voc.html`
        },
        {
          title: "走航检测",
          name: "10",
          menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=c616b74328504b6085ac923c1e117755&menuName=大气环境监测#views/dq/zouhang.html`
        },
        {
          title: "高架视频",
          name: "11",
          menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=c616b74328504b6085ac923c1e117755&menuName=大气环境监测#views/dq/overheadVideo_list.html`
        },
      ],
    };
  },
  methods: {
    handleClick(tab) {
      let url = this.editableTabs.filter(v => {
        return v.name === tab.name
      })[0].menuUrl;
      window.open( url, '_self', '', false );
    }
  },
};
</script>

<style lang="scss">
    .bottom-menus{
        
        .el-tabs__nav{
            border-radius: 0% !important;
            border: none !important;
            // width: 100%;
        }
        .el-tabs__item{
            height: 0.42rem;
            line-height: 0.42rem;
            border-left: none;
            border-bottom: none !important;
            background-color: #027FFF;
            border: 1px solid #43CDFB;
            color: #ffffff;
            margin: 0 0.08rem;
        }
        .el-tabs__item:hover{
            color: #92ccff;
        }
        .el-tabs__item.is-active{
            color: #ffffff;
        }
        .el-tabs__nav-next, .el-tabs__nav-prev{
            line-height: 0.42rem;
            width: 0.4rem;
        }
        .el-tabs__nav-next::after, .el-tabs__nav-prev::after{
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 9;
        }
        .el-tabs__nav-next::after{
            background: url("~@/assets/image/arrowright.png") no-repeat center;
            background-size: 100% 100%;
        }
        .el-tabs__nav-prev::after{
            background: url("~@/assets/image/arrowleft.png") no-repeat center;
            background-size: 100% 100%;
        }
        .el-tabs--card>.el-tabs__header{
            border-bottom: 0;
            margin: 0;
        }
        .el-tabs__content{
            display: none;
        }
        .el-tabs__nav-wrap.is-scrollable{
            padding: 0 0.5rem;
        }
    }
</style>