<template>
    <div class="center-top">
        <!-- <div style="position: absolute; top: 0.2rem; left: 0.2rem;">
            <div class="center-top-title">
                <svg-icon icon-name="jiancedian" class="cus-svg-icon"></svg-icon>
                <span style="font-size: 0.13rem; color: #FFFFFF; margin-left: 0.08rem; vertical-align: middle;">大气环境数据监测点</span>
            </div>
            <div style="text-align: center; font-size: 0.12rem; color: #2766C3;">（位置仅供参考）</div>
        </div> -->
        <img src="~@/assets/image/page1_map.png" alt="">
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
    .center-top{
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        align-items: flex-end;

        img{
            display: block;
            height: 5.24rem;
            width: 9.40rem;
        }
        .cus-svg-icon{
            width: 0.25rem;
            height: 0.25rem;
            vertical-align: middle;
        }
        .center-top-title{
            background-color: rgba(8, 40, 113, 0.59); 
            height: 0.32em; 
            line-height: 0.05; 
            padding: 0 0.08rem; 
            border-radius: 0.03rem;
            @include text-beyond;
        }
    }
</style>