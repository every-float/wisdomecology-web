<template>
    <!-- 128 / 150 -->
    <a class="bottom-item" 
        :href="$attrs.odata.menuUrl"
    >
        <p>{{ $attrs.odata.name }}</p>
        <i class="item-img" ref="bottomItemIcon" :style=" 'backgroundImage: url(' + itemImg + ')' "></i>
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
            // this.setItemBounceDuration();
        },
        computed: {
            
        },
        methods: {
            setItemBounceDuration() {
                // console.log((this.$attrs.odata.index * 2 - 5) * 0.3);
                this.$refs.bottomItemIcon.style.animationDelay = Math.abs(this.$attrs.odata.index * 2 - 5) * 0.3 + 's'
            },
        },
    }
</script>

<style lang="scss" scoped>
    

    .bottom-item{
        text-decoration: none;
        transform: scale(1);
        transform-origin: 50% 100%;
        transition: transform 0.36s;
        transform-style: preserve-3d;

        p{
            width: 100%;
            font-size: 0.18rem;
            font-weight: 600;
            color: #0EBDDC;
            line-height: 1;
            text-align: center;
            transition: color 0.36s;
            @include text-beyond;
        }
        .item-img{
            // width: 50%;
            // height: 42.9530201342%;
            width: 40%;
            height: 34.36241610736%;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 100%;
            transform: translateY(-0.15rem);
            transform-style: preserve-3d;
            animation: beat 2s linear infinite;
        }
        .base-icon{
            width: 36.71875%;
            height: 25.50335570469799%;
            background: url("~@/assets/image/page1_base_icon.png") no-repeat center;
            background-size: 100% 100%;
        }
    }

    .bottom-item:hover{
        transform: scale(1.2);
        color: #ffffff;
    }
    .bottom-item:hover p{
        color: #ffffff;
    }
</style>