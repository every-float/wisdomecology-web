<template>
    <el-container class="block-container" :style=" 'height: ' + $attrs.height + '' ">
        <el-header style="height: 0.32rem; padding: 0;">
            <div 
                class="block-container-title" 
                :title="$attrs._title"
                :style="{ backgroundImage: 'url('+titleBgImg+')', width: titleWidth }">
                {{ $attrs._title }}
            </div>
        </el-header>
        <el-main>
            <slot></slot>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        computed: {
            titleBgImg() {
                return this.$attrs._title.length<=9 ? require('@/assets/image/title_bg_short.png') : require('@/assets/image/title_bg_long.png') 
            },
            titleWidth() {
                return this.$attrs._title.length<=9 ? "41.30434782608696%" : "52.17391304347826%"
            },
        },
    }
</script>

<style lang="scss" scoped>
    .block-container{

        .block-container-title{
            height: 100%;
            line-height: 0.32rem;
            text-indent: 0.15rem;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 100%;
            color: #FCFDFF;
            font-size: 0.15rem;
            text-align: left;
            @include text-beyond;
        }
        .el-main{
            padding: 0.1rem;
        }
    }
</style>