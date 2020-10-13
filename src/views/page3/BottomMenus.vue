<template>
  <div class="bottom-menus">
    <el-tabs
      v-model="editableTabsValue"
      type="card"
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
          title: "菜单一",
          name: "1"
        },
        {
          title: "菜单二",
          name: "2"
        },
        {
          title: "菜单三",
          name: "3"
        },
        {
          title: "菜单四",
          name: "4"
        },
        {
          title: "菜单五",
          name: "5"
        },
        {
          title: "菜单六",
          name: "6"
        },
        {
          title: "菜单七",
          name: "7"
        },
        {
          title: "菜单八",
          name: "8"
        },
        {
          title: "菜单九",
          name: "9"
        },
      ],
    };
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