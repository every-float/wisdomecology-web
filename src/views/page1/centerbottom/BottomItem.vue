<template>
    <!-- 128 / 150 -->
    <a class="bottom-item" 
        :href="menuItemHref" 
        @click=" $attrs.odata.name==='应急保障' && openContactListPage($attrs.odata.menuUrl) ">
        <p>{{ $attrs.odata.name }}</p>
        <i class="item-img" :style=" 'backgroundImage: url(' + itemImg + ')' "></i>
        <i class="base-icon"></i>
    </a>
</template>

<script>
    export default {
        data() {
            return {
                itemImg: require(`@/assets/image/${this.$attrs.odata.img}`)
            }
        },
        mounted () {
            
        },
        computed: {
            menuItemHref() {
                if(this.$attrs.odata.name === "应急保障") {
                    return 'javascript:void(0);'
                }else {
                    return this.$attrs.odata.menuUrl
                }
            }
        },
        methods: {
            openContactListPage(menuUrl) {
                window.open(menuUrl, "视频通话窗口", "location=no,menubar=no,status=no,titlebar=no,toolbar=no,width=1000,height=540,left=200,top=100,screenLeft=200,screenTop=150");
            }
        },
    }
</script>

<style lang="scss" scoped>
    .bottom-item{
        text-decoration: none;

        p{
            width: 100%;
            font-size: 0.18rem;
            font-weight: 600;
            color: #0EBDDC;
            line-height: 1;
            text-align: center;
            @include text-beyond;
        }
        .item-img{
            width: 50%;
            height: 42.9530201342%;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 100%;
        }
        .base-icon{
            width: 36.71875%;
            height: 25.50335570469799%;
            background: url("~@/assets/image/page1_base_icon.png") no-repeat center;
            background-size: 100% 100%;
        }
    }
</style>