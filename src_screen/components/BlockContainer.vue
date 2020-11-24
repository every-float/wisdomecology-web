<template>
    <el-container class="block-container" :style=" 'height: ' + $attrs.height + '' ">
        <el-header style="height: 0.32rem; padding: 0;">
            <div 
                class="block-container-title" 
                :title="$attrs._title"
                :style="{ backgroundImage: 'url('+titleBgImg+')', width: titleWidth }">
                {{ $attrs._title }}
            </div>
            <div class="block_btns_wrap" v-if="$attrs.btn">
                <a class="block_btns_btn" :href="$attrs.btn.href || 'javascript:;'">{{ $attrs.btn.text }}</a>
            </div>
        </el-header>
        <el-main>
            <!-- 这是一个作用域插槽，将该组件内部的数据暴露出去了
                调用它的父组件可以通过以下方式使用这个组件内部数据:
                <block-container>
                    <template v-slot:default="slotProps">
                        {{ slotProps.totalHeight }}
                        ....
                    </template>
                </block-container>
             -->
            <slot :totalHeight="totalHeight"></slot>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                totalHeight: '',
            }
        },
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

        /deep/ .el-header{
            position: relative;

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
            .block_btns_wrap{
                width: 0.6rem;
                height: 0.27rem;
                line-height: 0.27rem;
                font-size: 0.14rem;
                position: absolute;
                top: 0.025rem;
                right: 0.1rem;

                .block_btns_btn{
                    display: block;
                    width: 100%;
                    height: 100%;
                    background-color: #05AFE5;
                    color: #FFFFFF;
                    cursor: pointer;
                    // @include text-beyond;
                }
            }
        }
        .el-main{
            padding: 0.1rem;
        }
        
    }
</style>