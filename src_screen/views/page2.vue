<template>
    <div class="page2" v-if="$store.state.page2.isComplete">
        <el-container>
            <!-- 背景地图 -->
            <b-map></b-map>
            <!-- 头部 -->
            <el-header class="cus-header" :height="headerHeight">
                <div class="cus-header-item1">
                    <back-prevpage to="/page1"></back-prevpage>
                    <div class="logo-img"></div>
                </div>
                <div class="cus-header-item2"></div>
                <div class="cus-header-item3"></div>

                <!-- <div class="cus-header-light"></div> -->
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
    import BMap from '@/views/page2/BMap';
    import HeaderLeft from '@/views/page2/HeaderLeft';
    import HeaderRight from '@/views/page2/HeaderRight';
    import MainLeft from '@/views/page2/mainleft/MainLeft'
    import MainRight from '@/views/page2/mainright/MainRight'
    import BottomMenus from '@/views/page2/BottomMenus';
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
        created () {
            this.getFirstdata();
            setTimeout(() => {
                location.reload();
            }, 1000*60*10);
        },
        mounted () {
        
        },
        methods: {
            getFirstdata() {
                try {
                    this.$store.dispatch('page2/getFirstdata', {})
                } catch (error) {

                }
            },


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
            background: url("~@/assets/image/page2_title_w4000_v2.png") no-repeat;
            background-position: center top;
            background-size: auto 0.86rem;
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
            width: 5rem;
        }
        .cus-header-item3{
            flex-grow: 1;
        }

        .cus-header-light{
            position: absolute;
            width: 100%;
            height: 1.1rem;
            background: url("~@/assets/image/light.png") no-repeat;
            background-position: center 14%;
            background-size: 100% auto;
            left: 0rem;
            top: 0rem;
            opacity: 0.1;
            // transform: scaleX(0.3);
            // -webkit-transform: scaleX(0.3);
            animation: twinkle 3s linear infinite;
            -webkit-animation: twinkle 3s linear infinite;
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