<template>
    <div class="contentBox-water" v-if="isShow" :style="{top: infoWinTop+'px', left: infoWinLeft+'px'}" @click.stop>
        <h3 class="title-water">{{ waterName }}</h3>
        <hr style="padding:0px; margin:5px 0px; height:1px; background:#34A6CB;">
        <div class="main-water">
            <div class="main-water-class">{{ waterClass }}</div>
            <div class="main-water-other">
                <div class="mian-water-other-item" v-for="vo in zblist" :key="vo.name">
                    <div class="main-water-other-item-title">{{ vo.bigName }}</div>
                    <div class="main-water-other-item-value">{{ vo.value }}</div>
                </div>
            </div>
        </div>
        <h6 class="time-water">更新于：{{ waterTime }}</h6>
        <div class="water-arrow" style="height:1px;">
            <img v-if="arrowIsDown" src="~@/assets/image/down.png" />
            <img v-else src="~@/assets/image/down.png" style="transform: rotate(180deg); top: -10px;" />
        </div>
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    import { Loading } from 'element-ui';

    export default {
        data() {
            return {
                isShow: false,
                infoWinTop: 0,
                infoWinLeft: 0,
                arrowIsDown: true,
                waterName: '-',
                waterClass: '-',
                waterTime: '-',
                zblist: [
                    {
                        name: 'item_hxxyl',
                        bigName: 'COD',
                        value: '-',
                    },{
                        name: 'item_ad',
                        bigName: '氨氮',
                        value: '-',
                    },{
                        name: 'item_zonglin',
                        bigName: '总磷',
                        value: '-',
                    },{
                        name: 'item_gmsyzs',
                        bigName: '高锰酸盐',
                        value: '-',
                    }
                ],
            }
        },
        computed: {
            ...mapState('page1', ['riverTree', 'riverGridDataAllR'])
        },
        methods: {
            ...mapActions('page1', ['getRiverGridDataR']),
            async getData(id) {
                if(!this.riverGridDataAllR[id]){
                    const loading = Loading.service({
                        target: document.querySelector(".contentBox-water"),
                        lock: true,
                        text: '',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.8)'
                    });
                    await this.getRiverGridDataR({
                        sectionCode: id
                    });
                    loading.close();
                }
                this.handleData(id)
            },
            handleData(id) {
                const riverGridDataR = this.riverGridDataAllR[id];
                let realData;
                if(riverGridDataR && riverGridDataR.length > 0){
                    realData = riverGridDataR.filter(v => v.classname !== '—')[0] || riverGridDataR[0];
                }else{
                    realData = null;
                }
                console.log(realData);
                this.waterName = this.riverTree.filter(v => v.id===id)[0].name;
                this.waterClass = (() => {
                    if(realData){
                        if(realData['classname'] && realData['classname'] !== '—'){
                            return realData['classname']+'类';
                        }else{
                            return '无';
                        }
                    }else{
                        return '无';
                    }
                })();
                this.waterTime = realData ? realData.monitordatetime : '-';
                this.zblist.forEach(v => {
                    let zhi = '';
                    if(realData === null){
                        zhi = '-'
                    }else{
                        zhi = realData[v.name] || '-'
                    }
                    v['value'] = zhi;
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .contentBox-water{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99999;
        width: 250px;
        height: 180px;
        background-color: #ffffff;
        font-size: 0.18rem;
        padding: 10px;
        border-radius: 3px;
        box-sizing: border-box;
        -webkit-box-shadow: 0px 0px 80px 3px #000;
        box-shadow: 0px 0px 80px 3px #000;

        .title-water{
            background: url("~@/assets/image/location.png") no-repeat left center;
            padding-left: 0.2rem;
            background-size: 0.18rem 0.18rem;
            font-size: 0.18rem;
            margin: 0;
            text-align: left;
            color: #000;
        }
        .time-water{
            text-align: right;
            font-size: 0.15rem;
            line-height: 100%;
            margin: 0;
            color: 000;
            padding-top: 5px;
        }
        .water-arrow img{
            position: absolute;
            bottom: -10px;
            left: 108px;
        }
        .main-water{
            display: flex;
            justify-content: space-between;

            .main-water-class{
                width: 96px;
                background: url("~@/assets/image/water_class_bg.png") no-repeat center;
                background-size: 96px 96px;
                font-size: 22px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .main-water-other{
                width: 120px;
                height: 113px;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;

                .mian-water-other-item{
                    width: 54px;
                    height: 54px;
                    background: url("~@/assets/image/water_other_bg.png") no-repeat center bottom;
                    background-size: 48px 48px;
                    margin-bottom: 3px;

                    .main-water-other-item-title{
                        height: 18px;
                        color: #313131;
                        font-size: 12px;
                        text-align: center;
                        line-height: 18px;
                        border: 1px solid #8ECFF5;
                        background-color: rgba(255,255,255,0.9);
                    }
                    .main-water-other-item-value{
                        font-size: 14px;
                        font-weight: 700;
                        text-align: center;
                        margin-top: 7px;
                    }
                }
            }
        }
    }
</style>