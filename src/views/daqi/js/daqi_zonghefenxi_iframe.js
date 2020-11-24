function initMap() {
    var crs = new L.Proj.CRS('EPSG:900913',
        '+proj=merc +a=6378206 +b=6356584.314245179 +lat_ts=0.0 +lon_0=0.0 +x_0=0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs', {
            resolutions: function() {
                level = 19
                var res = [];
                res[0] = Math.pow(2, 18);
                for (var i = 1; i < level; i++) {
                    res[i] = Math.pow(2, (18 - i))
                }
                return res;
            }(),
            origin: [0, 0],
            bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
        });

    L.tileLayer.baidu = function(option) {
        option = option || {};

        var layer;
        var subdomains = '0123456789';
        switch (option.layer) {
            //单图层
            case "vec":
            default:
                //'http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&b=0&limit=60&scaler=1&udt=20170525'
                layer = L.tileLayer('http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=' + (option.bigfont ? 'ph' : 'pl') + '&scaler=1&p=1', {
                    name: option.name,
                    subdomains: subdomains,
                    tms: true
                });
                break;
            case "img_d":
                layer = L.tileLayer('http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46', {
                    name: option.name,
                    subdomains: subdomains,
                    tms: true
                });
                break;
            case "img_z":
                layer = L.tileLayer('http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=' + (option.bigfont ? 'sh' : 'sl') + '&v=020', {
                    name: option.name,
                    subdomains: subdomains,
                    tms: true
                });
                break;

            case "custom": //Custom 各种自定义样式
                //可选值：dark,midnight,grayscale,hardedge,light,redalert,googlelite,grassgreen,pink,darkgreen,bluish
                option.customid = option.customid || 'midnight';
                layer = L.tileLayer('http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=' + option.customid, {
                    name: option.name,
                    subdomains: "012",
                    tms: true
                });
                break;

            case "time": //实时路况
                var time = new Date().getTime();
                layer = L.tileLayer('http://its.map.baidu.com:8002/traffic/TrafficTileService?x={x}&y={y}&level={z}&time=' + time + '&label=web2D&v=017', {
                    name: option.name,
                    subdomains: subdomains,
                    tms: true
                });
                break;

                //合并
            case "img":
                layer = L.layerGroup([
                    L.tileLayer.baidu({ name: "底图", layer: 'img_d', bigfont: option.bigfont }),
                    L.tileLayer.baidu({ name: "注记", layer: 'img_z', bigfont: option.bigfont })
                ]);
                break;
        }
        return layer;
    };

    map = L.map("allmap", {
        center: [39.088183, 117.128834],
        zoom: 11,
        // minZoom: 9,
        // maxZoom: 13,
        renderer: L.svg(),
        zoomControl: false,
        crs: L.CRS.Baidu,
        layers: [new L.tileLayer.baidu({ layer: 'custom', customid: 'midnight' })],
        attributionControl: false // 右下角leaflet.js图标
    });
    // L.tileLayer.baidu({ layer: 'vec' }, { maxZoom: 13, minZoom: 9 }).addTo(map);

    // http://192.168.0.105:9090/img/{z}/{x}/{y}.png // 这个是瓦片地图的地址
    // 'https://osm-mapbox-or-something/tiles/{z}/{x}/{y}.png'
    // L.tileLayer.colorizr('http://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1scale=1&style=5&{x}&{y}&{z}.png', {
    //     // maxZoom: 13,
    //     // minZoom: 9,
    //     colorize: function(pixel) {
    //         // 这个方法用来调整所有的图片上的rgb值，pixel是图片原有的rgb值
    //         pixel.r += 13;
    //         pixel.g += 17;
    //         pixel.b += 90;
    //         return pixel;
    //     }
    // }).addTo(map);


    if ('外边界'&&false) {
        // console.log('外边界')
        area_border0.features[0].geometry.coordinates[0].forEach(function(item1, index1) {
            var points0 = [];
            item1.forEach(function(item2, index2) {
                points0.push({
                    lat: item2[1],
                    lng: item2[0],
                });
            });
            area_big = L.polygon(points0, {
                color: '#35eaff',
                fillOpacity: 0
            }).addTo(map);
        });
    }

    //拖动地图时发生
    map.on("moveend", function(e) {
        // console.log('moveend')
        // vm.fnAddMarker();
    });

    //添加marker
    vm.fnAddMarker();

    fnDrawingAreaBorder();
    initWind('init');
    // vm.fnChangeRankShowStatus();
    // vm.fnChangeXiangzhenShowStatus();
}


function fnSetMapType(type) {
    vm.mapType = type;
    if (type == '卫星') {
        L.tileLayer.baidu({ layer: 'img' }).addTo(map)
    } else {
        L.tileLayer.baidu({ layer: 'custom', customid: 'midnight' }).addTo(map)
    }

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
    // console.log(JSON.stringify(points));
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
    // console.log(point, circle, r, "=-------------------------");
    if (r === 0) return false
    var dx = circle[0] * 1 - point[0] * 1
    var dy = circle[1] * 1 - point[1] * 1
    // console.log((dx * dx + dy * dy) * 10000000000, (r * r));
    // console.log(dx, dy, (dx * dx + dy * dy) * 10000000000 <= (r * r));
    return (dx * dx + dy * dy) * 10000000000 <= (r * r)
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

    // console.log(points);
    return points;
}

function fnDrawingAreaBorder() {
    try {
        area_small_list.forEach(function(element, index) {
            map.removeLayer(element);
        });
    } catch (e) {
        // console.log(e);
    }
    if (vm.xiangzhenShow == false) {
        if ('块边界') {
            area_small_list = [];
            area_border.features.forEach(function(item1, index1) {
                item1.geometry.coordinates.forEach(function(item2, index2) {
                    var points = [];
                    item2.forEach(function(item3, index3) {
                        // console.log(item3, "889");
                        points.push({
                            lat: item3[1],
                            lng: item3[0],
                        });
                    });
                    area_small_list.push(L.polygon(points, {
                        color: '#35eaff',
                        fillOpacity: 0.2
                    }).addTo(map));
                });
            });
        }
    }
    vm.xiangzhenShow = !vm.xiangzhenShow;
}





//创建InfoWindow
function createInfoWindow(item) {
    var json = item;
    if (json.time == null) {
        json.time = gettingTime(new Date());
    }
    if (json.code == 'video') {
        var html = ['<div class="contentBox" style="width:250px;">',
            '<h3 class="title_top">' + json.pointName + '</h3>',
            '<hr style="padding:0px;margin:5px 0px;height:1px solid #ccc;background:#34A6CB;">',
            '<div class="layui-row layui-col-space5">',
            '<div class="layui-col-xs12 layui-col-sm12 layui-col-md12">',
            '<div class="video_bg" data-vid="' + json.vId + '" data-name="' + json.name + '" onclick=showVideo("' + json.vId + '","' + json.name + '") style="background-image:url(' + json.pUrl + ');">',
            '</div>',
            '</div>',
            '</div>',
            // '<div style="height:5px;">',
            //   '<img src="../../images/tools/down.png" />',
            // '</div>',
            '</div>'
        ].join('');
        // console.log('我是污染源')
    } else if (json.code == 'wuranyuan') {
        var html = ['<div class="contentBox" style="width:250px;">',
            '<h3 class="title_top">' + json.pointName + '</h3>',
            '<hr style="padding:0px;margin:5px 0px;height:1px solid #ccc;background:#34A6CB;">',
            // '<div style="height:5px;">',
            //   '<img src="../../images/tools/down.png" />',
            // '</div>',
            '</div>'
        ].join('');
        // console.log('我是污染源')
    } else {
        var html = ['<div class="contentBox" style="width:250px;">',
            '<h3 class="title_top">' + json.pointName + '</h3>',
            '<hr style="padding:0px;margin:5px 0px;height:1px solid #ccc;background:#34A6CB;">',

            '<div class="layui-row layui-col-space5">',
            '<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">',
            '<div class="api_item">',
            '<div class="api_title" style="background:' + json.aqi_more.bgcolor + ';color:' + json.aqi_more.color + ';">AQI</div>',
            '<div class="api_value">',
            json.aqi,
            '<span class="layui-badge" style="background:' + json.aqi_more.bgcolor + '!important;color:' + json.aqi_more.color + '!important;">' + json.aqi_more.level + '</span>',
            '</div>',
            '</div>',
            '</div>',
            '<div class="layui-col-xs8 layui-col-sm8 layui-col-md8">',
            '<div class="layui-row layui-col-space5">',
            '<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">',
            '<div class="win_item_box">',
            '<div class="win_title" style="background:' + json.pm2_5_more.bgcolor + ';color:' + json.pm2_5_more.color + ';">PM2.5</div>',
            '<div class="win_value">' + json.pm2_5 + '</div>',
            '</div>',
            '</div>',
            '<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">',
            '<div class="win_item_box">',
            '<div class="win_title" style="background:' + json.pm10_more.bgcolor + ';color:' + json.pm10_more.color + ';">PM10</div>',
            '<div class="win_value">' + json.pm10 + '</div>',
            '</div>',
            '</div>',
            '<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">',
            '<div class="win_item_box">',
            '<div class="win_title" style="background:' + json.o3_more.bgcolor + ';color:' + json.o3_more.color + ';">O3</div>',
            '<div class="win_value">' + json.o3 + '</div>',
            '</div>',
            '</div>',
            '</div>',
            '<div class="layui-row layui-col-space10">',
            '<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">',
            '<div class="win_item_box">',
            '<div class="win_title" style="background:' + json.so2_more.bgcolor + ';color:' + json.so2_more.color + ';">SO2</div>',
            '<div class="win_value">' + json.so2 + '</div>',
            '</div>',
            '</div>',
            '<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">',
            '<div class="win_item_box">',
            '<div class="win_title" style="background:' + json.no2_more.bgcolor + ';color:' + json.no2_more.color + ';">NO2</div>',
            '<div class="win_value">' + json.no2 + '</div>',
            '</div>',
            '</div>',
            '<div class="layui-col-xs4 layui-col-sm4 layui-col-md4">',
            '<div class="win_item_box">',
            '<div class="win_title" style="background:' + json.co_more.bgcolor + ';color:' + json.co_more.color + ';">CO</div>',
            '<div class="win_value">' + json.co + '</div>',
            '</div>',
            '</div>',
            '</div>',
            '</div>',
            '</div>',



            '<h6 class="title_bottom">更新于：' + json.time + '</h6>',
            // '<div style="height:5px;">',
            //   '<img src="../../images/tools/down.png" />',
            // '</div>',
            '</div>'
        ].join('');
        // console.log('我不是污染源')
    }

    return html;
}

function showVideo(video_id, video_name) {
    var url = pageUrl + 'views/dq/rtmpVideo.html?videoId=' + video_id;
    window.open(url, video_name, 'location=no,width=650,height=490,menubar=no');
}

function openRightPopup(item) {
    vm.curMarker = item;
    layui.admin.popupRight({
        id: 'LAY_adminPopupLayerTest',
        url: vm.curMarker.code != 'wuranyuan' ? 'right_zonghefenxi.html' : 'right_wuranyuan.html',
        shadeClose: false,
        closeBtn: false,
        shade: 0,
        area: '600px',
        data: item,
        tpl: true,
        success: function() {
            // console.log("<=====>")
        }
    });
}

function renderRankingTable() {
    var dataList = [];
    if (vm.drawingCircle) {
        var dataList = vm.screenCircle_marker_list;
    } else {
        var dataList = vm.screen_marker_list;
    }

    var newDataList = [];
    dataList.forEach(function(item, index) {
        if (!in_array(item.code, ['wuranyuan', 'video'])) {
            newDataList.push(item);
        }
    });

    // console.log(newDataList, "========>>>>>", vm.curItem)

    layui.use(['layer', 'table', 'admin'], function() {
        var $ = layui.jquery;
        var layer = layui.layer;
        var admin = layui.admin;
        var table = layui.table;

        //展示已知数据
        var rankingTable = table.render({
            elem: '#rankingTable',
            cols: [
                [
                    { field: 'index', title: '排名', width: 50, type: "numbers" }, { field: 'pointName', title: '点位名称' }, { field: 'aqi', title: '监测值', width: 100, templet: '#rankingTpl', align: 'center', sort: true }
                ]
            ],
            data: newDataList,
            skin: 'line',
            even: true,
            page: false,
            width: 300,
            height: window.screen.height - 250 - 90,
            limit: 100
        });

        //监听行单击事件（双击事件为：rowDouble）
        table.on('row(rankingTable)', function(obj) {
            var item = obj.data;
            vm.screen_marker_list.forEach(function(value, index) {
                if (value.lng == item.lng && value.lat == item.lat) {
                    for (var i = 0; i < vm.marker_list.length; i++) {
                        if (vm.marker_list[i].lng == item.lng && vm.marker_list[i].lat == item.lat) {
                            var infoWindow = createInfoWindow(i);
                            var point = new BMap.Point(item.lng, item.lat);
                            map.openInfoWindow(infoWindow, point);
                        }
                    }
                }
            });
            //标注选中样式
            obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
        });
    });
}

function fnLabelStatus() {
    if (vm.labelShow == true) {
        $('.textIcon div').show();
    } else {
        $('.textIcon div').hide();
    }
    vm.labelShow = !vm.labelShow;
}

function fnZoomPlus() {
    map.zoomIn();
}

function fnZoomMinus() {
    map.zoomOut();
}

function measure() {

}

function juliMeasure() {
    clearDiyMarker();
    vm.drawingCircle = false;
    vm.dis = !vm.dis;
    if(vm.dis){
        LinDistance.init = function(map){
            map.off('click');
            map.on('click', onClick);    //点击地图
            map.off('contextmenu');
            map.on('contextmenu', cancle); // 右键地图
            markers=[];// 标记图标
            points = [];
            tempLine  = new L.polyline([],{dashArray: 12});
            lines  = new L.polyline(points);
            firstFlag = true;
            

            function onClick(e) {
                var marker;
                // 如果是第一个图标
                if(firstFlag){
                    for(var item of markers){
                        item.remove();
                    }
                    points = [];
                    lines.remove();
                    lines  = new L.polyline(points);
                    tempLine  = new L.polyline([],{dashArray: 12});
                    markers = [];
                    marker = L.marker(e.latlng).bindPopup(JSON.stringify(e.latlng)).bindTooltip('start',{permanent: true});
                    firstFlag = false;
                    map.on('mousemove', onMove);//鼠标移动
                }else{
                    marker = L.marker(e.latlng).bindPopup(JSON.stringify(e.latlng)).bindTooltip('end',{permanent: true});
                    map.off('mousemove');//鼠标移动关闭
                    // 测距
                    var latlng = L.latLng(points[0]);
                    var distance = latlng.distanceTo(e.latlng);
                    ls = [points[points.length - 1], [e.latlng.lat, e.latlng.lng]]
                    lines.setLatLngs(ls);
                    lines.bindTooltip(distance.toFixed(2)+'米',{permanent: true});
                    console.log(points)
                    lines.addTo(map);
                    tempLine.remove();
                    firstFlag = true;
                }
                markers.push(marker);
                marker.addTo(map);
                points.push([e.latlng.lat, e.latlng.lng]);
            }

            function onMove(e) {
                if (points.length > 0) {
                    ls = [points[points.length - 1], [e.latlng.lat, e.latlng.lng]];
                    tempLine.setLatLngs(ls);
                    map.addLayer(tempLine);
                }
            }

            // 右键取消
            function cancle(e){
                console.log('vvvvvvvvvv')
                for(var marker of markers){
                    marker.remove();
                }
                firstFlag = true;
                points = [];
                markers=[];
                lines .remove();
                tempLine.remove();
                lines  = new L.polyline(points);
                tempLine = new L.polyline([],{dashArray: 12});
            }
        }
        LinDistance.init(map);
    }else{
        LinDistance={};
    }
    return false;
    // if('old'&&false){
    //     clearDiyMarker();
    //     vm.drawingCircle = false;
    //     vm.dis = !vm.dis;

    //     ISMEASURE = true;
    //     try {
    //         BarDRAWLAYERS = [];
    //         map.off('mousedown');
    //         map.off('mousemove');
    //         map.off('dblclick');
    //     } catch (e) {
    //         // console.log(e);
    //     }

    //     MEASURERESULT = 0; //测量结果
    //     map.getContainer().style.cursor = 'crosshair';
    //     var shapeOptions = {
    //         color: '#F54124',
    //         weight: 3,
    //         opacity: 0.8,
    //         fill: false,
    //         clickable: true
    //     };
    //     DRAWPOLYLINE = new L.Polyline([], shapeOptions); //绘制的折线
    //     map.addLayer(DRAWPOLYLINE);
    //     if (ISMEASURE) { //是否是量距
    //         MEASURETOOLTIP = new L.Tooltip(map); //量距提示
    //     }
    //     map.on('mousedown', onClick);
    //     map.on('dblclick', onDoubleClick);

    //     function onClick(e) {
    //         DRAWING = true; //是否正在绘制
    //         DRAWPOLYLINEPOINTS.push(e.latlng); //绘制的折线的节点集
    //         if (DRAWPOLYLINEPOINTS.length > 1 && ISMEASURE) { //是否是量距
    //             MEASURERESULT += e.latlng.distanceTo(DRAWPOLYLINEPOINTS[DRAWPOLYLINEPOINTS.length - 2]);
    //         }
    //         DRAWPOLYLINE.addLatLng(e.latlng); //绘制的折线
    //         map.on('mousemove', onMove);
    //     }

    //     function onMove(e) {
    //         if (DRAWING) { //是否正在绘制
    //             if (DRAWMOVEPOLYLINE != undefined && DRAWMOVEPOLYLINE != null) { //绘制过程中的折线
    //                 map.removeLayer(DRAWMOVEPOLYLINE);
    //             }
    //             var prevPoint = DRAWPOLYLINEPOINTS[DRAWPOLYLINEPOINTS.length - 1];
    //             DRAWMOVEPOLYLINE = new L.Polyline([prevPoint, e.latlng], shapeOptions);
    //             map.addLayer(DRAWMOVEPOLYLINE);
    //             if (ISMEASURE) {
    //                 tempdistance = MEASURERESULT + e.latlng.distanceTo(DRAWPOLYLINEPOINTS[DRAWPOLYLINEPOINTS.length - 1]);
    //                 /* MEASURETOOLTIP.updatePosition(e.latlng); //量距提示
    //                  MEASURETOOLTIP.updateContent({
    //                      text: '单击确定点，双击结束！',
    //                      subtext: "总长：" + (distance / 1000).toFixed(2) + "公里"
    //                  });*/
    //             }
    //         }
    //     }

    //     function onDoubleClick(e) {
    //         map.getContainer().style.cursor = '';
    //         /*显示两点距离*/
    //         tempdistance = MEASURERESULT + e.latlng.distanceTo(DRAWPOLYLINEPOINTS[DRAWPOLYLINEPOINTS.length - 1]);
    //         tempmarker = new L.Marker(e.latlng, { draggable: false });
    //         map.addLayer(tempmarker);
    //         tempmarker.bindPopup((tempdistance / 1000).toFixed(2) + "公里").openPopup();
    //         vm.dis = false;
    //         if (DRAWING) {
    //             if (DRAWMOVEPOLYLINE != undefined && DRAWMOVEPOLYLINE != null) {
    //                 map.removeLayer(DRAWMOVEPOLYLINE);
    //                 DRAWMOVEPOLYLINE = null;
    //             }
    //             BarDRAWLAYERS.push(DRAWPOLYLINE);
    //             DRAWPOLYLINEPOINTS = [];
    //             DRAWING = false;
    //             ISMEASURE = false;
    //             map.off('mousedown');
    //             map.off('mousemove');
    //             map.off('dblclick');
    //         }
    //     }
    // }
}

function fnDrawingCircle() {
    clearDiyMarker();
    vm.dis = false;

    tempCircleI = null
    tempCircleR = 0
    vm.drawingCircle = !vm.drawingCircle;
    if (vm.drawingCircle == false) {
        // console.log('关')
        map.dragging.enable();
        map.off('mousedown');
        map.off('mouseup');
        map.off('mousemove')
    } else {
        // console.log('开')
        map.dragging.disable();
        map.on('mousedown', onmouseDown);
        map.on('mouseup', onmouseUp);
        map.on('mousemove', onMove)
        function onmouseDown(e) {
            try {
                map.removeLayer(tempCircle);
                map.removeLayer(tempCircle_i_marker);
                map.removeLayer(tempCircle_textIcon_marker);
                map.removeLayer(tempCircle_r_line);
            } catch (e) {
                // console.log(e);
            }
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
            // console.log(e, "pppppppppppppppppppppp");
            map.dragging.enable();
            tempCircleR = L.latLng(e.latlng).distanceTo(tempCircleI).toFixed(2) + '米' //计算半径

            if ('文字标签') {
                var RIcon = L.divIcon({
                    html: "<div><span style='padding: 5px 10px;border-radius: 20px;overflow: hidden;border: 1px solid #bfa5a5;'>" + tempCircleR + "</span></div>",
                    className: 'RIcon',
                    iconAnchor: [14, 14],
                    popupAnchor: [1, -13],
                });
                tempCircle_textIcon_marker = L.marker([e.latlng.lat, e.latlng.lng], { icon: RIcon }).addTo(map);
                var latlngs = [
                    [tempCircleI.lat, tempCircleI.lng],
                    [e.latlng.lat, e.latlng.lng]
                ]
                tempCircle_r_line = L.polyline(latlngs, { color: 'red' }).addTo(map);
                if ('动态marker') {
                    tempCircle_i_marker = L.blinkMarker([tempCircleI.lat, tempCircleI.lng], { iconSize: [14, 14], color: 'red', speedTime: 0.5 }).addTo(map);
                }
            }

            // console.log(tempCircleI,'半径');
            // alert('圆心坐标为：' + i + ';半径为：' + r);
            circleI = tempCircleI;
            circleR = tempCircleR;
            tempCircleI = null
            tempCircleR = 0

            // console.log(tempCircle, 88888888888888);
            // tempCircle.bindTooltip( `<div >111 </div>`,
            //     { direction: 'auto', className: 'aaa', offset: [-0, -0]})
            vm.fnAddMarker();
        }
    }

    
}

function clearDiyMarker() {
    if ('发光白点') {
        try {
            map.removeLayer(search_click_marker);
        } catch (e) {
            // console.log(e);
        }
    }
    if ('圆') {
        try {
            map.dragging.enable();
            map.off('mousedown');
            map.off('mouseup');
            map.off('mousemove')
            map.removeLayer(tempCircle);
            map.removeLayer(tempCircle_i_marker);
            map.removeLayer(tempCircle_textIcon_marker);
            map.removeLayer(tempCircle_r_line);
        } catch (e) {
            // console.log(e);
        }
    }
    if ('测距') {
        try {
            map.off('click');
            map.off('contextmenu');
            for(var marker of markers){
                marker.remove();
                map.removeLayer(lines);
            }
            firstFlag = true;
            points = [];
            markers=[];
            lines .remove();
            tempLine.remove();
            map.removeLayer(lines);
            map.removeLayer(tempLine);
        } catch (e) {
            // console.log(e);
        }
    }
}

//风场
function initWind(fromType) {
    try {
        map.removeLayer(velocityLayer)
    } catch(e) {
        // console.log(e);
    }
    if (vm.windShow == true) {
        var text = pako.inflate(vm.windData);
        var str = "";
        for (let i = 0; i < text.length; i++) {
            str += String.fromCharCode(text[i]);
        }
        // console.info(str);
        var data = JSON.parse(str);
        velocityLayer = L.velocityLayer({
            displayValues: true,
            displayOptions: {
                velocityType: "Global Wind",
                displayPosition: "bottomleft",
                displayEmptyString: "No wind data"
            },
            data: data,
            minVelocity: 50, //Velocity：速率  // 粒子最小速度（ m/s ）
            // maxVelocity: 1000,  // 粒子最大速度（ m/s ）
            velocityScale: 0.02,// 风速的比例 ( 粒子的小尾巴长度 )
            particleAge: 90,  // 粒子在再生之前绘制的最大帧数
            particleMultiplier: 1 / 700, //粒子的数量
            lineWidth: 3, //粒子的粗细
            frameRate: 15, //定义每秒执行的次数
            colorScale: ["rgb(255,255,255)", "rgb(255,255,255)", "rgb(255,255,255)", "rgb(255,255,255)", "rgb(255,255,255)"]
        });
        var layer = velocityLayer;
        layer.addTo(map);
        // layerControl.addOverlay(velocityLayer, "风场");
    }
}

/////////////////////////////////////////////////////////////
//风场
function initWindxxx() {
    if (vm.windShow == true) {
        vm.windShow = !vm.windShow;
        map.removeLayer(velocityLayer)
    } else {
        vm.windShow = !vm.windShow;
        console.log(111)
        const r = 'http://39.105.57.146:8091/bigdata/file/wisdomecology/wind/20200824/202008240000-wind-surface-level-gfs-0.25.json';
        // const r = 'json/202008140700-wind-surface-level-gfs-0.25.json';

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
            velocityLayer = L.velocityLayer({
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
}