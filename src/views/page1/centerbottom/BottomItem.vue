<template>
    <!-- 128 / 150 -->
    <div class="bottom-item">
        <p>{{ $attrs.odata.name }}</p>
        <i class="item-img" :style=" 'backgroundImage: url(' + itemImg + ')' "></i>
        <i class="base-icon"></i>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                itemImg: require(`@/assets/image/${this.$attrs.odata.img}`)
            }
        },
    }
</script>

<style lang="scss" scoped>
    .bottom-item{

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