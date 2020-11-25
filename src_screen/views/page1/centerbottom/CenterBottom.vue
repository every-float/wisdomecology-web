<template>
    <div class="center-bottom">
        <bottom-item 
            v-for="(vo, index) in itemData" 
            :key="vo.name" 
            :odata="Object.assign(vo, {index: index})"
            :style=" {bottom: vo.bottom, left: vo.left} "
            :title="vo.name" 
        ></bottom-item>
    </div>
</template>

<script>
    import BottomItem from "./BottomItem";
    import Cookie from 'js-cookie';

    export default {
        components: {
            BottomItem,
        },
        data() {
            return {
                itemData: [
                    {
                        name: "综合管理",
                        img: "page1_zonghe.png",
                        bottom: "3%",
                        left: "28.5%",
                        menuUrl: `${process.env.VUE_APP_PAGEURL}views/index2.html?menuId=a57c1882826943c3b845b5b98eabe5c9&menuName=综合管理`
                    },
                    {
                        name: "土壤监控",
                        img: "page1_turang.png",
                        bottom: "8%",
                        left: "35.6%",
                        menuUrl: `${process.env.VUE_APP_PAGEURL}views/index2.html?menuId=585196faa64043939c13ca8f38215073&menuName=土壤与固废管理`
                    },
                    // {
                    //     name: "污染源监控",
                    //     img: "page1_turang.png",
                    //     bottom: "8%",
                    //     left: "35.6%",
                    //     menuUrl: `${process.env.VUE_APP_PAGEURL}views/index2.html?menuId=26a6c508b37d465f910800d4e73f93d8&menuName=重点污染源管理`
                    // },
                    {
                        name: "大气监控",
                        img: "page1_daqi.png",
                        bottom: "13.6%",
                        left: "42.8%",
                        menuUrl: `#/page2`
                    },{
                        name: "水环境监控",
                        img: "page1_shuihuanjing.png",
                        bottom: "13.6%",
                        left: "50%",
                        menuUrl: `#/page3`
                    },{
                        name: "噪声监控",
                        img: "page1_zaosheng.png",
                        bottom: "8%",
                        left: "57.2%",
                        menuUrl: `${process.env.VUE_APP_PAGEURL}views/index2.html?menuId=f3d055931a64448d8311ac6729c70537&menuName=噪声监控`
                    },{
                        name: "污染源管理",
                        img: "page1_wuranyuan.png",
                        bottom: "3%",
                        left: "64.3%",
                        menuUrl: `${process.env.VUE_APP_PAGEURL}views/index2.html?menuId=26a6c508b37d465f910800d4e73f93d8&menuName=重点污染源管理`
                    },
                ]
            }
        },
        mounted() {
            
        },
        methods: {
            name() {
                
            }
        },
    }
</script>

<style lang="scss" scoped>
    .center-bottom{
        position: relative;

        .bottom-item{
            display: flex;
            display: -webkit-flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            width: 6.6666666666667%;
            height: 13.8888888888889%;
            position: absolute;
            cursor: pointer;
        }
    }
</style>