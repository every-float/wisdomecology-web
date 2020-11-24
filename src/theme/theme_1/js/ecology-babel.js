"use strict";

(function() {
	var jsonUrl = window.profiles.jsonUrl;
	var baseUrl = window.profiles.baseUrl;
	var baseUrl_falsedata = window.pageUrl + 'theme/theme_1/json/';
	var map;
	var mapAreaName = "天津市西青区";
	// 117.16331968147409,39.017172739051034
	var mapCenterPoint = {
		// lng: 117.17268123536583,
		// lat: 38.93524648479791,
		lng: 117.16331968147409,
		lat: 39.017172739051034,
	};
	var mapLevel = 12;
	var mapStyleJsonUrl = "./json/bmap/mapStyleJson.json";
	var mapPointsUrl = "./json/bmap/mapPoints.json";
	var mapIcon = "./images/mappoint_32.png";
	var permissionButtons = [{
		id: 'c616b74328504b6085ac923c1e117755',
		btnName: "大气环境监测",
		btnBg: "./images/btn_pure_1.png",
		left: "0.2rem"
	}, {
		id: '9c48aa0ce0bb44b8b281773c7520d2ac',
		btnName: "水环境监测",
		btnBg: "./images/btn_pure_2.png",
		left: "1.8rem"
	}, {
		id: '585196faa64043939c13ca8f38215073',
		btnName: "土壤与固废管理",
		btnBg: "./images/btn_pure_3.png",
		left: "3.4rem"
	}, {
		id: '26a6c508b37d465f910800d4e73f93d8',
		btnName: "重点污染源管理",
		btnBg: "./images/btn_pure_4.png",
		right: "3.4rem"
	}, {
		id: '5b02a3d741324a00b5bdb5d9e7b118c9',
		btnName: "工况用电监控",
		btnBg: "./images/btn_pure_5.png",
		right: "1.8rem"
	}, {
		id: 'a57c1882826943c3b845b5b98eabe5c9',
		btnName: "环境督察执法",
		btnBg: "./images/btn_pure_6.png",
		right: "0.2rem"
	}, {
		id: 'e1f1e7bb0d974d3eac60447dc4262354',
		btnName: "设置",
		btnBg: "",
		right: ""
	}];
	var PermissionButton = {
		// props: ['menuid','menuurl'],
		props:{
			omenu: {
				type: Object
			},
		},
		methods: {
			btnMouseOver: function btnMouseOver(e) {
				this.$emit('btn-mouseover', e);
			},
			btnMouseMove: function btnMouseMove(e) {
				this.$emit('btn-mousemove', e);
			},
			btnMouseOut: function btnMouseOut(e) {
				this.$emit('btn-mouseout', e);
			}
		},
		render: function render(h) {
			var ohref = '';
			if(this.omenu.menuId === '5b02a3d741324a00b5bdb5d9e7b118c9'){
				ohref = this.omenu.menuUrl
			}else{
				ohref = window.pageUrl + 'views/index2.html?menuId=' + this.omenu.menuId + '&menuName=' + this.omenu.menuName
			}
			var propertyObj = {
				'class': this.omenu.menuId ? 'permission-btn-a' : 'permission-btn-b',
				attrs: {
					'href': this.omenu.menuId ? ohref : 'javascript:void(0);',
					target: '_self'
				},
				on: {
					mouseover: this.btnMouseOver,
					mousemove: this.btnMouseMove,
					mouseout: this.btnMouseOut
				}
			};
			var children = this.$slots.default;
			return h('a', propertyObj, children);
		}
	};
	var airIndexs = [
		{
			code: "aqi",
			text: "AQI"
		},{
			code: "pm2_5",
			text: "PM2.5"
		},{
			code: "pm10",
			text: "PM10"
		},{
			code: "so2",
			text: "SO<sub>2</sub>"
		},{
			code: "no2",
			text: "NO<sub>2</sub>"
		},{
			code: "o3",
			text: "O<sub>3</sub>"
		},{
			code: "co",
			text: "CO"
		},
	];
	var ajaxUrlList = {
		// 菜单按钮区块
		URL_getOneMenuList: baseUrl + 'index/getOneMenuList',				//权限接口
		URL_user_info: baseUrl + 'index/getUserInfo',						//获取用户信息
		// 左上区块
		URL_shizhan: jsonUrl + 'shizhan/shizhan.json',					//左上区块的右边——空气质量接口——取辛老路数据（市站）
		// 左中区块
		URL_dmkhsjColumnchart: baseUrl + 'we/river/getHomeStatInfo',		//断面考核数据柱状图接口
		// URL_dmkhsjTable: baseUrl_falsedata + 'dmkhsjTable.json',					//断面考核数据表格接口
		// 左下区块
		URL_gftzhdtgl_1: baseUrl_falsedata + 'gftzhdtgl_1.json',					//固废态综合动态管理 1 接口
		URL_gftzhdtgl_2: baseUrl_falsedata + 'gftzhdtgl_2.json',					//固废态综合动态管理 2 接口
		URL_gftzhdtgl_3: baseUrl_falsedata + 'gftzhdtgl_3.json',					//固废态综合动态管理 3 接口
		// 右上区块
		URL_ranking_1: jsonUrl + 'quyu/quyu.json',							//区域考核排名统计 1 接口
		URL_xiangzhen: jsonUrl + 'xiangzhen/xiangzhen.json',				//区域考核排名统计 2 接口（乡镇、街道）
		URL_weizhan: jsonUrl + 'weizhan/weizhan.json',					//区域考核排名统计 3 接口（微站）
		// 右下区块
		URL_zdqywryglTable: baseUrl + 'sop/getPageList',				//重点企业污染源管理接口
		// 其他
		URL_zhoubian: baseUrl_falsedata + 'zhoubian/zhoubian.json',					//周边接口（暂无用场）
		URL_keliwu: baseUrl_falsedata + 'keliwu/keliwu.json',						//颗粒物接口（暂无用场）	
	};
	
	var numberOfInterfacesCurrentlyInUse = 11;	//增加或删减实际调用的接口时这个值需要改变
	
	Vue.component('permission-button', PermissionButton);
	
	new Vue({
		data: {
			isWideScreen: true, //为了超级窄屏设置，其他情况概不考虑
			userInfo: {},	//用户信息
			permissionButtons: permissionButtons,	//权限按钮
			airQualityData: {},	//空气质量
			dmkhsjColumnchart: {},	//断面考核数据柱状图接口
			currTarget: 'cod',
			left_3_1_index: 0,
			dmkhsjTable: [],	//断面考核数据表格接口
			gftzhdtgl_1: [],	//固废态综合动态管理——1
			gftzhdtgl_2: [],	//固废态综合动态管理——2
			gftzhdtgl_3: [],	//固废态综合动态管理——3
			airIndexs: airIndexs,	//空气污染物列表
			pollutant: 'aqi',	//当前污染物类型
			right_2_index: 0,
			rightU2Timer: null,
			rankingData1: {},	//区域考核排名统计——1
			rankingData2: {},	//区域考核排名统计——2
			rankingData3: {},	//区域考核排名统计——3
			orderType1: 0,	//0代表正序，1代表倒序
			orderType2: 0,	//0代表正序，1代表倒序
			orderType3: 0,	//0代表正序，1代表倒序
			zdqywryglTable: [],	//重点企业污染源管理接口
			weatherData: {},	//天气数据
			currRealDate: '',	//实时年月日
			currRealTime: '',	//实时时分秒
			currWeek: '',		//实时星期
			tipIsShow: false,	//按钮吸附效果显示状态
			hoverPermissionButtonName: '',	//按钮吸附效果上的文字
			isWideScreenForSwitch: false, 	//宽窄屏状态
			completedInterfacesNum: 0,		//后端接口请求完成个数
			marker_list: []		// 地图标点数据
		},
		beforeCreate: function beforeCreate() {
			layer.load(1, {shade: 1, time: 10 * 1000});
		},
		created: function created() {
			// http请求数据（异步的）
			if (!$.cookie('login_sid_t_we')) {
				layer.closeAll('loading');
			} else {
				// 这里每增加一个异步方法，就要给numberOfInterfacesCurrentlyInUse加1
				this.getUserInfo();
				this.getMenuList();
				this.getLeft2_airquality();
				this.getLeft3_1();
				// this.getLeft3_2();
				this.getLeft4_1();
				this.getLeft4_2();
				this.getLeft4_3();
				this.getRight2_1();
				this.getRight2_2();
				this.getRight2_3();
				this.getRight3_table();
			}
		},
		mounted: function mounted() {
			// dom挂载完毕，立即初始化与异步数据无依赖关系的dom数据
			
			// 头部标题背景图根据屏幕情况展示不同
			this.headerBackgroundRender();
			// 初始化百度地图
			this.bmap_init();
			// 初始化日期时间
			this.getCurrRealTime();
			// 计算浏览器窗口宽高比，计算isWideScreen
			this.getIsWideScreen();
			this.listenWindowResizeF11();
			this.getWeatherData();
			this.initImgSwiper();
		},
		watch: {
			currRealTime: {
				immediate: true,
				handler: function handler() {
					this.currRealDate = this.writeCurrentDate();
					this.currWeek = this.getCurrWeek();
				}
			},
			// 监听宽窄屏切换(全屏之外不考虑)
			isWideScreenForSwitch: function(newVal, oldVal) {
				var shouldHeight;
				if (newVal) {
					// 宽屏 isWideScreenForSwitch = true
					$("#app").css({
						"position": "absolute",
						"top": "50%",
						"left": "0px",
						"width": "100%",
					})
					shouldHeight = window.innerWidth * 1080 / 3086;
					$("#app").height(shouldHeight);
					$("#app").css({
						"margin-top": -(shouldHeight / 2) + 'px'
					});
					for (var i = 0; i < $(".cus_block").length; i++) {
						$(".cus_block").get(i).style.width = "5.88rem";
					}
					for (var i = 0; i < $(".cus_block_2").length; i++) {
						$(".cus_block_2").get(i).style.width = "5.3rem";
					}
					for (var i = 0; i < $("p").length; i++) {
						$("p").get(i).style.marginBottom = "0.01rem";
					}
					$(".center_1").css("left", "6.3rem");
					$(".center_2").css("right", "6.3rem");
					document.documentElement.style.fontSize = shouldHeight / 1080 * 100 + 'px';
					// map.setZoom(11);
					this.pageReload();
				} 
				else {
					// 窄屏 isWideScreenForSwitch = false
					$("#app").css({
						"position": "absolute",
						"top": "0",
						"left": "0px",
						"width": "100%",
						"height": "100%",
						"margin-top": '0px'
					})
					for (var i = 0; i < $(".cus_block").length; i++) {
						$(".cus_block").get(i).style.width = "4.6rem";
					}
					for (var i = 0; i < $(".cus_block_2").length; i++) {
						$(".cus_block_2").get(i).style.width = "4.3rem";
					}
					for (var i = 0; i < $("p").length; i++) {
						$("p").get(i).style.marginBottom = "0.07rem";
					}
					$(".center_1").css("left", "5.08rem");
					$(".center_2").css("right", "5.08rem");
					document.documentElement.style.fontSize = window.innerHeight / 1080 * 100 + 'px';
					// map.setZoom(12);
					this.pageReload();
				}
			},
			// 监听currTarget改变
			currTarget: function(newVal, oldVal){
				this.currTargetChange();
			},
			// 监听pollutant改变
			pollutant: function(newVal, oldVal){
				this.orderAndRender();
			},
			// 监听考核排名的第1个正倒序切换
			orderType1: function(newVal, oldVal){
				this.singleOrderAndRender(1);
			},
			// 监听考核排名的第2个正倒序切换
			orderType2: function(newVal, oldVal){
				this.singleOrderAndRender(2);
			},
			// 监听考核排名的第3个正倒序切换
			orderType3: function(newVal, oldVal){
				this.singleOrderAndRender(3);
			},
			// 监听接口是否全部请求完成
			completedInterfacesNum: function(newVal, oldVal){
				var _this = this;
				if(newVal === numberOfInterfacesCurrentlyInUse){
					layer.closeAll('loading');
					this.$nextTick(function() {
						/**
						 * 写异步数据请求完成且页面渲染完成后需要的逻辑
						 */
						_this.rightBottomSeamlessScroll();
						_this.leftU3U1AutoSwitch();
						_this.rightU2AutoSwitch();
					});
				}
			}
		},
		methods: {
			// 头部标题根据屏幕情况展示不同的背景图
			headerBackgroundRender: function(){
				if(window.screen.height - window.innerHeight < 2){
					$(".header").css("background-image", "url(./images/bigtitle_v1.png)");
				} else {
					$(".header").css("background-image", "url(./images/bigtitle_v2.png)");
				}
			},
			// 获取天气数据
			getWeatherData: function(){
				var _this = this;
				$.ajax({
					type: 'get',
					// url: 'http://api.map.baidu.com/telematics/v3/weather?location='+encodeURIComponent("西青")+'&output=json&ak=w6lujDXFTAc3oAKsKNDBcP4l',
					url: 'https://wis.qq.com/weather/common',
					data: {
						source: 'pc',
						weather_type: 'observe',
						// weather_type: 'forecast_1h|forecast_24h',
						province: '天津',
						city: '天津',
						county: '西青'
					},
					dataType: 'jsonp',
					success: function(res) {
						_this.weatherData = res.data.observe;
						var windMap = {
							"0": "无持续风向",
							"1": "东北风",
							"2": "东风",
							"3": "东南风",
							"4": "南风",
							"5": "西南风",
							"6": "西风",
							"7": "西北风",
							"8": "北风",
							"9": "旋转风"
						};
						_this.weatherData.wind_direction = windMap[_this.weatherData.wind_direction];
					}
				});
			},
			// swiper的初始化
			initImgSwiper: function(){
				var _this = this;
				var swiper = new Swiper('.left_4 .swiper-container', {
					loop: false,
					autoplay:{
						delay: 2400,
						stopOnLastSlide: false,
						disableOnInteraction: false, //用户操作不打断
					},
					pagination :{
						el: '.swiper-pagination',
						clickable :true,
					}
				});
			},
			// 界面响应式重载
			pageReload: function() {
				map.setViewport();
				this.myChartRender("left_3_1", left_3_1);
				this.myChartRender("right_2_1", right_2_1);
				this.myChartRender("right_2_2", right_2_2);
				this.myChartRender("right_2_3", right_2_3);
				// this.initImgSwiper();
				this.myChartRender("left_4_1", left_4_1);
				this.myChartRender("left_4_2", left_4_2);
				this.myChartRender("left_4_3", left_4_3);
			},			
			// 获取用户信息
			getUserInfo: function() {
				var _this = this;
				$.ajax({
					type: 'post',
					url: ajaxUrlList.URL_user_info,
					dataType: 'json',
					success: function(res) {
						if (res.code == 0) {
							_this.userInfo = res.data;
							window.localStorage.setItem("userInfo", JSON.stringify(res.data));
						} else {
							layer.msg(res.msg);
						}
					},
					error: function(err) {
						layer.msg("网络访问出错！");
					},
					complete: function() {
						_this.completedInterfacesNum++;
						console.log(_this.completedInterfacesNum);
					}
				});
			},
			// 权限ajax
			getMenuList: function(){
				var _this = this;
				$.ajax({
					url: ajaxUrlList.URL_getOneMenuList,
					headers: {
						"authorization": 'Bearer ' + $.cookie('login_sid_t_we')
					},
					data: {},
					type: "post",
					dataType: "json",
					success: function success(res) {
						if (res.code == 0) {
							var menus = res.data.menujson.menus;
							_this.permissionButtons.forEach(function(v, k) {
								var related = menus.filter(function(val) {
									return val.id === v.id;
								});
								var val = related.length > 0 ? related[0].id : undefined;
								var url = related.length > 0 ? related[0].menuUrl : undefined;
								var name = related.length > 0 ? related[0].name : '';
								_this.$set(v, 'menuId', val);
								_this.$set(v, 'menuUrl', url);
								_this.$set(v, 'menuName', name);
							});
							console.log(_this.permissionButtons);
							// $nextTick解决dom渲染依赖异步数据问题
							_this.$nextTick(function() {
								// 这里写 页面首次加载异步数据请求到且相应dom更新之后的逻辑
								_this.changeAppearanceOfNoauthority();
							});
						} else {
							layer.alert(res.msg, {icon: 5});
							_this.changeAppearanceOfNoauthority();
						}
					},
					complete: function complete() {
						_this.completedInterfacesNum++;
						console.log(_this.completedInterfacesNum);
					}
				});
			},
			// 左上——空气质量信息
			getLeft2_airquality: function(){
				var _this = this;
				$.ajax({
					url: ajaxUrlList.URL_shizhan,
					data: {},
					type: "get",
					dataType: "json",
					success: function(res){
						if(res.code == 0){
							_this.airQualityData = res.data.filter(function(v){
								return v.pointId === '4e4860553999471883954ecde87d540c';	//取的辛老路数据
							})[0];
							var arr = ['aqi', 'pm2_5', 'pm10', 'so2', 'no2', 'co', 'o3'];
							arr.forEach(function(v){
								_this.airQualityData[v] = fnMarkerMore(v, _this.airQualityData[v]);
							});
							// console.log(_this.airQualityData);
						}else{
							layer.msg(res.msg);
						}
					},
					complete: function(){
						_this.completedInterfacesNum++;
						console.log(_this.completedInterfacesNum);
					}
				});
			},
			// 左中——断面考核数据柱状图
			getLeft3_1: function(){
				var _this = this;
				$.ajax({
					url: ajaxUrlList.URL_dmkhsjColumnchart,
					data: {},
					type: "get",
					dataType: "json",
					success: function(res){
						if(res.code == 0){
							_this.dmkhsjColumnchart = res.data;
							_this.$set(_this.dmkhsjColumnchart, 'legendObj', _this.dmkhsjColumnchart.legend.map(function(v){
								return {
									code: v,
									text: (function(){
										switch (v){
											case 'cod':
												return 'COD'
												break;
											case 'andan':
												return '氨氮'
												break;
											case 'zonglin':
												return '总磷'
												break;
											case 'zongdan':
												return '总氮'
												break;
											case 'gaomengsuanyan':
												return '高锰酸盐'
												break;
											case 'shuiwen':
												return '水温'
												break;
											case 'ph':
												return 'PH'
												break;
											case 'rongjieyang':
												return '溶解氧'
												break;
											case 'zhuodu':
												return '浊度'
												break;
											case 'diandaolv':
												return '电导率'
												break;
											default:
												break;
										}
									})()
								}
							}));
							var x = [];
							var y = [];
							_this.dmkhsjColumnchart.xaxis.forEach(function(v){
								x.push(v);
							})
							y = _this.dmkhsjColumnchart.series.filter(function(v){
								return v.name === _this.currTarget
							})[0].data;
							left_3_1.xAxis[0].data = x;
							left_3_1.series[0].data = y;
							_this.myChartRender("left_3_1", left_3_1);
						}else{
							layer.msg(res.msg);
						}
					},
					complete: function(){
						_this.completedInterfacesNum++;
						// console.log(_this.completedInterfacesNum);
					}
				});
			},
			// 左中——断面考核数据表格
			getLeft3_2: function(){
				var _this = this;
				$.ajax({
					url: ajaxUrlList.URL_dmkhsjTable,
					data: {},
					type: "get",
					dataType: "json",
					success: function(res){
						if(res.code == 0){
							_this.dmkhsjTable = res.data;
						}else{
							layer.msg(res.msg);
						}
					},
					complete: function(){
						_this.completedInterfacesNum++;
						console.log(_this.completedInterfacesNum);
					}
				});
			},
			//左下——固废态综合动态管理 
			getLeft4_1: function(){
				var _this = this;
				$.ajax({
					url: ajaxUrlList.URL_gftzhdtgl_1,
					data: {},
					type: "get",
					dataType: "json",
					success: function(res){
						if(res.code == 0){
							_this.gftzhdtgl_1 = res.data;
							_this.left_4_chartRender("gftzhdtgl_1", "left_4_1");
						}else{
							layer.msg(res.msg);
						}
					},
					complete: function(){
						_this.completedInterfacesNum++;
						console.log(_this.completedInterfacesNum);
					}
				});
			},
			getLeft4_2: function(){
				var _this = this;
				$.ajax({
					url: ajaxUrlList.URL_gftzhdtgl_2,
					data: {},
					type: "get",
					dataType: "json",
					success: function(res){
						if(res.code == 0){
							_this.gftzhdtgl_2 = res.data;
							_this.left_4_chartRender("gftzhdtgl_2", "left_4_2");
						}else{
							layer.msg(res.msg);
						}
					},
					complete: function(){
						_this.completedInterfacesNum++;
						console.log(_this.completedInterfacesNum);
					}
				});
			},
			getLeft4_3: function(){
				var _this = this;
				$.ajax({
					url: ajaxUrlList.URL_gftzhdtgl_3,
					data: {},
					type: "get",
					dataType: "json",
					success: function(res){
						if(res.code == 0){
							_this.gftzhdtgl_3 = res.data;
							_this.left_4_chartRender("gftzhdtgl_3", "left_4_3");
						}else{
							layer.msg(res.msg);
						}
					},
					complete: function(){
						_this.completedInterfacesNum++;
						console.log(_this.completedInterfacesNum);
					}
				});
			},
			left_4_chartRender: function(dt,id){
				var x = [];
				var y = [];
				this[dt].forEach(function(v){
					x.push(v.x);
					y.push(v.y);
				})
				window[id].xAxis[0].data = x;
				window[id].series[0].data = y;
				this.myChartRender(id, window[id]);
			},
			
			// 右上——区域考核排名统计
			getRight2_1: function(){
				var _this = this;
				$.ajax({
					url: ajaxUrlList.URL_ranking_1,
					data: {},
					type: "get",
					dataType: "json",
					success: function(res){
						if(res.code == 0){
							_this.rankingData1 = res.data;
							// 页面初始化加载默认是 aqi正序
							_this.right_2_chartRender("rankingData1", "right_2_1", "orderType1", "aqi");
						}else{
							layer.msg(res.msg);
						}
					},
					complete: function(){
						_this.completedInterfacesNum++;
						console.log(_this.completedInterfacesNum);
					}
				});
			},
			getRight2_2: function(){
				var _this = this;
				$.ajax({
					url: ajaxUrlList.URL_xiangzhen,
					data: {},
					type: "get",
					dataType: "json",
					success: function(res){
						if(res.code == 0){
							_this.rankingData2 = res.data;
							// 页面初始化加载默认是 aqi正序
							_this.right_2_chartRender("rankingData2", "right_2_2", "orderType2", "aqi");
						}else{
							layer.msg(res.msg);
						}
					},
					complete: function(){
						_this.completedInterfacesNum++;
						console.log(_this.completedInterfacesNum);
					}
				});
			},
			getRight2_3: function(){
				var _this = this;
				$.ajax({
					url: ajaxUrlList.URL_weizhan,
					data: {},
					type: "get",
					dataType: "json",
					success: function(res){
						if(res.code == 0){
							_this.rankingData3 = res.data;
							// 页面初始化加载默认是 aqi正序
							_this.right_2_chartRender("rankingData3", "right_2_3", "orderType3", "aqi");
						}else{
							layer.msg(res.msg);
						}
					},
					complete: function(){
						_this.completedInterfacesNum++;
						console.log(_this.completedInterfacesNum);
					}
				});
			},
			right_2_chartRender: function(dt, id, ot, type){
				var _this = this;
				var x=[];
				var y=[];
				this[dt].sort(function(o1, o2){return _this[ot] ? o1[type]-o2[type] : o2[type]-o1[type]}).forEach(function(v, k){
					if(dt !== "rankingData1"){
						if(k < 10){
							x.push(v.pointName);
							y.push(v[type]);
						}
					}else{
						x.push(v.pointName);
						y.push(v[type]);
					}
				})
				window[id].xAxis[0].data = x;
				window[id].series[0].data = y;
				window[id].series[0].itemStyle.normal.color = function(params){
					var colors = getColorArr(type, y);
					return colors[params.dataIndex]
				}
				this.myChartRender(id, window[id]);
			},
			// 右下——重点企业污染源管理
			getRight3_table: function(){
				var _this = this;
				$.ajax({
					url: ajaxUrlList.URL_zdqywryglTable,
					data: {},
					type: "get",
					dataType: "json",
					success: function(res){
						if(res.code == 0){
							_this.zdqywryglTable = res.data;
						}else{
							layer.msg(res.msg);
						}
					},
					complete: function(){
						_this.completedInterfacesNum++;
						console.log(_this.completedInterfacesNum);
					}
				});
			},
			/**
			 * 区域考核排名统计——切换相关
			 */
			changePollutant: function(poll, index){
				this.pollutant = poll;
				this.right_2_index = index;
			},
			orderAndRender: function(){
				this.right_2_chartRender("rankingData1", "right_2_1", "orderType1", this.pollutant);
				this.right_2_chartRender("rankingData2", "right_2_2", "orderType2", this.pollutant);
				this.right_2_chartRender("rankingData3", "right_2_3", "orderType3", this.pollutant);
				this.right_2_chartRender("rankingData1", "right_2_1_layer", "orderType1", this.pollutant);
				this.right_2_chartRender("rankingData2", "right_2_2_layer", "orderType2", this.pollutant);
				this.right_2_chartRender("rankingData3", "right_2_3_layer", "orderType3", this.pollutant);
			},
			changeOrderType: function(e, n){
				if(e.target.parentNode.classList.contains("right_2_1") || e.target.parentNode.classList.contains("right_2_1_layer"))
					this.orderType1 = n;
				if(e.target.parentNode.classList.contains("right_2_2") || e.target.parentNode.classList.contains("right_2_2_layer"))	
					this.orderType2 = n;
				if(e.target.parentNode.classList.contains("right_2_3") || e.target.parentNode.classList.contains("right_2_3_layer"))	
					this.orderType3 = n;
			},
			singleOrderAndRender: function(differ){
				this.right_2_chartRender("rankingData"+differ, "right_2_"+differ, "orderType"+differ, this.pollutant);
				this.right_2_chartRender("rankingData"+differ, "right_2_"+differ+"_layer", "orderType"+differ, this.pollutant);
			},
			/**
			 * 断面考核数据——切换
			 */ 
			changeTarget: function(code, index){
				this.currTarget = code;
				this.left_3_1_index = index;
			},
			currTargetChange: function(){
				var _this = this;
				var x = [];
				var y = [];
				this.dmkhsjColumnchart.xaxis.forEach(function(v){
					x.push(v);
				})
				y = this.dmkhsjColumnchart.series.filter(function(v){
					return v.name === _this.currTarget
				})[0].data;
				left_3_1.xAxis[0].data = x;
				left_3_1.series[0].data = y;
				left_3_1_layer.xAxis[0].data = x;
				left_3_1_layer.series[0].data = y;
				this.myChartRender("left_3_1", left_3_1);
				this.myChartRender("left_3_1_layer", left_3_1_layer);
			},
			
			/**
			 * 宽窄屏切换相关
			 */
			listenWindowResizeF11: function() {
				var _this = this;
				window.addEventListener('resize', function() {
					_this.headerBackgroundRender();
					_this.isWideScreenForSwitch = false;
					map.setViewport();
				})
			},
			switchScreenWideOrNarrow: function(e) {
				if(window.screen.height - window.innerHeight < 2){
					this.isWideScreenForSwitch = !this.isWideScreenForSwitch;
				} else {
					layer.tips("请在全屏模式下切换宽窄屏", e.target, {
						tips: [2, "#c00"]
					});
				}
			},

			/**
			 * 计算浏览器窗口宽高比，计算isWideScreen
			 */
			getIsWideScreen: function () {
				var _this = this;
				window.innerWidth / window.innerHeight > 1256 / 723 ? this.isWideScreen = true : this.isWideScreen = false;
				window.addEventListener('resize', function() {
					window.innerWidth / window.innerHeight > 1256 / 723 ? _this.isWideScreen = true : _this.isWideScreen = false;
				});
			},

			/**
			 * 地图相关
			 */
			bmap_init: function () {
				map = new BMap.Map("bmap");
				map.centerAndZoom(new BMap.Point(mapCenterPoint.lng, mapCenterPoint.lat), mapLevel);
				map.enableScrollWheelZoom();
				window.addEventListener('resize', function() {
					map.setViewport();
				});
				$.get(mapStyleJsonUrl, function(res) {
					map.setMapStyleV2({
						styleJson: res
					});
				});

				// map.addEventListener('click', function(e){
				// 	alert(e.point.lng + ", " + e.point.lat);
				// });

				// 画行政区线
				this.bmap_getBoundary(map);
			},
			bmap_getBoundary: function (map) {
				var _this = this;
				var bdary = new BMap.Boundary();
				bdary.get(mapAreaName, function(rs) {
					map.clearOverlays(); //清除地图覆盖物
					var count = rs.boundaries.length; //行政区域的点有多少个
					if (count === 0) {
						console.error('未能获取当前行政区域');
						return;
					}
					for (var i = 0; i < count; i++) {
						var polyline = new BMap.Polygon(rs.boundaries[i], {
							strokeWeight: 3,
							strokeColor: "#00F1F1",
							strokeOpacity: 1,
							fillOpacity: 0.1,
							fillColor: "#00F1F1"
						}); //建立多边形
						map.addOverlay(polyline); //添加多边形
						// map.setViewport(polyline.getPath());
					}
					_this.bmap_addMarker(map);
				});
			},
			bmap_addMarker: function (map) {
				var _this = this;
				this.$set(this.airQualityData, 'areaType', 'shizhan');
				if(JSON.stringify(this.rankingData2)!='{}'){
					// console.info(JSON.stringify(this.rankingData2));
					var xiangzhenArr = JSON.parse(JSON.stringify(this.rankingData2));
					var arr = ['aqi', 'pm2_5', 'pm10', 'so2', 'no2', 'co', 'o3'];
					xiangzhenArr.forEach(function(v1){
						_this.$set(v1, 'areaType', 'xiangzhen');
						arr.forEach(function(v2){
							v1[v2] = fnMarkerMore(v2, v1[v2]);
						});
					});
					this.marker_list = [this.airQualityData].concat(xiangzhenArr);
					// console.log(this.marker_list);
					this.marker_list.forEach(function(v, k) {
						var mapImageOffset;
						if(v.areaType === "shizhan"){
							mapImageOffset = new BMap.Size(-28*v['aqi']['icon_x'], -28);
						}else if(v.areaType === "xiangzhen"){
							mapImageOffset = new BMap.Size(-28*v['aqi']['icon_x'], -56);
						}
						var myIcon = new BMap.Icon("./images/icon_dong.gif",
							new BMap.Size(28, 28), {
								offset: new BMap.Size(0, 0),
								imageOffset: mapImageOffset
							}
						);
						var point = new BMap.Point(v.lng, v.lat);
						var marker = new BMap.Marker(point, {
							icon: myIcon
						});
						map.addOverlay(marker);
						marker.addEventListener("mouseover", function() {
							var iw = _this.createInfoWindow(v);
							this.openInfoWindow(iw);
						});
						marker.addEventListener("mouseout", function() {
							// this.closeInfoWindow();		//这里存在个问题，鼠标移出标记移到与之对应的信息框上也会关闭，待解决
						});
					});
				}

			},
			createInfoWindow: function(v){
				var json = v;
				var opts = {
					width: 0, // 信息窗口宽度
					height: 0, // 信息窗口高度
					enableMessage: true, //设置允许信息窗发送短息
					offset:{
						height:10,
						width:-13
					},
					message: ""
				}
				var html = "<div class=\"contentBox\" style=\"width:250px;\">\n\t\t\t  \t\t\t\t\t<h3 class=\"title_top\">" + json.pointName + "</h3>\n\t\t\t  \t\t\t\t\t<hr style=\"padding:0px;margin:5px 0px;height:1px solid #ccc;background:#34A6CB;\">\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<div class=\"layui-row layui-col-space5\">\n\t\t\t\t\t\t\t\t    <div class=\"layui-col-xs4 layui-col-sm4 layui-col-md4\">\n\t\t\t\t\t\t\t\t      <div class=\"api_item\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"api_title\" style=\"background:" + json.aqi.bgcolor + ";color:" + json.aqi.color + ";\">AQI</div>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"api_value\">\n\t\t\t\t\t\t\t\t\t\t\t\t" + json.aqi.value + "\n\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"layui-badge\" style=\"background:" + json.aqi.bgcolor + "!important;color:" + json.aqi.color + "!important;\">" + json.aqi.level + "</span>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t      </div>\n\t\t\t\t\t\t\t\t    </div>\n\t\t\t\t\t\t\t\t    <div class=\"layui-col-xs8 layui-col-sm8 layui-col-md8\">\n\t\t\t\t\t\t\t\t\t      <div class=\"layui-row layui-col-space5\">\n\t\t\t\t\t\t\t\t\t          <div class=\"layui-col-xs4 layui-col-sm4 layui-col-md4\">\n\t\t\t\t\t\t\t\t\t          \t<div class=\"win_item_box\">\n\t\t\t\t\t\t\t\t\t\t            <div class=\"win_title\" style=\"background:" + json.pm2_5.bgcolor + ";color:" + json.pm2_5.color + ";\">PM2.5</div>\n\t\t\t\t    \t\t\t\t\t\t\t\t<div class=\"win_value\">" + json.pm2_5.value + "</div>\n\t\t\t\t\t\t\t\t\t          \t</div>\n\t\t\t\t\t\t\t\t\t          </div>\n\t\t\t\t\t\t\t\t\t          <div class=\"layui-col-xs4 layui-col-sm4 layui-col-md4\">\n\t\t\t\t\t\t\t\t\t          \t<div class=\"win_item_box\">\n\t\t\t\t\t\t\t\t\t\t            <div class=\"win_title\" style=\"background:" + json.pm10.bgcolor + ";color:" + json.pm10.color + ";\">PM10</div>\n\t\t\t\t    \t\t\t\t\t\t\t\t<div class=\"win_value\">" + json.pm10.value + "</div>\n\t\t\t    \t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t          </div>\n\t\t\t\t\t\t\t\t\t          <div class=\"layui-col-xs4 layui-col-sm4 layui-col-md4\">\n\t\t\t\t\t\t\t\t\t\t        <div class=\"win_item_box\">\n\t\t\t\t\t\t\t\t\t\t            <div class=\"win_title\" style=\"background:" + json.o3.bgcolor + ";color:" + json.o3.color + ";\">O3</div>\n\t\t\t\t    \t\t\t\t\t\t\t\t<div class=\"win_value\">" + json.o3.value + "</div>\n\t\t\t\t    \t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t          </div>\n\t\t\t\t\t\t\t\t\t      </div>\n\t\t\t\t\t\t\t\t\t      <div class=\"layui-row layui-col-space10\">\n\t\t\t\t\t\t\t\t\t          <div class=\"layui-col-xs4 layui-col-sm4 layui-col-md4\">\n\t\t\t\t\t\t\t\t\t\t        <div class=\"win_item_box\">\n\t\t\t\t\t\t\t\t\t\t            <div class=\"win_title\" style=\"background:" + json.so2.bgcolor + ";color:" + json.so2.color + ";\">SO2</div>\n\t\t\t\t    \t\t\t\t\t\t\t\t<div class=\"win_value\">" + json.so2.value + "</div>\n\t\t\t\t    \t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t          </div>\n\t\t\t\t\t\t\t\t\t          <div class=\"layui-col-xs4 layui-col-sm4 layui-col-md4\">\n\t\t\t\t\t\t\t\t\t\t        <div class=\"win_item_box\">\n\t\t\t\t\t\t\t\t\t\t            <div class=\"win_title\" style=\"background:" + json.no2.bgcolor + ";color:" + json.no2.color + ";\">NO2</div>\n\t\t\t\t    \t\t\t\t\t\t\t\t<div class=\"win_value\">" + json.no2.value + "</div>\n\t\t\t\t    \t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t          </div>\n\t\t\t\t\t\t\t\t\t          <div class=\"layui-col-xs4 layui-col-sm4 layui-col-md4\">\n\t\t\t\t\t\t\t\t\t\t        <div class=\"win_item_box\">\n\t\t\t\t\t\t\t\t\t\t            <div class=\"win_title\" style=\"background:" + json.co.bgcolor + ";color:" + json.co.color + ";\">CO</div>\n\t\t\t\t    \t\t\t\t\t\t\t\t<div class=\"win_value\">" + json.co.value + "</div>\n\t\t\t\t    \t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t          </div>\n\t\t\t\t\t\t\t\t\t      </div>\n\t\t\t\t\t\t\t\t    </div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\n\t\t\t\n\t\t\t\n\t\t\t\t\t\t\t\t<h6 class=\"title_bottom\">\u66F4\u65B0\u4E8E\uFF1A" + json.time + "</h6>\n\t\t\t\t\t\t\t\t<div style=\"height:5px;\">\n\t\t\t\t\t\t\t\t\t<img src=\"./images/down.png\" />\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>";
				var iw = new BMap.InfoWindow(html, opts);
				return iw;
			},

			/**
			 * 时间相关
			 */
			getCurrRealTime: function getCurrRealTime() {
				this.currRealTime = this.getCurrentTime();
				var _this = this;
				setInterval(function() {
					_this.currRealTime = _this.getCurrentTime();
				}, 1000);
			},
			writeCurrentDate: function writeCurrentDate() {
				var now = new Date();
				var year = now.getFullYear();
				var month = now.getMonth();
				var date = now.getDate();
				month = month + 1;
				// if (month < 10) month = "0" + month;
				// if (date < 10) date = "0" + date;
				return year + "年" + month + "月" + date + "日";
			},
			getCurrentTime: function getCurrentTime() {
				var now = new Date();
				var hour = now.getHours();
				var minu = now.getMinutes();
				var sec = now.getSeconds();
				if (hour < 10) hour = "0" + hour;
				if (minu < 10) minu = "0" + minu;
				if (sec < 10) sec = "0" + sec;
				return hour + ":" + minu + ":" + sec;
			},
			getCurrWeek: function getCurrWeek() {
				var weekcCnArr = ["日", "一", "二", "三", "四", "五", "六"];
				var now = new Date();
				var week = now.getDay();
				return '星期' + weekcCnArr[week];
			},

			/**
			 * 吸附效果相关
			 */
			openMyTip: function openMyTip(e, btnname) {
				btnname = btnname || e.target.innerText;
				if (e.target.classList.contains("permission-btn-b")) {
					this.hoverPermissionButtonName = '无权限';
				} else if (e.target.classList.contains("permission-btn-a")) {
					this.hoverPermissionButtonName = btnname;
				}
				var btnTipTextTrim = trim(this.hoverPermissionButtonName);
				var btnTipWidth = btnTipTextTrim.length * 0.16 + 0.4;
				var htmlFontsize = parseInt(document.documentElement.style.fontSize);
				if (e.clientX + 20 + btnTipWidth * htmlFontsize > window.innerWidth) {
					this.$refs.btnTip.className = "permission-btn-tip permission-btn-tip-r";
					$(this.$refs.btnTip).attr("style", "right:" + (window.innerWidth - e.clientX + 20) + "px;")
				} else {
					this.$refs.btnTip.className = "permission-btn-tip permission-btn-tip-l";
					$(this.$refs.btnTip).attr("style", "left:" + (e.clientX + 20) + "px;")
				}
				var appTopAndWinboundryDis = $("#app").get(0).getBoundingClientRect().top;
				this.$refs.btnTip.style.top = e.clientY - appTopAndWinboundryDis + 20 + "px";
				this.$refs.btnTip.style.backgroundColor = e.target.classList.contains("permission-btn-b") ? "#BCBCBC" :
					"#E30A0D";
				this.$refs.btnTip.style.width = btnTipWidth + "rem";
				this.tipIsShow = true;
			},
			moveMyTip: function moveMyTip(e) {
				var btnTipTextTrim = trim(this.hoverPermissionButtonName);
				var btnTipWidth = btnTipTextTrim.length * 0.16 + 0.4;
				var htmlFontsize = parseInt(document.documentElement.style.fontSize);
				if (e.clientX + 20 + btnTipWidth * htmlFontsize > window.innerWidth) {
					this.$refs.btnTip.className = "permission-btn-tip permission-btn-tip-r";
					$(this.$refs.btnTip).attr("style", "right:" + (window.innerWidth - e.clientX + 20) + "px;")
				} else {
					this.$refs.btnTip.className = "permission-btn-tip permission-btn-tip-l";
					$(this.$refs.btnTip).attr("style", "left:" + (e.clientX + 20) + "px;")
				}
				var appTopAndWinboundryDis = $("#app").get(0).getBoundingClientRect().top;
				this.$refs.btnTip.style.top = e.clientY - appTopAndWinboundryDis + 20 + "px";
				this.$refs.btnTip.style.backgroundColor = e.target.classList.contains("permission-btn-b") ? "#BCBCBC" :
					"#E30A0D";
				this.$refs.btnTip.style.width = btnTipWidth + "rem";
			},
			closeMyTip: function closeMyTip(e) {
				this.tipIsShow = false;
				this.hoverPermissionButtonName = '';
			},

			/**
			 * 数据更新且dom也更新完成时，将无权限的按钮透明度改变以及去掉外层元素的btn_outer类名
			 */
			changeAppearanceOfNoauthority: function changeAppearanceOfNoauthority() {
				Array.prototype.slice.call($('.btn_basic_style > .permission-btn-b')).forEach(function(v) {
					v.parentNode.style.opacity = 0.6;
					v.parentNode.classList.remove("btn_outer");
				});
				Array.prototype.slice.call($(".cus_header_setting.permission-btn-b")).forEach(function(v){
					v.style.opacity = 0.6;
					v.classList.remove("btn_outer");
				})
				
			},

			/**
			 * echart图表渲染方法
			 */
			myChartRender: function(elId, option) {
				// left_3_1
				var myChart = echarts.init(document.getElementById(elId));
				myChart.setOption(option);
				myChart.resize();
				window.addEventListener("resize", function() {
					myChart.resize();
				});
			},
			
			/**
			 * 窗口放大
			 */
			enlarge_1: function(e) {
				var _this = this;
				layer.open({
				  type: 1,
				  title: "断面考核数据",
				  content: $('.content_1'),
				  area: ['80%', '8.5rem'],
				  shade: [0.9],
				  success: function(layero, index){
					 document.querySelector(".content_1").style.opacity = 1;
					 var x = [];
					 var y = [];
					 _this.dmkhsjColumnchart.xaxis.forEach(function(v){
					 	x.push(v);
					 })
					 y = _this.dmkhsjColumnchart.series.filter(function(v){
					 	return v.name === _this.currTarget
					 })[0].data;
					 left_3_1_layer.xAxis[0].data = x;
					 left_3_1_layer.series[0].data = y;
					 _this.myChartRender("left_3_1_layer", left_3_1_layer);
				  },
				  cancel: function(){
					 document.querySelector(".content_1").style.opacity = 0;
				  }
				});
			},
			enlarge_2: function(e) {
				var _this = this;
				layer.open({
				  type: 1,
				  title: "固废态综合动态管理",
				  content: $('.content_2'),
				  area: ['80%', '8.5rem'],
				  shade: [0.8],
				  success: function(layero, index){
					 document.querySelector(".content_2").style.opacity = 1;
					 _this.left_4_chartRender("gftzhdtgl_1", "left_4_1_layer");
					 _this.left_4_chartRender("gftzhdtgl_2", "left_4_2_layer");
					 _this.left_4_chartRender("gftzhdtgl_3", "left_4_3_layer");
				  },
				  cancel: function(){
					 document.querySelector(".content_2").style.opacity = 0;
				  }
				});
			},
			enlarge_3: function(e) {
				var _this = this;
				layer.open({
				  type: 1,
				  title: "区域考核排名统计",
				  content: $('.content_3'),
				  area: ['80%', '10.50rem'],
				  shade: [0.8],
				  success: function(layero, index){
					 document.querySelector(".content_3").style.opacity = 1;
					 _this.right_2_chartRender("rankingData1", "right_2_1_layer", "orderType1", _this.pollutant);
					 _this.right_2_chartRender("rankingData2", "right_2_2_layer", "orderType2", _this.pollutant);
					 _this.right_2_chartRender("rankingData3", "right_2_3_layer", "orderType3", _this.pollutant);
				  },
				  cancel: function(){
					 document.querySelector(".content_3").style.opacity = 0;
				  }
				});
			},
			enlarge_4: function(e) {
				var _this = this;
				layer.open({
				  type: 1,
				  title: "重点企业污染源管理",
				  content: $('.content_4'),
				  area: ['80%', '9.8rem'],
				  shade: [0.8],
				  success: function(layero, index){
					 document.querySelector(".content_4").style.opacity = 1;
				  },
				  cancel: function(){
					 document.querySelector(".content_4").style.opacity = 0;
				  }
				});
			},
			enlarge_5: function(e) {
				var _this = this;
				layer.open({
				  type: 1,
				  title: false,
				  // title: "互动值访",
				  content: $('.content_5'),
				  area: ['5.85rem', '10.40rem'],
				  shade: 0,
				  moveOut: true,
				  move: '.video-grid',
				  success: function(layero, index){
					 document.querySelector("#cus_interact_zoom").style.display = "none";
				  },
				  cancel: function(){
					 document.querySelector("#cus_interact_zoom").style.display = "block";
				  }
				});
			},
			
			// 结束语音/视频
			endVideo: function(){
				layer.closeAll('page');
				document.querySelector("#cus_interact_zoom").style.display = "block";
			},
			// 重点企业污染源管理列表无缝滚动
			rightBottomSeamlessScroll: function(){
				$('#g').rollNoInterval().top();
				var grolllisttrs = $("#g .roll__list .cus_table_tr");
				for(var i=0; i<grolllisttrs.length; i++){
					if(grolllisttrs[i].classList[1].split('-')[1] % 2){
						grolllisttrs[i].style.backgroundColor = "#011E3E";
					}else{
						grolllisttrs[i].style.backgroundColor = "#033F7D";
					}
				}
			},
			// 断面考核数据自动切换
			leftU3U1AutoSwitch: function(){
				var _this = this;
				var left3tags = $(".cus_block.left_3 .content .cus_dmkh_tabitem");
				setInterval(function(){
					_this.left_3_1_index++;
					if(_this.left_3_1_index > left3tags.length-1){
						_this.left_3_1_index = 0;
					}
					left3tags.eq(_this.left_3_1_index).click();
				}, 5000);
			},
			// 区域考核排名统计自动切换
			rightU2AutoSwitch: function(){
				var _this = this;
				var right2tags = $(".cus_block.right_2 .content .right_2_tab .right_2_tab_item");
				this.rightU2Timer = setInterval(function(){
					_this.right_2_index++;
					if(_this.right_2_index > right2tags.length-1){
						_this.right_2_index = 0;
					}
					right2tags.eq(_this.right_2_index).click();
				}, 3000);
			},
			// 区域考核排名统计关闭自动切换
			stopSwitch: function(){
				clearInterval(this.rightU2Timer);
			},
			/**
			 * 未完待续~
			 */
			
		}
	}).$mount("#main");
})();
