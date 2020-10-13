<template>
    <div class="center-bottom">
        <bottom-item 
            v-for="vo in itemData" 
            :key="vo.name" 
            :odata="vo"
            :style=" {bottom: vo.bottom, left: vo.left} "
            :title="vo.name" 
        ></bottom-item>
    </div>
</template>

<script>
    import BottomItem from "./BottomItem";

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
                        menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=a57c1882826943c3b845b5b98eabe5c9`
                    },{
                        name: "土壤监控",
                        img: "page1_turang.png",
                        bottom: "8%",
                        left: "35.6%",
                        menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=a57c1882826943c3b845b5b98eabe5c9`
                    },{
                        name: "大气监控",
                        img: "page1_daqi.png",
                        bottom: "13.6%",
                        left: "42.8%",
                        menuUrl: `${this.$store.state.pageUrl}theme/theme_2/#/page2`
                    },{
                        name: "水环境监控",
                        img: "page1_shuihuanjing.png",
                        bottom: "13.6%",
                        left: "50%",
                        menuUrl: `${this.$store.state.pageUrl}theme/theme_2/#/page3`
                    },{
                        name: "噪声监控",
                        img: "page1_zaosheng.png",
                        bottom: "8%",
                        left: "57.2%",
                        menuUrl: `${this.$store.state.pageUrl}views/index2.html?menuId=f3d055931a64448d8311ac6729c70537`
                    },{
                        name: "应急保障",
                        img: "page1_yingji.png",
                        bottom: "3%",
                        left: "64.3%",
                        menuUrl: `${this.$store.state.pageUrl}theme/theme_1/contactList.html`
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