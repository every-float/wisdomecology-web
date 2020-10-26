<template>
    <div class="page1" v-if="$store.state.page1.isComplete">
        <el-container class="cus-container">
            <el-header class="cus-header" :height="headerHeight">
                <div class="cus-header-item1">
                    <div class="logo-img"></div>
                </div>
                <div class="cus-header-item2"></div>
                <div class="cus-header-item3"></div>

                <header-left></header-left>
                <header-right></header-right>
            </el-header>
            <el-main class="cus-main" ref="cusMain">
                <main-left></main-left>
                <main-right></main-right>
                <center-top></center-top>
                <center-bottom ref="baseBg"></center-bottom>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import HeaderLeft from '@/views/page1/HeaderLeft'
    import HeaderRight from '@/views/page1/HeaderRight'
    import MainLeft from '@/views/page1/mainleft/MainLeft'
    import MainRight from '@/views/page1/mainright/MainRight'
    import CenterTop from '@/views/page1/CenterTop'
    import CenterBottom from '@/views/page1/centerbottom/CenterBottom'

    export default {
        components: {
            HeaderLeft,
            HeaderRight,
            MainLeft,
            MainRight,
            CenterTop,
            CenterBottom,
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
            try{
                this.setBasbgSize();
            }catch(err){
                //
            }finally{
                window.addEventListener('resize', () => {
                    this.setBasbgSize();
                })
            }
        },
        updated () {
            this.setBasbgSize();
        },
        methods: {
            setBasbgSize() {  // 保证1920/1080
                const criticalRatio = 1920 / 1080;  //临界宽高比
                const mainWidth = this.$refs.cusMain.$el.clientWidth;
                const mainHeight = this.$refs.cusMain.$el.clientHeight;
                const aspectRatio = mainWidth / mainHeight; //main区域的宽高比
                const container = this.$refs.baseBg.$el;
                if (aspectRatio > criticalRatio) {
                // 宽低型比例
                container.style.height = "100%";
                container.style.width = container.clientHeight * criticalRatio + "px";
                container.style.left = (mainWidth - container.clientHeight * criticalRatio) / 2 + "px";
                } else if (aspectRatio == criticalRatio) {
                // 临界标准型比例
                container.style.height = "100%";
                container.style.width = "100%";
                container.style.left = "0px";
                } else {
                // 窄高型比例
                container.style.width = "100%";
                container.style.height = container.clientWidth / criticalRatio + "px";
                container.style.left = "0px";
                }
            },

            getFirstdata() {
                try {
                    this.$store.dispatch('page1/getFirstdata', {})
                } catch (error) {

                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    .cus-container{
        height: 100%;
        background: url("~@/assets/image/page1_main_bg.png") no-repeat center;
        background-size: cover;

        .cus-header{
        background: url("~@/assets/image/page1_title_w4000_v1.png") no-repeat center;
        background-size: auto 100%;
        padding: 0;
        position: relative;
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
            top: 0.11rem;
            right: 0;
            }
        }
        .cus-header-item2{
            width: 7.3rem;
        }
        .cus-header-item3{
            flex-grow: 1;
        }

        .cus-header-left{
            position: absolute;
            width: 22.13%;
            top: 0.46rem;
            left: 1.04%;
            @include text-beyond;
        }

        .cus-header-right{
            position: absolute;
            width: 23.6%;
            right: 0.1%;
            top: 0.46rem;
        }
        }

        .cus-main{
        padding: 0;
        position: relative;
        overflow: hidden;

        .main-left, .main-right{
            position: absolute;
            width: 24.1%;
            height: 100%;
            top: 0;
            z-index: 9;
            background-color: $asideBgColor;
        }
        .main-left{
            left: 1.04%;
        }
        .main-right{
            right: 1.04%;
        }
        .center-top{
            position: absolute;
            width: 49.72%;
            height: 6.23rem;
            left: 25.14%;
            top: 0;
            z-index: 8;
        }
        .center-bottom{
            position: absolute;
            background: url("~@/assets/image/page1_base_bg.png") no-repeat center bottom;
            background-size: 100% 100%;
            z-index: 7;
            bottom: 0;
        }
        }
    }
</style>