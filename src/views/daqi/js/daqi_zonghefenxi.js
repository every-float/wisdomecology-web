var myDis;
function fnZoomPlus(){
	myDis.close();  //关闭鼠标测距
	map.setZoom(map.getZoom() + 1);
}

function fnZoomMinus(){
	myDis.close();  //关闭鼠标测距
	map.setZoom(map.getZoom() - 1);
}

var fnDistanceTool_open=function(){
	try{
        drawingManager.close();
    }catch(error){

    }
	
	vm.drawingCircle=false;
	vm.dis=!vm.dis;
	if(vm.dis){
		myDis.open();  //开启鼠标测距
	}else{
		myDis.close();
	}
}

var fnDistanceTool_close=function(){
	myDis.close();  //关闭鼠标测距
}


function fnDrawingCircle() {
	vm.circleConfig={
		lng:'',
		lat:'',
		banjing:0
	};
	vm.drawingCircle=!vm.drawingCircle;
	vm.dis=false;
	myDis.close();  //关闭鼠标测距

	if(vm.drawingCircle){
		var styleOptions = {
		    strokeColor: "#0085ff", //边线颜色。
		    fillColor: "#0056b6", //填充颜色。当参数为空时，圆形将没有填充效果。
		    strokeWeight: 2, //边线的宽度，以像素为单位。
		    strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
		    fillOpacity: 0.5, //填充的透明度，取值范围0 - 1。
		    strokeStyle: 'solid' //边线的样式，solid或dashed。
		}

		//实例化鼠标绘制工具
		drawingManager = new BMapLib.DrawingManager(map, {
		    isOpen: false, //是否开启绘制模式
		    //enableDrawingTool: true, //是否显示工具栏
		    drawingToolOptions: {
		        anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
		        offset: new BMap.Size(5, 5), //偏离值
		    },
		    circleOptions: styleOptions, //圆的样式
		    polylineOptions: styleOptions, //线的样式
		    polygonOptions: styleOptions, //多边形的样式
		    rectangleOptions: styleOptions //矩形的样式
		});

		drawingManager.open();
		drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);


		if('实时显示半径'){
			var label=null;
			var polyline=null;
			map.addEventListener("mousemove", function () {
	            if(drawingManager._mask!=null){
	                drawingManager._mask.addEventListener('mousedown',showCirle);
	                map.removeEventListener("mousemove", showCirle);
	            }
	        });
			var centerPoint=null;//圆心
	        var showCirle=function(e){
	            if (centerPoint == null) {
	                centerPoint=e.point;
	                drawingManager._mask.addEventListener("mousemove", showRadius);//showRadius计算画圆的半径，下面将进行讲解
	                //将获取的圆心，作为marker点添加再地图上
	                // var maker = new BMap.Marker(e.point);
	                // map.addOverlay(maker);
	            }
	        };

	        var showRadius=function (e) {
                var radius=drawingManager._map.getDistance(centerPoint, e.point);
                if(!isNaN(radius)) {
                    map.removeOverlay(label); //清除上一个显示半径的label标注
                    map.removeOverlay(polyline);//清除上一个圆的半径直线
                    //添加文字标签
                    var opts = {
                        position: e.point,    // 指定文本标注所在的地理位置（当前鼠标的位置）
                        offset: new BMap.Size(5, -15)    //设置文本偏移量
                    };
                    label = new BMap.Label("半径：" + (radius / 1000).toFixed(2) + "公里", opts);  // 创建文本标注对象
                    //文本标注样式
                    label.setStyle({
                        color:'#438eff',
                        //fontSize:'14px',
                        fontWeight:'bold',
                        border: "0px solid #ccc",
                        backgroundColor:'',//#2267AD
                    });
                    //从圆心画半径
                    polyline = new BMap.Polyline([
                        centerPoint,
                        e.point
                    ], {strokeColor:"red", strokeWeight:2, strokeOpacity:0.5});//后面参数为划线的样式
                    map.addOverlay(polyline);//添加半径直线
                    map.addOverlay(label);//添加label
                }
            };
		}

		//添加鼠标绘制工具监听事件，用于获取绘制结果
		drawingManager.addEventListener('overlaycomplete', function(e) {
			// console.log("判断是否在圈内")
			if(e.overlay.getRadius()==0){
				layer.msg('操作无效，请重新绘制圆形区域');
				return false;
			}
			drawingManager.close();

			//获取所画图形类型
			var drawingModeType = e.drawingMode;
			//获取圆半径，中心点
			if(drawingModeType == "circle") {
				vm.circleConfig={
					lng:e.overlay.getCenter().lng,
					lat:e.overlay.getCenter().lat,
					banjing:e.overlay.getRadius()
				};
			} 
			vm.fnAddMarker();
		});
	}else{
		//TODO 可优化
		map.clearOverlays();//清除所有marker
		vm.fnAddMarker();
	}
}

function fnSetMapType(type){
	// 清除指定线
	var allOverlay = map.getOverlays();
	for (var i = 0; i < allOverlay.length; i++) {
		if(allOverlay[i].name === 'area_line') {
		  map.removeOverlay(allOverlay[i])
		}
	}


	vm.mapType=type;
	var strokeColor='';
	switch (type) {
		case 1:
			map.setMapStyleV2({styleJson:[]});
			map.setMapType(BMAP_NORMAL_MAP); //普通地图
			strokeColor='#2e921a';
			break;
		case 2:
			map.setMapType(BMAP_HYBRID_MAP); //混合地图
			strokeColor='#f9ff4f';
			break;
		case 3:
			map.setMapStyleV2({styleJson:styleJsonYour});//矢量地图
			map.setMapType(BMAP_NORMAL_MAP); //普通地图
			strokeColor='#35eaff';
			break;
	}


    var bdary = new BMap.Boundary();
    bdary.get("西青区", function(rs){       //获取行政区域
        var count = rs.boundaries.length; //行政区域的点有多少个
        if (count === 0) {
            alert('未能获取当前输入行政区域');
            return ;
        }
        var pointArray = [];
        for (var i = 0; i < count; i++) {
            var ply = new BMap.Polygon(
	            rs.boundaries[i], 
	            {
	            	strokeColor:strokeColor, 
	            	fillColor:"none", 
	            	fillColorOpacity:"0.9",  
	            	strokeWeight:BmapConfig.strokeWeight, 
	            	strokeOpacity:0.8
	            }
            );
            ply.disableMassClear();
            map.addOverlay(ply);  //添加覆盖物
        }    
    });  
}

function fnLabelStatus(){
	if(vm.labelShow){
		$('#allmap .BMap_Marker label').show();
	}else{
		$('#allmap .BMap_Marker label').hide();
	}
	vm.labelShow=!vm.labelShow;
}

function openRightPopup(index){
	vm.curMarker=vm.marker_list[index];
	layui.admin.popupRight({
	    id: 'LAY_adminPopupLayerTest',
	    url: vm.curMarker.code!='wuranyuan'?'right_zonghefenxi.html':'right_wuranyuan.html',
	    shadeClose:false,
	    closeBtn:false,
	    shade: 0,
	    area: '600px',
	    data: vm.marker_list[index],
        tpl: true,
	    success: function(){
	    	// console.log("<=====>")
	    }
	});
}

//创建InfoWindow
function createInfoWindow(i){
	var json = vm.marker_list[i];
	if(json.time==null){
		json.time=gettingTime(new Date());
	}
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

	if(json.code == 'video'){
		var html = ['<div class="contentBox" style="width:250px;">',
  					'<h3 class="title_top">'+json.pointName+'</h3>',
  					'<hr style="padding:0px;margin:5px 0px;height:1px solid #ccc;background:#34A6CB;">',
  					'<div class="layui-row layui-col-space5">',
					    '<div class="layui-col-xs12 layui-col-sm12 layui-col-md12">',
					      '<div class="video_bg" data-vid="'+json.vId+'" data-name="'+json.name+'" onclick=showVideo("'+json.vId+'","'+json.name+'") style="background-image:url('+json.pUrl+');">',
					      '</div>',
					    '</div>',
					'</div>',
					'<div style="height:5px;">',
						'<img src="../../images/tools/down.png" />',
					'</div>',
				'</div>'].join('');
	    // console.log('我是污染源')
	}else if(json.code == 'wuranyuan'){
		var html = ['<div class="contentBox" style="width:250px;">',
  					'<h3 class="title_top">'+json.pointName+'</h3>',
  					'<hr style="padding:0px;margin:5px 0px;height:1px solid #ccc;background:#34A6CB;">',
					'<div style="height:5px;">',
						'<img src="../../images/tools/down.png" />',
					'</div>',
				'</div>'].join('');
	    // console.log('我是污染源')
	}else{
		var html = ['<div class="contentBox" style="width:250px;">',
  					'<h3 class="title_top">'+json.pointName+'</h3>',
  					'<hr style="padding:0px;margin:5px 0px;height:1px solid #ccc;background:#34A6CB;">',
					
					'<div class="layui-row layui-col-space5">',
					    '<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">',
					      '<div class="api_item">',
								'<div class="api_title" style="background:'+json.aqi_more.bgcolor+';color:'+json.aqi_more.color+';">AQI</div>',
								'<div class="api_value">',
									json.aqi,
									'<span class="layui-badge" style="background:'+json.aqi_more.bgcolor+'!important;color:'+json.aqi_more.color+'!important;">'+json.aqi_more.level+'</span>',
								'</div>',
					      '</div>',
					    '</div>',
					    '<div class="layui-col-xs8 layui-col-sm8 layui-col-md8">',
						      '<div class="layui-row layui-col-space5">',
						          '<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">',
						          	'<div class="win_item_box">',
							            '<div class="win_title" style="background:'+json.pm2_5_more.bgcolor+';color:'+json.pm2_5_more.color+';">PM2.5</div>',
	    								'<div class="win_value">'+json.pm2_5+'</div>',
						          	'</div>',
						          '</div>',
						          '<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">',
						          	'<div class="win_item_box">',
							            '<div class="win_title" style="background:'+json.pm10_more.bgcolor+';color:'+json.pm10_more.color+';">PM10</div>',
	    								'<div class="win_value">'+json.pm10+'</div>',
    								'</div>',
						          '</div>',
						          '<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">',
							        '<div class="win_item_box">',
							            '<div class="win_title" style="background:'+json.o3_more.bgcolor+';color:'+json.o3_more.color+';">O3</div>',
	    								'<div class="win_value">'+json.o3+'</div>',
	    							'</div>',
						          '</div>',
						      '</div>',
						      '<div class="layui-row layui-col-space10">',
						          '<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">',
							        '<div class="win_item_box">',
							            '<div class="win_title" style="background:'+json.so2_more.bgcolor+';color:'+json.so2_more.color+';">SO2</div>',
	    								'<div class="win_value">'+json.so2+'</div>',
	    							'</div>',
						          '</div>',
						          '<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">',
							        '<div class="win_item_box">',
							            '<div class="win_title" style="background:'+json.no2_more.bgcolor+';color:'+json.no2_more.color+';">NO2</div>',
	    								'<div class="win_value">'+json.no2+'</div>',
	    							'</div>',
						          '</div>',
						          '<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">',
							        '<div class="win_item_box">',
							            '<div class="win_title" style="background:'+json.co_more.bgcolor+';color:'+json.co_more.color+';">CO</div>',
	    								'<div class="win_value">'+json.co+'</div>',
	    							'</div>',
						          '</div>',
						      '</div>',
					    '</div>',
					'</div>',



					'<h6 class="title_bottom">更新于：'+json.time+'</h6>',
					'<div style="height:5px;">',
						'<img src="../../images/tools/down.png" />',
					'</div>',
				'</div>'].join('');
		// console.log('我不是污染源')
	}
	


	var iw = new BMap.InfoWindow(html,opts);
	return iw;
}

//创建一个Icon
function createIcon(json){
	var icon = new BMap.Icon(" http://api.map.baidu.com/lbsapi/creatmap/images/us_mk_icon.png", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)})
	return icon;
}

function showVideo(video_id, video_name){
	var url =  pageUrl+'views/dq/rtmpVideo.html?videoId='+video_id;
	window.open(url,video_name,'location=no,width=650,height=490,menubar=no');
}