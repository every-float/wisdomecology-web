<template>
    <div class="cus-header-left">
        <!-- svg打包的方式灵活好用 -->
        <svg-icon icon-name="rili" class="cus-svg-icon"></svg-icon>
        <span style="margin-left: 2%;">2020年8月12日</span>
        <span style="margin-left: 4%;">星期一</span>
        <span style="margin-left: 4%; color: #0FAAC6;">23:58:42</span>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
    .cus-header-left{
        font-size: 0.16rem;
        color: #ffffff;
        font-weight: 400;

        .el-icon-date, .el-icon-location{
            color: #37B2F6;
        }

        .cus-svg-icon{
            width: 0.2rem;
            height: 0.2rem;
            vertical-align: middle;
        }

        span{
            vertical-align: middle;
        }
    }
</style>