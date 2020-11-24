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
	console.log("画圈")
	vm.drawingCircle=!vm.drawingCircle;
	vm.dis=false;
	myDis.close();  //关闭鼠标测距

	vm.fnAddMarker();

	if(vm.drawingCircle){
		var styleOptions = {
		    strokeColor: "red", //边线颜色。
		    fillColor: "red", //填充颜色。当参数为空时，圆形将没有填充效果。
		    strokeWeight: 3, //边线的宽度，以像素为单位。
		    strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
		    fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。
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

		//添加鼠标绘制工具监听事件，用于获取绘制结果
		drawingManager.addEventListener('overlaycomplete', function(e) {


			if(e.overlay.getRadius()==0){
				layer.msg('操作无效，请重新绘制圆形区域');
				return false;
			}
			
			// vm.drawingCircle=!vm.drawingCircle;
			drawingManager.close();

			//获取所画图形类型
			var drawingModeType = e.drawingMode;
			var num = 0;
			//判断所画区域车辆数
			vm.marker_list.forEach(function(value) {
				var json = value;
	    		var p0 = json.lng;
	    		var p1 = json.lat;
	    		var point = new BMap.Point(p0,p1);
				if(drawingModeType == "circle") {
					if(BMapLib.GeoUtils.isPointInCircle(point, e.overlay)) {
						num++;
					}else{
						// 移除marker
						var allOverlay = map.getOverlays();
						console.log(allOverlay);
						for (var j = 0; j < allOverlay.length; j++) {
							try{
					            if (allOverlay[j].getPosition().lng ==p0 && allOverlay[j].getPosition().lat==p1 ) {
								    map.removeOverlay(allOverlay[j]);
								}
					        }catch(error){

					        }
						}
					}
				}
			});
		});
	}
}

function fnSetMapType(type){
	vm.mapType=type;
	switch (type) {
		case 1:
			map.setMapStyleV2({styleJson:[]});
			map.setMapType(BMAP_NORMAL_MAP); //普通地图
			
			break;
		case 2:
			map.setMapStyleV2({styleJson:[]});//矢量地图
			map.setMapType(BMAP_HYBRID_MAP); //混合地图
			break;
		case 3:
			map.setMapStyleV2({styleJson:styleJsonYour});//矢量地图
			map.setMapType(BMAP_NORMAL_MAP); //普通地图
			break;
		case 4:
			map.setMapStyleV2({styleJson:styleJsonYour});//矢量地图
			map.setMapType(BMAP_NORMAL_MAP); //普通地图
			break;
	}
}

function fnLabelStatus(){
	if(vm.labelShow){
		$('#allmap .BMap_Marker label').show();
	}else{
		$('#allmap .BMap_Marker label').hide();
	}
	vm.labelShow=!vm.labelShow;
}

function fnOpenInfoWindow(item){

	vm.screen_marker_list.forEach(function(value, index) {
		if (value.lng ==item.lng && value.lat==item.lat ) {
			console.log(item);
			console.log(value);
			// return false;
		    var json = vm.screen_marker_list[index];
		    var p0 = json.lng;
		    var p1 = json.lat;
		    var infoWindow=createInfoWindow(index); 
		    var point = new BMap.Point(p0, p1);
		    map.openInfoWindow(infoWindow, point);
		    // openRightPopup(index);
		}
	});
}


// function fnOpenInfoWindow(index){
// 	var json = vm.marker_list[index];
// 	var p0 = json.lng;
// 	var p1 = json.lat;
// 	var infoWindow=createInfoWindow(0); 
// 	var point = new BMap.Point(p0, p1);
// 	map.openInfoWindow(infoWindow, point);
// 	openRightPopup(index);
// }

function openRightPopup(index){
	console.log(vm.marker_list[index])
	layui.admin.popupRight({
	    id: 'LAY_adminPopupLayerTest',
	    url: 'right.html',
	    shadeClose:false,
	    closeBtn:false,
	    shade: 0,
	    area: '600px',
	    data: vm.marker_list[index],
        tpl: true,
	    success: function(){
	    	console.log("<=====>")
    	  	setTimeout(function(){
    			layui.use(['layer', 'admin', 'form', 'laydate', 'fileChoose', 'dropdown', 'xmSelect'], function () {
    		        var $ = layui.jquery;
    		        var layer = layui.layer;
    		        var admin = layui.admin;
    		        var form = layui.form;
    		        var laydate = layui.laydate;
    		        var fileChoose = layui.fileChoose;
    		        var xmSelect = layui.xmSelect;

    		        /* 渲染时间选择 */
    	            laydate.render({
    	                elem: '#tbAdvSelDate',
    	                type: 'date',
    	                range: true,
    	                trigger: 'click'
    	            });

    	            form.render();

    	            /* 表格搜索 */
    	            form.on('submit(tbAdvTbSearch)', function (data) {
    	            	console.log(data);
    	            	$('#iframe_api').attr('src', 'echart.html');
    	                // insTb.reload({where: data.field, page: {curr: 1}});
    	                return false;
    	            });
    		    });
    		},0);
	    }
	});

  	
}

//创建InfoWindow
function createInfoWindow(i){
	var json = vm.marker_list[i];
	var opts = {
		width: 0, // 信息窗口宽度
		height: 0, // 信息窗口高度
		// title: '<h3 style="text-align: center">点位详情</h3>', // 信息窗口标题
		enableMessage: true, //设置允许信息窗发送短息
		offset:{
			height:10,
			width:-13
		},
		message: ""
	}

	var html = `<div class="contentBox" style="width:250px;">
  					<h3 class="title_top">${json.pointName}</h3>
  					<hr style="padding:0px;margin:5px 0px;height:1px solid #ccc;background:#34A6CB;">
					
					<div class="layui-row layui-col-space5">
					    <div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
					      <div class="api_item">
								<div class="api_title" style="background:${json.aqi_more.bgcolor};color:${json.aqi_more.color};">AQI</div>
								<div class="api_value">
									${json.aqi}
									<span class="layui-badge" style="background:${json.aqi_more.bgcolor}!important;color:${json.aqi_more.color}!important;">${json.aqi_more.level}</span>
								</div>
					      </div>
					    </div>
					    <div class="layui-col-xs8 layui-col-sm8 layui-col-md8">
						      <div class="layui-row layui-col-space5">
						          <div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
						          	<div class="win_item_box">
							            <div class="win_title" style="background:${json.pm2_5_more.bgcolor};color:${json.pm2_5_more.color};">PM2.5</div>
	    								<div class="win_value">${json.pm2_5}</div>
						          	</div>
						          </div>
						          <div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
						          	<div class="win_item_box">
							            <div class="win_title" style="background:${json.pm10_more.bgcolor};color:${json.pm10_more.color};">PM10</div>
	    								<div class="win_value">${json.pm10}</div>
    								</div>
						          </div>
						          <div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
							        <div class="win_item_box">
							            <div class="win_title" style="background:${json.co_more.bgcolor};color:${json.co_more.color};">CO</div>
	    								<div class="win_value">${json.o3}</div>
	    							</div>
						          </div>
						      </div>
						      <div class="layui-row layui-col-space10">
						          <div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
							        <div class="win_item_box">
							            <div class="win_title" style="background:${json.so2_more.bgcolor};color:${json.so2_more.color};">SO2</div>
	    								<div class="win_value">${json.so2}</div>
	    							</div>
						          </div>
						          <div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
							        <div class="win_item_box">
							            <div class="win_title" style="background:${json.no2_more.bgcolor};color:${json.no2_more.color};">NO2</div>
	    								<div class="win_value">${json.no2}</div>
	    							</div>
						          </div>
						          <div class="layui-col-xs4 layui-col-sm4 layui-col-md4">
							        <div class="win_item_box">
							            <div class="win_title" style="background:${json.o3_more.bgcolor};color:${json.o3_more.color};">O3</div>
	    								<div class="win_value">${json.o3}</div>
	    							</div>
						          </div>
						      </div>
					    </div>
					</div>



					<h6 class="title_bottom">更新于：${json.time}</h6>
					<div style="height:5px;">
						<img src="../../images/tools/down.png" />
					</div>
				</div>`;
	var iw = new BMap.InfoWindow(html,opts);
	return iw;
}

//创建一个Icon
function createIcon(json){
	var icon = new BMap.Icon(" http://api.map.baidu.com/lbsapi/creatmap/images/us_mk_icon.png", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)})
	return icon;
}