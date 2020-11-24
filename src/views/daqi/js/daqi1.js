var myDis;
function fnZoomPlus(){
	map.setZoom(map.getZoom() + 1);
}

function fnZoomMinus(){
	map.setZoom(map.getZoom() - 1);
}

function fnDistanceTool(){
	myDis = new BMapLib.DistanceTool(map);
}

var fnDistanceTool_open=function(){
	myDis.open();  //开启鼠标测距
}

var fnDistanceTool_close=function(){
	myDis.close();  //关闭鼠标测距
}


// 向地图添加10个标注
function addTenMarkers(){
    var longS = 108.926375;
    var latS = 34.208395;
    for (var i = 0; i < 10; i ++) {
         var point = new BMap.Point(longS + 0.001*i, latS + 0.0001*i);
         var marker = new BMap.Marker(point);
         map.addOverlay(marker);
    }
}

function fnAddLabels(){
	layui.use(['index','layer', 'laytpl', 'element', 'dropdown'], function(){
		var dropdown = layui.dropdown;
		if(vm.labelShow){
			vm.pointList.forEach((item, index)=>{
			    var point = new BMap.Point(item.longitude, item.latitude);
			    var opts = {
			      position : point,    // 指定文本标注所在的地理位置
			      offset   : new BMap.Size(-10, -10)    //设置文本偏移量
			    }
			    var str=`<div style="background:green;width:100%;height:100%;" class="layui-dropdown is-up" id="dropdown${item.id}">
					      <div class="layui-dropdown-toggle" style="width:100%;height:100%;"></div>
					      <div class="layui-dropdown-menu" style="margin-left:-110px;">
					        <div style="width: 240px;height: 120px;">
					          任意内容
					        </div>
					      </div>
					    </div>`;
			    var label = new BMap.Label(str, opts);  // 创建文本标注对象
			    	label.setStyle({
			    		 color : "red",
			    		 fontSize : "12px",
			    		 height : "20px",
			    		 width: "20px",
			    		 lineHeight : "20px",
			    		 fontFamily:"微软雅黑"
			    	});
			    map.addOverlay(label);

			    dropdown.render('#dropdown'+item.id)
			})
		}else{
			map.clearOverlays();     
		}
		vm.labelShow=!vm.labelShow;
	});
}

function fnAddMarkers(){
	console.log('markerLabelShow='+vm.markerLabelShow)
    if(vm.markerLabelShow){
	    for (var i = 0; i < vm.pointList.length; i ++) {
	        var point = new BMap.Point(vm.pointList[i].longitude, vm.pointList[i].latitude);
	        var marker = new BMap.Marker(point);
	        map.addOverlay(marker);
	        var sContent = '<div class="col-xs-12">\n' +
				'                    <ul class="list-unstyled">\n' +
				'                      <li style="list-style-type:none;">设备名称：设备1</li>\n' +
				'                      <li style="list-style-type:none;">出发地：浙江省杭州市西湖区西湖文化广场</li>\n' +
				'                      <li style="list-style-type:none;">目的地：浙江省杭州市滨江区滨江区政府对面</li>\n' +
				'                      <li style="list-style-type:none;">电池电量：1000毫安</li>\n' +
				'                      <li style="list-style-type:none;float: right "><a href="">定位轨迹</a></li>\n' +
				'                    </ul>\n' +
				'                  </div>';;
	        var infoWindow = new BMap.InfoWindow(sContent); 
	        marker.addEventListener("click", function(){   

				// map.panTo(point);  

	            this.openInfoWindow(infoWindow);
	            document.getElementById('imgDemo').onload = function (){
	        	   infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
	            }
	        });


			marker.addEventListener("mouseout",function () {
				// this.closeInfoWindow();
			});
	    }
    }else{
    	//获取地图上所有的覆盖物
    	var allOverlay = map.getOverlays();
    	for (var i = 0; i < allOverlay.length; i++) {
    	    if (allOverlay[i].toString() == "[object Marker]") {
    	    	// if (allOverlay[i].getPosition().lng == longitude(待删除标注的经度) && allOverlay[i].getPosition().lat == latitude(待删除标注纬度)) {
    	    	 	map.removeOverlay(allOverlay[i]);
    	    	// }
    	    }
    	}
    }
    vm.markerLabelShow=!vm.markerLabelShow;
}

// 随机向地图添加10个标注
function addTenRandomMarkers_xxxxxxxxxxxxxxxxxxxxxxxxx(){
	vm.markerLabelShow=!vm.markerLabelShow;
	console.log(vm.markerLabelShow)
    var bounds = map.getBounds();
    var sw = bounds.getSouthWest();
    var ne = bounds.getNorthEast();
    var lngSpan = Math.abs(sw.lng - ne.lng);
    var latSpan = Math.abs(ne.lat - sw.lat);
    
    for (var i = 0; i < 10; i ++) {
        var point = new BMap.Point(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7));
        var marker = new BMap.Marker(point);
	    var label = new BMap.Label("我是文字标注哦",{offset:new BMap.Size(20,-10)});
	    marker.setLabel(label);
        map.addOverlay(marker);

        if(vm.markerLabelShow){
        	marker.show();
        }else{
        	marker.hide();
        }
    }
}

//行政区域轮廓
function getBoundary(){       
    var bdary = new BMap.Boundary();
    bdary.get("西青区", function(rs){       //获取行政区域
        map.clearOverlays();        //清除地图覆盖物       
        var count = rs.boundaries.length; //行政区域的点有多少个
        if (count === 0) {
            alert('未能获取当前输入行政区域');
            return ;
        }
        var pointArray = [];
        for (var i = 0; i < count; i++) {
            var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#ff0000"}); //建立多边形覆盖物
            map.addOverlay(ply);  //添加覆盖物
            pointArray = pointArray.concat(ply.getPath());
        }    
        map.setViewport(pointArray);    //调整视野  
        // addlabel();               
    });   
}
getBoundary();

function fnSetMapType(type){
	switch (type) {
		case 1:
			map.setMapType(BMAP_NORMAL_MAP); //普通地图
			break;
		case 2:
			map.setMapType(BMAP_HYBRID_MAP); //混合地图
			break;
		case 3:
			map.setMapType(BMAP_PERSPECTIVE_MAP); //3D地图
			break;
	}
}

function fnDrawingCircle() {
	drawingManager.open();
	drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
}

function fnSetStyle(){
	fnSetMapType(1)
	map.setMapStyle({
		style: 'midnight'
	});
}

function fnDrawingCircle1(){
	//实例化鼠标绘制工具  
	var drawingManager = new BMapLib.DrawingManager(map, {
		enableCalculate: true, //是否开启测量模式
		isOpen: false, //是否开启绘制模式
		enableDrawingTool: true, //是否显示工具栏
		drawingToolOptions: {
			anchor: BMAP_ANCHOR_TOP_LEFT, //位置
			offset: new BMap.Size(115, 55), //偏离值
			scale: 1, //工具栏缩放比例
			drawingModes: [
				// BMAP_DRAWING_MARKER,
				BMAP_DRAWING_CIRCLE,
				// BMAP_DRAWING_RECTANGLE,
				BMAP_DRAWING_POLYLINE,
				// BMAP_DRAWING_POLYGON
			]
		},
		circleOptions: styleOptions, //圆的样式  
		rectangleOptions: styleOptionsGree, //矩形的样式  
		polylineOptions: styleOptions, //线的样式  
		polygonOptions: styleOptions, //多边形的样式  
	});

	drawingManager.addEventListener('markercomplete', function(e) {
		console.log("markercomplete=============>>>")
		console.log(e);
		console.log("=============<<<")
	});

	drawingManager.addEventListener('rectanglecomplete', function(e) {
		console.log("rectanglecomplete=============>>>")
		console.log(e);
		console.log("=============<<<")
	});

	drawingManager.addEventListener('circlecomplete', function(e) {
		console.log("circlecomplete=============>>>")
		console.log(e);
		console.log("=============<<<")
	});
	
	drawingManager.addEventListener('overlaycomplete', function(e) {
		console.log("((((((((((")
		console.log(e.drawingMode);
	    console.log(e.overlay);
	    console.log(e.calculate);
	    console.log(e.label);
		console.log("))))))))))")
		//关闭画图
		drawingManager.close();
		//获取所画图形类型
		var drawingModeType = e.drawingMode;
		var num = 0;
		//判断所画区域车辆数
		dataInfo.forEach(function(value) {
			var point = new BMap.Point(value.longitude, value.latitude);
			if(drawingModeType == "circle") {
				if(BMapLib.GeoUtils.isPointInCircle(point, e.overlay)) {
					num++;
				}
			} else if(drawingModeType == "rectangle") {
				if(BMapLib.GeoUtils.isPointInPolygon(point, e.overlay)) {
					num++;
				}
			}
		});
	
		//获取圆半径，中心点
		if(drawingModeType == "circle") {
			console.log("圆心坐标 --- " + e.overlay.getCenter().lng + " --- " + e.overlay.getCenter().lat);
			console.log("圆半径 --- " + e.overlay.getRadius() + "（米） ");
			console.log("圆面积 --- " + e.calculate);
	
		} else if(drawingModeType == "rectangle") {
			//获取矩形坐标
			var path = e.overlay.getPath();
			console.log("左上角坐标 --- " + path[0].lng + " --- " + path[0].lat);
			console.log("右上角坐标 --- " + path[1].lng + " --- " + path[1].lat);
			console.log("右下角坐标 --- " + path[2].lng + " --- " + path[2].lat);
			console.log("左下角坐标 --- " + path[3].lng + " --- " + path[3].lat);
			console.log("矩形面积 --- " + e.calculate);
		} else if(drawingModeType == "polygon") { //画多边形
			var path = e.overlay.getPath();
			path.forEach(function(value, index) {
				console.log("第" + (index + 1) + "次坐标为：" + value.lng + " --- " + value.lat);
			});
			//获取多边形面积    偶尔会出现O，不太清楚那里有问题
			console.log("多边形形面积 --- " + e.calculate);
		} else if(drawingModeType == "polyline") { //画线条
			var path = e.overlay.getPath();
			path.forEach(function(value, index) {
				console.log("第" + (index + 1) + "次坐标为：" + value.lng + " --- " + value.lat);
			});
			//计算两点距离   画线时每条线条长度
			var distance = BMapLib.GeoUtils.getDistance(new BMap.Point(path[0].lng, path[0].lat), new BMap.Point(path[1].lng, path[1].lat));
			console.log("第一条线条长度 -- " + distance + "（米）");
			console.log("线条总长度 --- " + e.calculate + "（米）");
		}
	
		drawingModeType = drawingModeType == "circle" ? "圆" : "矩形";
		document.getElementById("carInfo").innerHTML = drawingModeType + "区域总共有" + num + "车";
	
	});
}

//标注点数组
// var markerArr = [{title:"设备1",content:"2020.01.12",point:"116.348789|39.918034",isOpen:0,icon:{w:23,h:25,l:23,t:21,x:9,lb:12}}
// 	,{title:"设备2",content:"2020.01.12",point:"120.225571|30.272547",isOpen:0,icon:{w:23,h:25,l:23,t:21,x:9,lb:12}}
// 	,{title:"设备3",content:"2020.01.12",point:"120.175553|30.24859",isOpen:0,icon:{w:23,h:25,l:23,t:21,x:9,lb:12}}
// ];
//创建marker
function addMarker(){
	// 随机向地图添加25个标注
	var bounds = map.getBounds();
	var sw = bounds.getSouthWest();
	var ne = bounds.getNorthEast();
	var lngSpan = Math.abs(sw.lng - ne.lng);
	var latSpan = Math.abs(ne.lat - sw.lat);
	for (var i = 0; i < 2; i ++) {
		var lng = sw.lng + lngSpan * (Math.random() * 0.7);
		var lat = ne.lat - latSpan * (Math.random() * 0.7);
		// var point = new BMap.Point(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7));
		// markerArr = [{title:"测试地点"+i+"",content:"2020.01.12",point:""+lng+"|"+lat+"",isOpen:0,icon:{w:23,h:25,l:23,t:21,x:9,lb:12}}];
		markerArr.push({title:"测试地点"+i+"",content:"2020.01.12",point:""+lng+"|"+lat+"",isOpen:0,icon:{w:23,h:25,l:23,t:21,x:9,lb:12}});
	}
	for(var i=0;i<markerArr.length;i++){
		var json = markerArr[i];
		var p0 = json.point.split("|")[0];
		var p1 = json.point.split("|")[1];
		var point = new BMap.Point(p0,p1);
		var iconImg = createIcon(json.icon);
		var marker = new BMap.Marker(point,{icon:iconImg});
		var label = new BMap.Label(json.title,{"offset":new BMap.Size(json.icon.lb-json.icon.x+10,-20)});
		label.setStyle({
			borderColor:"#808080",
			color:"red",
			cursor:"pointer"
		});
		marker.setLabel(label);
        marker.addEventListener("click", function(){   
    		aaa(i,point,marker);
        });
		map.addOverlay(marker);
	}
}

function aaa(i,point,marker){
	var opts = {
        width: 200, // 信息窗口宽度    
        height: 250, // 信息窗口高度   
    }
    var sContent =
		            "<h4 style='height:50px'>天安门</h4>" + 
		            "<table style='width: 200px;height:200px;'>"+
		            	"<tr><td><div id='main"+i+"' style='width:200px;height:200px;'></div></td></tr>"+
		            "</table>"
    var infoWindow = new BMap.InfoWindow(sContent, opts); // 创建信息窗口对象 
    infoWindow.addEventListener("open",function(){
		marker.getLabel().hide();
	})
	infoWindow.addEventListener("close",function(){
		marker.getLabel().show();
	})
    console.log("创建div");
    map.openInfoWindow(infoWindow, point); //在point打的位置上进行一个标注  
    setTimeout(function(){
        var myChart1 = echarts.init(document.getElementById('main'+i));
        console.log("如果找到id为main的div就会看到本条信息");
        option = { //这个option是从echarts官网实例中搬过来的，自己的就不发了
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: { type: 'value' },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                areaStyle: {}
            }]
        };
        myChart1.setOption(option);
    }, 1000);
}

//创建一个Icon
function createIcon(json){
	var icon = new BMap.Icon(" http://api.map.baidu.com/lbsapi/creatmap/images/us_mk_icon.png", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)})
	return icon;
}