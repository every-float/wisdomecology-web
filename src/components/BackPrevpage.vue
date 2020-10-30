<template>
    <a class="back_prev_page" href="javascript:history.back(-1)">
        <i class="el-icon-back"></i><span style="vertical-align: middle;">返回</span>
    </a>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
    .back_prev_page{
        position: absolute;
        color: #FFFFFF;
        left: 0.12rem;
        top: 0.02rem;
        font-size: 0.2rem;
        font-weight: 600;
        cursor: pointer;
        z-index: 99;

        .el-icon-back{
            font-size: 0.2rem;
            font-weight: 600;
            vertical-align: middle;
            margin-right: 0.05rem;
        }
    }
</style>