<template>
    <div id="bmap" class="b-map"></div>
</template>

<script>
	import mapMarkerStyle from '@/utils/mapMarkerStyle';
	import mapStyle from '@/utils/mapStyle';
	import mapIconDong from '@/assets/image/icon_dong.gif';
	import mapWinDown from '@/assets/image/down.png';
	import { mapState } from 'vuex';

    let map;
    const mapAreaName = "天津市西青区";
    const mapCenterPoint = {
		lng: 117.16331968147409,
		lat: 39.017172739051034,
	};
	const mapLevel = 11;

    export default {
        data() {
            return {
                airQualityData: {},
            }
		},
		computed: {
			...mapState('page2', ['shizhan', 'xiangzhen'])
		},
		beforeMount () {
			this.handleAirQuality();
		},
        mounted () {
            this.bmap_init();
        },
        methods: {
            // 获取空气质量信息
            handleAirQuality() {
				this.airQualityData = JSON.parse(JSON.stringify(this.shizhan.filter(function(v){
					return v.pointId === '4e4860553999471883954ecde87d540c';	//取的辛老路数据
				})[0]));
				var arr = ['aqi', 'pm2_5', 'pm10', 'so2', 'no2', 'co', 'o3'];
				arr.forEach(v => {
					this.airQualityData[v] = mapMarkerStyle(v, this.airQualityData[v]);
				});
			},

            // 地图相关
            bmap_init() {
				map = new BMap.Map("bmap");
				map.centerAndZoom(new BMap.Point(mapCenterPoint.lng, mapCenterPoint.lat), mapLevel);
				map.enableScrollWheelZoom();
				window.addEventListener('resize', () => {
					map.setViewport();
				});
                map.setMapStyleV2({
                    styleJson: mapStyle
                });
				// 画行政区线
				this.bmap_getBoundary(map);
            },
            bmap_getBoundary(map) {
				var bdary = new BMap.Boundary();
				bdary.get(mapAreaName, rs => {
					map.clearOverlays(); //清除地图覆盖物
					const count = rs.boundaries.length; //行政区域的点有多少个
					if (count === 0) {
						console.error('未能获取当前行政区域');
						return;
					}
					for (let i = 0; i < count; i++) {
						const polyline = new BMap.Polygon(rs.boundaries[i], {
							strokeWeight: 3,
							strokeColor: "#00F1F1",
							strokeOpacity: 1,
							fillOpacity: 0.1,
							fillColor: "#00F1F1"
						}); //建立多边形
						map.addOverlay(polyline); //添加多边形
						// map.setViewport(polyline.getPath());
					}
					this.bmap_addMarker(map);
				});
			},
			bmap_addMarker(map) {
				this.$set(this.airQualityData, 'areaType', 'shizhan');
				if(JSON.stringify(this.xiangzhen)!='{}'){
					let xiangzhenArr = JSON.parse(JSON.stringify(this.xiangzhen));
					let arr = ['aqi', 'pm2_5', 'pm10', 'so2', 'no2', 'co', 'o3'];
					xiangzhenArr.forEach(v1 => {
						this.$set(v1, 'areaType', 'xiangzhen');
						arr.forEach(v2 => {
							v1[v2] = mapMarkerStyle(v2, v1[v2]);
						});
					});
					this.marker_list = [this.airQualityData].concat(xiangzhenArr);
					this.marker_list.forEach((v, k) => {
						var mapImageOffset;
						if(v.areaType === "shizhan"){
							mapImageOffset = new BMap.Size(-28*v['aqi']['icon_x'], -28);
						}else if(v.areaType === "xiangzhen"){
							mapImageOffset = new BMap.Size(-28*v['aqi']['icon_x'], -56);
						}
						const myIcon = new BMap.Icon(mapIconDong,
							new BMap.Size(28, 28), {
								offset: new BMap.Size(0, 0),
								imageOffset: mapImageOffset
							}
						);
						const point = new BMap.Point(v.lng, v.lat);
						const marker = new BMap.Marker(point, {
							icon: myIcon
						});
						map.addOverlay(marker);
						marker.addEventListener("mouseover", () => {
							var iw = this.createInfoWindow(v);
							marker.openInfoWindow(iw);
						});
						marker.addEventListener("mouseout", () => {
							// marker.closeInfoWindow();		//这里存在个问题，鼠标移出标记移到与之对应的信息框上也会关闭，待解决
						});
					});
				}

			},
			createInfoWindow(v){
				const json = v;
				const opts = {
					width: 0, // 信息窗口宽度
					height: 0, // 信息窗口高度
					enableMessage: true, //设置允许信息窗发送短息
					offset:{
						height:10,
						width:-13
					},
					message: ""
				}
				const html = `<div class="contentBox" style="width:250px;">
								<h3 class="title_top">${json.pointName}</h3>
								<hr style="padding:0px;margin:5px 0px;height:1px;background:#34A6CB;">
								<div class="layui-row layui-col-space5">
									<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
										<div class="api_item">
											<div class="api_title" style="background:${json.aqi.bgcolor};color:${json.aqi.color};">AQI</div>
											<div class="api_value">
												${json.aqi.value}
												<span class="layui-badge" style="background:${json.aqi.bgcolor}!important;color:${json.aqi.color}!important;">${json.aqi.level}</span>
											</div>
										</div>
									</div>
									<div class="layui-col-xs8 layui-col-sm8 layui-col-md8">
										<div class="layui-row layui-col-space5">
										<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
											<div class="win_item_box">
												<div class="win_title" style="background:${json.pm2_5.bgcolor};color:${json.pm2_5.color};">PM2.5</div>
												<div class="win_value">${json.pm2_5.value}</div>
											</div>
										</div>
										<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
											<div class="win_item_box">
												<div class="win_title" style="background:${json.pm10.bgcolor};color:${json.pm10.color};">PM10</div>
												<div class="win_value">${json.pm10.value}</div>
											</div>
										</div>
										<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
											<div class="win_item_box">
												<div class="win_title" style="background:${json.o3.bgcolor};color:${json.o3.color};">O3</div>
												<div class="win_value">${json.o3.value}</div>
											</div>
										</div>
									</div>
									<div class="layui-row layui-col-space10">
										<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
											<div class="win_item_box">
												<div class="win_title" style="background:${json.so2.bgcolor};color:${json.so2.color};">SO2</div>
												<div class="win_value">${json.so2.value}</div>
											</div>
										</div>
										<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
											<div class="win_item_box">
												<div class="win_title" style="background:${json.no2.bgcolor};color:${json.no2.color};">NO2</div>
												<div class="win_value">${json.no2.value}</div>
											</div>
										</div>
										<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
											<div class="win_item_box">
												<div class="win_title" style="background:${json.co.bgcolor};color:${json.co.color};">CO</div>
												<div class="win_value">${json.co.value}</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<h6 class="title_bottom">更新于：${json.time}</h6>
							<div style="height:1px;">
								<img src=${mapWinDown} />
							</div
						</div>`;
				const iw = new BMap.InfoWindow(html, opts);
				return iw;
			},
        },
    }
</script>

<style lang="scss">
#bmap{
    width: 100%;
    height: 100%;
}
// 以下样式专为百度地图弹框服务
.BMap_bubble_title {
	color:white;
	font-size:13px;
	font-weight:bold;
	text-align:left;
	padding-left:5px;
	padding-top:5px;
	border-bottom:1px solid gray;
	background-color:#605ca8;
}
.BMap_bubble_content {
	background-color:white;
	padding-left:3px;
	padding-right: 3px;
	padding-top:3px;
	padding-bottom:3px;
	border-radius: 3px;
}
.windowTable td.title{
	text-align: center;
	width: 25%;
	background: #34A6CB;
	color: white;
}
.windowTable td.value{
	text-align: center;
	width: 25%;
	font-size: 18px;
	font-weight: bold;
}
.BMap_pop>img{
	display: none;
}
.BMap_pop>div:nth-child(5) {
	display: none;
}
.BMap_pop>div:nth-child(8)>img {
	display: none;
}
.BMap_pop>div:nth-child(9) {
	top:35px !important;
	border-radius:7px;
}
.BMap_top {
	display:none;
}
.BMap_bottom {
	display:none;
}
.BMap_center {
	display:none;
}
.BMap_pop>div:nth-child(1) div {
	display:none;
}
.BMap_pop>div:nth-child(3) {
	display:none;
}
.BMap_pop>div:nth-child(7) {
	display:none;
}
.BMap_pop>div:nth-child(8) {
	top: 162px!important;
}
.BMap_pop>div:nth-child(9) {
	overflow: visible!important;
	height: auto!important;
}
.title_top{
	background: url("~@/assets/image/dian.png");
	background-position: left center;
	padding-left: 15px;
	background-size: 8px 8px;
	background-repeat: no-repeat;
	font-size: 0.18rem;
	font-weight: 400;
	line-height: 100%;
	margin: 0;
	text-align: left;
	color: #000;
}
.tipBoxItem{
	border: 1px solid #ccc;
	border-radius: 8px;
	overflow: hidden;
}
.layui-layer-adminRight{
	top: 0px!important;
}
.layui-layer-setwin .layui-layer-close2{
	right: -5px!important;
	top: -9px!important;
}
.layui-layer-adminRight>div.layui-layer-btn{
	position: fixed;
	right: 0px;
	bottom: 0px;
}
.contentBox{
	padding: 10px;
	box-sizing: border-box;
	width:250px; 
}
.contentBox .title_bottom{
	text-align: right;
	font-size: 0.15rem;
	font-weight: 400;
	line-height: 100%;
	margin: 0;
	color: rgb(0, 0, 0);
	padding-top: 5px;
}
.contentBox .title{
	background:#13aeff; 
}
.contentBox>div>img{
	position: absolute;
	bottom: -10px;
	left: 108px;
}
.contentBox .api_item{
	border: 1px solid #ccc;
	text-align: center;
	height: 110px;
	line-height: 50%;
	border-radius: 5px;
}
.contentBox .api_title{
	height: 45px;
	line-height: 43px;
	color: white;
	font-size: 25px;
	font-weight: bold;
}
.contentBox .api_value{
	position: relative;
	height: 70px;
	line-height: 47px;
	font-size: 25px;
	font-weight: bold;
	color: rgb(0, 0, 0);
}
.contentBox .api_value .layui-badge{
	height: 20px;
	position: absolute;
	left: 0px;
	width: 100%;
	line-height: 19px;
	bottom: 5px;
	box-sizing: border-box;
}
.contentBox .win_title{
	color: white;
	height: 25px;
	line-height: 25px;
	text-align: center;
}
.contentBox .win_value{
	height: 25px;
	line-height: 25px;
	text-align: center;
	color: rgb(0, 0, 0);
	font-size: 14px;
}
.contentBox .win_item_box{
	border: 1px solid #ccc;
	border-radius: 5px;
	overflow: hidden;
	font-size: 0.15rem;
}
</style>