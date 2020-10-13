<template>
    <div class="page3">
        <el-container>
            <!-- 背景地图 -->
            <b-map></b-map>
            <!-- 头部 -->
            <el-header class="cus-header" :height="headerHeight">
                <div class="cus-header-item1">
                    <back-prevpage></back-prevpage>
                    <div class="logo-img"></div>
                </div>
                <div class="cus-header-item2"></div>
                <div class="cus-header-item3"></div>
                <header-left></header-left>
                <header-right></header-right>
            </el-header>
            <!-- 底部装饰 -->
            <div class="cus-footer-bg"></div>
            <!-- 左侧 -->
            <main-left></main-left>
            <!-- 右侧 -->
            <main-right></main-right>
            <!-- 底部菜单按钮组 -->
            <bottom-menus></bottom-menus>
        </el-container>
    </div>
</template>

<script>
    import BMap from '@/views/page3/BMap';
    import HeaderLeft from '@/views/page3/HeaderLeft';
    import HeaderRight from '@/views/page3/HeaderRight';
    import MainLeft from '@/views/page3/mainleft/MainLeft'
    import MainRight from '@/views/page3/mainright/MainRight'
    import BottomMenus from '@/views/page3/BottomMenus';
    import BackPrevpage from '@/components/BackPrevpage';

    export default {
        components: {
            BMap,
            HeaderLeft,
            HeaderRight,
            MainLeft,
            MainRight,
            BottomMenus,
            BackPrevpage,
        },
        data () {
            return {
                headerHeight: '1.10rem',
            }
        },
        mounted () {
            
        },
        methods: {
            
        },
    }
</script>

<style lang="scss" scoped>
    .el-container {
        height: 100%;
        position: relative;

        .bottom-menus{
        position: absolute;
        width: 48.4375%;
        height: 0.42rem;
        left: 25.78125%;
        bottom: 0.64rem;
        font-size: 0.16rem;
        }

        .main-left, .main-right{
        position: absolute;
        width: 24.1%;
        height: 9.54rem;
        top: 1.1rem;
        background-color: $asideBgColor;
        }

        .main-left{
        left: 1.04%;
        }
        .main-right{
            right: 1.04%;
        }

        .cus-footer-bg{
        position: absolute;
        width: 100%;
        height: 0.6rem;
        bottom: 0;
        left: 0;
        background: url("~@/assets/image/footer_bg_4000.png") no-repeat center;
        background-size: auto 100%;
        }

        .cus-header{
        background: url("~@/assets/image/page3_title_4000.png") no-repeat center;
        background-size: auto 100%;
        padding: 0;
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        display: flex;
        display: -webkit-flex;

        .cus-header-item1{
            flex-grow: 1;
            position: relative;

            .logo-img{
            position: absolute;
            width: 0.52rem;
            height: 0.52rem;
            background: url("~@/assets/image/logo.png") no-repeat center;
            background-size: 100% 100%;
            top: 0.15rem;
            right: 0;
            }
        }
        .cus-header-item2{
            width: 4.4rem;
        }
        .cus-header-item3{
            flex-grow: 1;
        }

        .cus-header-left{
            position: absolute;
            width: 22.13%;
            top: 0.6rem;
            left: 1.302%;
            text-align: left;
            @include text-beyond;
        }

        .cus-header-right{
            position: absolute;
            width: 23.6%;
            right: 0.1%;
            top: 0.6rem;
            text-align: right;
        }
        }
    }
</style>