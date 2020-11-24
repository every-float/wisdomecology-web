<template>
    <div class="cus-header-left">
        <!-- svg打包的方式灵活好用 -->
        <svg-icon icon-name="rili" class="cus-svg-icon"></svg-icon>
        <span style="margin-left: 2%;">{{ date }}</span>
        <span style="margin-left: 4%;">{{ week }}</span>
        <span style="margin-left: 4%; color: #0FAAC6; font-weight: bold;">{{ time }}</span>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        data() {
            return {
                date: '',
                week: '',
                time: '',
                weekObj: ['日', '一', '二', '三', '四', '五', '六'],
                timer: '',
            }
        },
        mounted() {
            this.getCurrDateTime();
            this.timer = setInterval(() => {
                this.getCurrDateTime();
            }, 1000);
        },
        beforeDestroy () {
            clearInterval(this.timer);
        },
        methods: {
            getCurrDateTime() {
                this.date = moment().format('YYYY年MM月DD日');
                this.week = '星期' + this.weekObj[moment().format('d')];
                this.time = moment().format('HH:mm:ss');
            },
        },
    }
</script>

<style lang="scss" scoped>
    .cus-header-left{
        font-size: 0.16rem;
        color: #ffffff;
        font-weight: 400;

        .el-icon-date, .el-icon-location{
            color: #37B2F6;
        }

        .cus-svg-icon{
            width: 0.2rem;
            height: 0.2rem;
            vertical-align: middle;
        }

        span{
            vertical-align: middle;
        }
    }
</style>