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
          title: "河道断面图",
          name: "1",
          menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=9c48aa0ce0bb44b8b281773c7520d2ac&menuName=水环境监测#views/we/index_duanmianjiance.html`
        },
        {
          title: "河流检测数据",
          name: "2",
          menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=9c48aa0ce0bb44b8b281773c7520d2ac&menuName=水环境监测#views/we/riverData_list.html`
        },
        {
          title: "河道周边重点监管",
          name: "3",
          menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=9c48aa0ce0bb44b8b281773c7520d2ac&menuName=水环境监测#views/we/weCompanyInfo_list.html`
        },
        {
          title: "河道闸口信息",
          name: "4",
          menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=9c48aa0ce0bb44b8b281773c7520d2ac&menuName=水环境监测#views/we/weGateInfo_list.html`
        },
        {
          title: "水环境采集数据",
          name: "5",
          menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=9c48aa0ce0bb44b8b281773c7520d2ac&menuName=水环境监测#views/we/approval_data_list.html`
        },
        {
          title: "区域监测数据",
          name: "6",
          menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=9c48aa0ce0bb44b8b281773c7520d2ac&menuName=水环境监测#views/we/areaData_list.html`
        },
        {
          title: "乡镇监测数据",
          name: "7",
          menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=9c48aa0ce0bb44b8b281773c7520d2ac&menuName=水环境监测#views/we/townData_list.html`
        }
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