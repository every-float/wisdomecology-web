function initMap() {
    var crs = new L.Proj.CRS('EPSG:900913',
            '+proj=merc +a=6378206 +b=6356584.314245179 +lat_ts=0.0 +lon_0=0.0 +x_0=0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs',
            {
                resolutions: function () {
                    level = 19
                    var res = [];
                    res[0] = Math.pow(2, 18);
                    for (var i = 1; i < level; i++) {
                        res[i] = Math.pow(2, (18 - i))
                    }
                    return res;
                }(),
                origin: [0,0],
                bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
            });
    var options = {
        center: [39.088183, 117.128834],
        zoom: 15,
        // minZoom: 13,
        // maxZoom: 15,
        crs: L.CRS.Baidu,
        layers: [new L.tileLayer.baidu({ layer: 'custom', customid: 'midnight' })]
    };

    map = L.map("allmap", options);
    // map.setView([39.088183, 117.128834], 15);

    // mapAbleView();

    // //地图级别改变时发生
    // map.on("zoomend", function(e) {
    //     console.log('zoomend');
    //     var zoomVal = e.target.getZoom();
    //     mapAbleView();
    // });
    //拖动地图时发生
    map.on("moveend", function(e) {
        console.log('moveend')
        vm.fnAddMarker();
    });

    //添加标注
    //添加标注
    // var marker = L.marker([39.088183,117.128834]).addTo(map);

    // // 添加当前位置 标注
    // var icon = new L.Icon({
    //     iconUrl: '../../images/tools/icon_weixingmap_2.png',
    //     shadowUrl: 'leaflet/images/marker-shadow.png',
    //     iconSize: [28, 28],
    //     iconAnchor: [12, 41],
    //     popupAnchor: [1, -34],
    //     shadowSize: [41, 41]
    // });
    // var marker = L.marker([39.088183, 117.128834], { icon: icon }).addTo(map);
    // marker.bindPopup("<b>Hello world!</b><br><div style='color: red'>这是一个div</div>");
    // marker.on({
    //     'mouseover': function(e) {
    //         // console.log(e.target);
    //         marker.openPopup();
    //     },
    //     'mouseout': function(e) {
    //         // console.log(e.target);
    //         marker.closePopup();
    //     },
    //     'click': function(e) {
    //         // console.log(e.target);
    //         marker.openPopup();
    //     }
    // });


    L.control.layers(
        //dark,midnight,grayscale,hardedge,light,redalert,googlelite,grassgreen,pink,darkgreen,bluish
        {
            // "百度地图": L.tileLayer.baidu({ layer: 'vec' }).addTo(map),
            "卫星": L.tileLayer.baidu({ layer: 'img' }),
            "深色": L.tileLayer.baidu({ layer: 'custom', customid: 'midnight' })
        }, {
            "实时交通信息": L.tileLayer.baidu({ layer: 'time' })
        }, {
            // "cities" : ExampleData.LayerGroups.cities
        }, { position: "topright" }).addTo(map);

    // // 左侧菜单
    // L.Control.centerLeft = L.Control.extend({
    //     //在此定义参数
    //     options: {
    //         position: 'topleft' //初始位置
    //     },
    //     //在此初始化
    //     initialize: function(options) {
    //         L.Util.extend(this.options, options);
    //     },
    //     onAdd: function(map) {
    //         //可在此添加控件内容
    //         this._container = L.DomUtil.create('div', 'info legend');

    //         this._container.innerHTML = $('#center_left').html();
    //         return this._container;
    //     }
    // });
    // L.control.centerLeft = function() {
    //     return new L.Control.centerLeft();
    // };

    // L.control.centerLeft().addTo(map);



    // L.Control.Legend = L.Control.extend({
    //     options: {
    //         position: 'topleft' //初始位置
    //     },
    //     initialize: function(options) {
    //         L.Util.extend(this.options, options);
    //     },
    //     onAdd: function(map) {
    //         //创建一个class为info legend的div
    //         this._container = L.DomUtil.create('div', 'info legend');
    //         var labels = [];
    //         labels.push('<div style="width: 30px;height: 30px;background: red" onclick="initWind()">画圆</div>');
    //         labels.push('<div style="width: 30px;height: 30px;background: red" onclick="fnDrawingCircle()">画圆</div>');
    //         labels.push('<div style="width: 30px;height: 30px;background: red" onclick="initWind()">风场</div>');

    //         this._container.innerHTML = labels.join('<hr style="margin:0px;">');
    //         return this._container;
    //     },
    //     onRemove: function(map) {
    //         // Nothing to do here
    //     }
    // });

    // L.control.legend = function(opts) {
    //     return new L.Control.Legend(opts);
    // };

    // var legend_left = L.control.legend({ position: 'topleft' });
    // // 添加图例
    // legend_left.addTo(map);
    // ///////////////////////////////////////////////


    // //右下角测试
    // L.Control.Legend = L.Control.extend({
    //     options: {
    //         position: 'topright' //初始位置
    //     },
    //     initialize: function(options) {
    //         L.Util.extend(this.options, options);

    //     },
    //     onAdd: function(map) {
    //         //创建一个class为info legend的div
    //         this._container = L.DomUtil.create('div', 'info legend');
    //         //创建一个图片要素
    //         var grades = [0, 10, 20, 50, 100, 200, 500, 1000],
    //             labels = [],
    //             from, to;

    //         for (var i = 0; i < grades.length; i++) {
    //             from = grades[i];
    //             to = grades[i + 1];

    //             labels.push(
    //                 '<i style="background:' + this._getColor(from + 1) + '"></i> ' +
    //                 from + (to ? '&ndash;' + to : '+'));
    //         }

    //         this._container.innerHTML = labels.join('<br>');
    //         return this._container;
    //     },
    //     _getColor: function(d) {
    //         return d > 1000 ? '#800026' :
    //             d > 500 ? '#BD0026' :
    //             d > 200 ? '#E31A1C' :
    //             d > 100 ? '#FC4E2A' :
    //             d > 50 ? '#FD8D3C' :
    //             d > 20 ? '#FEB24C' :
    //             d > 10 ? '#FED976' :
    //             '#FFEDA0';
    //     },
    //     onRemove: function(map) {
    //         // Nothing to do here
    //     }
    // });

    // L.control.legend = function(opts) {
    //     return new L.Control.Legend(opts);
    // };

    // var legend = L.control.legend({ position: 'bottomright' });
    // //添加图例
    // legend.addTo(map);

    //添加marker
    vm.fnAddMarker();
}

function createMarkerGroup(data) {
    //清除
    markerGroup.clearLayers();

    markerGroup = L.layerGroup().addTo(map);
    for (var item of data) {
        var maker = L.marker([item.lat, item.lng]);
        markerGroup.addLayer(maker);
    }
}

function IsPtInPoly(ALon, ALat, APoints) {
    var iSum = 0,
        iCount;
    var dLon1, dLon2, dLat1, dLat2, dLon;
    if (APoints.length < 4) return false;
    iCount = APoints.length;
    for (var i = 0; i < iCount; i++) {
        if (i == iCount - 1) {
            dLon1 = APoints[i].lng;
            dLat1 = APoints[i].lat;
            dLon2 = APoints[0].lng;
            dLat2 = APoints[0].lat;
        } else {
            dLon1 = APoints[i].lng;
            dLat1 = APoints[i].lat;
            dLon2 = APoints[i + 1].lng;
            dLat2 = APoints[i + 1].lat;
        }
        //以下语句判断A点是否在边的两端点的水平平行线之间，在则可能有交点，开始判断交点是否在左射线上
        if (((ALat >= dLat1) && (ALat < dLat2)) || ((ALat >= dLat2) && (ALat < dLat1))) {
            if (Math.abs(dLat1 - dLat2) > 0) {
                //得到 A点向左射线与边的交点的x坐标：
                dLon = dLon1 - ((dLon1 - dLon2) * (dLat1 - ALat)) / (dLat1 - dLat2);
                if (dLon < ALon)
                    iSum++;
            }
        }
    }
    if (iSum % 2 != 0)
        return true;
    return false;
}


/**
判断一个点是否在多边形内部
@param points 多边形坐标集合
@param testPoint 测试点坐标
返回true为真，false为假
*/
function pointInsidePolygon(points, testPoint) {
    console.log(JSON.stringify(points));
    var x = testPoint[0],
        y = testPoint[1];
    var inside = false;
    for (var i = 0, j = points.length - 1; i < points.length; j = i++) {
        var xi = points[i][0],
            yi = points[i][1];
        var xj = points[j][0],
            yj = points[j][1];

        var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

/**
判断一个点是否在圆的内部
@param point 测试点坐标
@param circle 圆心坐标
@param r 圆半径
返回true为真，false为假
*/
function pointInsideCircle(point, circle, r) {
  console.log(point, circle, r,"=-------------------------");
    if (r === 0) return false
    var dx = circle[0]*1 - point[0]*1
    var dy = circle[1]*1 - point[1]*1
    console.log((dx * dx + dy * dy)*10000000000 , (r * r));
    console.log(dx, dy, (dx * dx + dy * dy)*10000000000 <= (r * r));
    return (dx * dx + dy * dy)*10000000000 <= (r * r)
}

function mapAbleView() {
    var points = [];
    //左下角坐标（西南方）
    var leftdown = map.getBounds().getSouthWest().lng + "," + map.getBounds().getSouthWest().lat;
    points.push([
        map.getBounds().getSouthWest().lng,
        map.getBounds().getSouthWest().lat
    ]);
    // L.circleMarker([map.getBounds().getSouthWest().lat, map.getBounds().getSouthWest().lng], { fillColor: "#f00", radius: 10 }).bindLabel("左下角坐标" + leftdown, { direction: 'right', noHide: true }).addTo(map);
    //右上角坐标（东北方向）
    var rightdown = map.getBounds().getNorthEast().lng + "," + map.getBounds().getNorthEast().lat;
    points.push([
        map.getBounds().getNorthEast().lng,
        map.getBounds().getNorthEast().lat
    ]);
    // L.circleMarker([map.getBounds().getNorthEast().lat, map.getBounds().getNorthEast().lng], { fillColor: "#f00", radius: 10 }).bindLabel("右上角坐标" + rightdown, { direction: 'left', noHide: true }).addTo(map);
    //var strText = "当前地图级别：" + zoom_val + " 左下角坐标：" + leftdown + " 右下角坐标：" + rightdown;
    //左上角：西北方
    var leftdown = map.getBounds().getNorthWest().lng + "," + map.getBounds().getNorthWest().lat;
    points.push([
        map.getBounds().getNorthWest().lng,
        map.getBounds().getNorthWest().lat
    ]);
    // L.circleMarker([map.getBounds().getNorthWest().lat, map.getBounds().getNorthWest().lng], { fillColor: "#f00", radius: 10 }).bindLabel("左上角坐标" + leftdown, { direction: 'right', noHide: true }).addTo(map);

    //右下角：东南方
    var leftdown = map.getBounds().getSouthEast().lng + "," + map.getBounds().getSouthEast().lat;
    points.push([
        map.getBounds().getSouthEast().lng,
        map.getBounds().getSouthEast().lat
    ]);
    // L.circleMarker([map.getBounds().getSouthEast().lat, map.getBounds().getSouthEast().lng], { fillColor: "#f00", radius: 10 }).bindLabel("右下角坐标" + leftdown, { direction: 'left', noHide: true }).addTo(map);

    console.log(points);
    return points;
}


function fnDrawingCircle() {
    tempCircleI = null
    tempCircleR = 0
    if (vm.drawingCircle == true) {
        console.log('关')
        map.dragging.enable();
        map.off('mousedown');
        map.off('mouseup');
        map.off('mousemove')
        vm.drawingCircle = !vm.drawingCircle;
        try {
            map.removeLayer(tempCircle);
        } catch (e) {
            console.log(e);
        }
        return false;
    } else {
        console.log('开')
        map.dragging.disable();
        vm.drawingCircle = !vm.drawingCircle;
        try {
            map.removeLayer(tempCircle);
        } catch (e) {
            console.log(e);
        }
    }

    map.on('mousedown', onmouseDown);
    map.on('mouseup', onmouseUp);
    map.on('mousemove', onMove)

    function onmouseDown(e) {
        map.dragging.disable(); //将mousemove事件移动地图禁用
        tempCircleI = e.latlng //确定圆心
    }

    function onMove(e) {
        if (tempCircleI) {
            tempCircleR = L.latLng(e.latlng).distanceTo(tempCircleI)
            tempCircle.setLatLng(tempCircleI)
            tempCircle.setRadius(tempCircleR)
            tempCircle.setStyle({
                color: '#ff0000',
                // fillColor: '#ff0000',
                fillOpacity: 0.5
            })
            map.addLayer(tempCircle);
        }
    }

    function onmouseUp(e) {
        map.dragging.enable();
        tempCircleR = L.latLng(e.latlng).distanceTo(tempCircleI) //计算半径
        console.log(tempCircleR, tempCircleI);
        // alert('圆心坐标为：' + i + ';半径为：' + r);
        circleI = tempCircleI;
        circleR = tempCircleR;
        tempCircleI = null
        tempCircleR = 0
        vm.fnAddMarker();
    }
}

//创建InfoWindow
function createInfoWindow(item){
  var json = item;
  if(json.time==null){
    json.time=gettingTime(new Date());
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
          // '<div style="height:5px;">',
          //   '<img src="../../images/tools/down.png" />',
          // '</div>',
        '</div>'].join('');
      // console.log('我是污染源')
  }else if(json.code == 'wuranyuan'){
    var html = ['<div class="contentBox" style="width:250px;">',
            '<h3 class="title_top">'+json.pointName+'</h3>',
            '<hr style="padding:0px;margin:5px 0px;height:1px solid #ccc;background:#34A6CB;">',
          // '<div style="height:5px;">',
          //   '<img src="../../images/tools/down.png" />',
          // '</div>',
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
          // '<div style="height:5px;">',
          //   '<img src="../../images/tools/down.png" />',
          // '</div>',
        '</div>'].join('');
    // console.log('我不是污染源')
  }

  return html;
}

function showVideo(video_id, video_name){
  var url =  pageUrl+'views/dq/rtmpVideo.html?videoId='+video_id;
  window.open(url,video_name,'location=no,width=650,height=490,menubar=no');
}

function openRightPopup(item){
  vm.curMarker=item;
  layui.admin.popupRight({
      id: 'LAY_adminPopupLayerTest',
      url: vm.curMarker.code!='wuranyuan'?'right_zonghefenxi.html':'right_wuranyuan.html',
      shadeClose:false,
      closeBtn:false,
      shade: 0,
      area: '600px',
      data: item,
        tpl: true,
      success: function(){
        // console.log("<=====>")
      }
  });
}
/////////////////////////////////////////////////////////////
//风场
function initWind() {
    console.log(111)
    const r = './202008140700-wind-surface-level-gfs-0.25.json';
    // const r = './citydata.txt';

    fetch(r, {
        headers: {
            Accept: "text/plain",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        method: "GET"
    }).then((function(e) {
        // console.log('e.text()='+e.text());
        return e.text();
    })).then((function(e) {
        var text = pako.inflate(e);
        let str = "";
        for (let i = 0; i < text.length; i++) {
            str += String.fromCharCode(text[i]);
        }
        // console.info(str);
        var data = JSON.parse(str);
        var velocityLayer = L.velocityLayer({
            displayValues: true,
            displayOptions: {
                velocityType: "Global Wind",
                displayPosition: "bottomleft",
                displayEmptyString: "No wind data"
            },
            data: data,
            minVelocity: 50, //Velocity：速率
            // maxVelocity: 1000,
            velocityScale: 0.01,
            particleMultiplier: 1 / 700, //粒子的数量
            lineWidth: 2, //粒子的粗细
            frameRate: 15, //定义每秒执行的次数
            colorScale: ["rgb(255,255,255)", "rgb(255,255,255)", "rgb(255,255,255)", "rgb(255,255,255)", "rgb(255,255,255)"]
        });
        var layer = velocityLayer;
        layer.addTo(map);
        // layerControl.addOverlay(velocityLayer, "风场");
    })).catch((function(e) {

    }));
}