<template>
    <div id="bmap" class="b-map"></div>
</template>

<script>
	// import {getAirQuality, getXiangzhenData} from '@/service/api.js';
	import mapMarkerStyle from '@/utils/mapMarkerStyle';
	import mapStyle from '@/utils/mapStyle';
	import mapIconDong from '@/assets/image/icon_dong.gif';
	import mapWinDown from '@/assets/image/down.png';
	import { mapState } from 'vuex';
	import riverLine from '@/mock/riverLine';

    let map;
    const mapAreaName = "天津市西青区";
    const mapCenterPoint = {
		lng: 117.16331968147409,
		lat: 39.017172739051034,
	};
	const mapLevel = 12;

    export default {
        data() {
            return {
                
            }
		},
		computed: {
			...mapState('page3', ['riverTree'])
		},
        mounted () {
			this.bmap_init();
		},
		beforeDestroy () {
			this.$bus.$off('stationChange_page3');
		},
        methods: {
			
            // 地图相关
            bmap_init() {
				map = new BMap.Map("bmap");
				map.centerAndZoom(new BMap.Point(mapCenterPoint.lng, mapCenterPoint.lat), mapLevel);
				map.enableScrollWheelZoom();
				window.addEventListener('resize', debounce(() => {
					map.setViewport();
				}));
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
					this.bmap_drawLine(map);
				});
			},
			bmap_addMarker(map) {
				this.riverTree.forEach((v, k) => {
					var mapImageOffset = new BMap.Size(-28, -56);
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
					
					// marker.addEventListener("mouseover", () => {
					// 	var iw = this.createInfoWindow_shui(v);
					// 	marker.openInfoWindow(iw);
					// });
				});
				setTimeout(() => {
					// 监听左边组件的站点切换
					const pointerList = document.querySelectorAll(".BMap_Marker[unselectable=on]>div");
					for(let i=0; i<pointerList.length; i++){
						pointerList[i].style.borderRadius = "50%";
						pointerList[i].style.transform = "scale(0.75)";
						pointerList[i].style.webkitTransform = "scale(0.75)";
					}
					pointerList[0].classList.add("mapicon_zoom");
					pointerList[0].firstChild.src = "";
					pointerList[0].style.backgroundColor = "#0172AC";
					pointerList[0].style.boxShadow = "0px 0px 2px 4px #0172AC";
					pointerList[0].style.width = "14px";
					pointerList[0].style.height = "14px";

					this.$bus.$on('stationChange_page3', ({index}) => {
						for(let i=0; i<pointerList.length; i++){
							console.log()
							pointerList[i].classList.remove("mapicon_zoom");
							pointerList[i].firstChild.src = mapIconDong;
							pointerList[i].style.backgroundColor = "none";
							pointerList[i].style.boxShadow = "none";
							pointerList[i].style.width = "28px";
							pointerList[i].style.height = "28px";
						}
						pointerList[index].classList.add("mapicon_zoom");
						pointerList[index].firstChild.src = "";
						pointerList[index].style.backgroundColor = "#0172AC";
						pointerList[index].style.boxShadow = "0px 0px 2px 4px #0172AC";
						pointerList[index].style.width = "14px";
						pointerList[index].style.height = "14px";
					});
				}, 20);
			},
			bmap_drawLine(map) {
				for(let key in riverLine){
					this.fnDrawLine(riverLine[key].points, riverLine[key].width, map);
				}
			},
			createInfoWindow_shui(v) {
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
				const html = `<div>
							  	${json.name}
							  </div>`;
				const iw = new BMap.InfoWindow(html, opts);
				return iw;
			},
			// 河流
			fnDrawLine(points, width, map) {
				var linePoints=points;
				var lineArr=[];
				for (var k = 0; k < linePoints.length; k++) {
					lineArr.push({
						lng: linePoints[k].lng,
						lat: linePoints[k].lat
					});
				}
				// 生成坐标点
				var trackPoint = [];
				for (var i = 0, j = lineArr.length; i < j; i++) {
					trackPoint.push(new BMap.Point(lineArr[i].lng, lineArr[i].lat));
				}
				// 画线
				var polyline = new BMap.Polyline(trackPoint, {
					strokeColor: "#62A5FC",
					strokeWeight: width,
					strokeOpacity: 1
				});
				polyline.name='river_line';
				map.addOverlay(polyline);
			},
        },
    }
</script>

<style lang="scss">
@keyframes mapiconZoom {
	0%   {
		transform: scale(0.75);
		opacity: 0.5;
	}
	50% {
		transform: scale(1.25);
		opacity: 1;
	}
	100% {
		transform: scale(0.75);
		opacity: 0.5;
	}
}
@-webkit-keyframes mapiconZoom {
	0%   {
		-webkit-transform: scale(0.75);
		opacity: 0.5;
	}
	50% {
		-webkit-transform: scale(1.25);
		opacity: 1;
	}
	100% {
		-webkit-transform: scale(0.75);
		opacity: 0.5;
	}
}
.mapicon_zoom{
	animation: mapiconZoom 1.66s linear infinite forwards;
	-webkit-animation: mapiconZoom 1.66s linear infinite forwards;
}

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