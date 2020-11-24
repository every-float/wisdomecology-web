<template>
    <svg :class="svgClass" v-on="$listeners" :style=" `fill: ${color};` ">
        <use :xlink:href="iconIdentiy"></use>
    </svg>
</template>

<script>
    export default {
        name: 'SvgIcon',
        props: {
            iconName: {
                type: String,
                required: true
            },
            className: {
                type: String,
                default: ''
            },
            color: {
                type: String,
                default: '#37B2F6'
            }
        },
        computed: {
            svgClass() {
                if(this.className){
                    return 'svg-icon ' + this.className
                } else {
                    return 'svg-icon'
                }
            },
            iconIdentiy() {
                return `#icon-${this.iconName}`
            }
        }
    }
</script>

<style lang="scss" scoped>
    .svg-icon {
        overflow: hidden;
    }
</style>