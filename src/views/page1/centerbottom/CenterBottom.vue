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
    import BottomItem from "./BottomItem"

    const itemData = [
        {
            name: "综合管理",
            img: "page1_zonghe.png",
            bottom: "3%",
            left: "28.5%"
        },{
            name: "土壤监控",
            img: "page1_turang.png",
            bottom: "8%",
            left: "35.6%"
        },{
            name: "大气监控",
            img: "page1_daqi.png",
            bottom: "13.6%",
            left: "42.8%"
        },{
            name: "水环境监控",
            img: "page1_shuihuanjing.png",
            bottom: "13.6%",
            left: "50%"
        },{
            name: "噪声监控",
            img: "page1_zaosheng.png",
            bottom: "8%",
            left: "57.2%"
        },{
            name: "应急保障",
            img: "page1_yingji.png",
            bottom: "3%",
            left: "64.3%"
        },
    ]

    export default {
        components: {
            BottomItem,
        },
        data() {
            return {
                itemData,
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