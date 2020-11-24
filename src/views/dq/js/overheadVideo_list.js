
var setting = {
//	async : {
//		enable : true,
//		url : baseUrl + '/system/menu/getMenuAll',
//		dataFilter : filter,
//		otherParam: {
//			'moduleCode': function(){
//				return $('#moduleCode').val();
//			}
//		}
//	},
    check : {
        enable : false
    },
    data : {
        simpleData : {
            enable : true,
            idKey : 'id',
            pIdKey : 'parentId'
        },
        key : {
            name : 'name',
            title : 'name'
        }
    },
    callback : {
        onClick : onClick,
        onAsyncSuccess: onAsyncSuccess
    }
};

function filter(treeId, parentNode, childNodes) {
    if (!childNodes)
        return null;
    for ( var i = 0, l = childNodes.length; i < l; i++) {
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
    }
    return childNodes;
}

function onClick(event, treeId, treeNode, clickFlag) {
    var pId = '';
    var pName = '';
    if(treeNode.getParentNode()!=null){
        pId = treeNode.getParentNode().id;
        pName = treeNode.getParentNode().name;
    }
    videolist(treeNode.id);
}

function onAsyncSuccess(event, treeId, treeNode, msg) {
    layer.closeAll('loading');
}
var menuTree;
var zNodes=[];
var insTb;
var selectLocationDialog=null;
$(function() {
    

    layui.use(['form'], function() {
        var form = layui.form;

        //加载树
        var parentId = '120000';
        initMenuTree(parentId);
    });
    videolist("120000");
});

function initMenuTree(parentId){
    $.ajax({
        url : URL_gb_areaTree+'?parentId='+parentId,
        data : {

        },
        type : "post",
        dataType : "json",
        beforeSend: function() {
            // loading show
            layer.load(2, {shade: 0.6});
        },
        success : function(res) {
            //alert(JSON.stringify(res));
            if(res.code==0){
                zNodes = res.data.tree;
                //初始化树形菜单
                menuTree = $.fn.zTree.init($('#areaTree'), setting, zNodes);
            }
        },
        complete: function () {
            layer.closeAll('loading');
        }
    });
}

function videolist(areaId){
    $('#demoCardList1').html('正在加载...');
    layui.use(['layer', 'dataGrid', 'element'], function () {
        var $ = layui.jquery;
        var layer = layui.layer;
        var dataGrid = layui.dataGrid;

        insTb=dataGrid.render({
            elem: '#demoCardList1',
            templet: '#demoCardItem1',
            url: URL_ov_list + '?areaId=' + areaId,  // 数据接口
            page: {limit: 8, limits: [8, 16, 24, 32, 40]}
        });
        dataGrid.on('item(demoCardList1)', function (obj) {
            //layer.msg('点击了第' + (obj.index + 1) + '个');
            // alert(JSON.stringify(obj));
            var url =  pageUrl+'views/dq/rtmpVideo.html?videoId='+obj.data.video_id;
            window.open(url,obj.data.video_name,'location=no,width=650,height=490,menubar=no');
            // top.layer.open({
            //     type : 2,
            //     title : '视频详情',
            //     shadeClose : true,
            //     shade : 0.6,
            //     maxmin : true,
            //     area : [ '960px', '580px' ],
            //     content : pageUrl+'views/dq/ohvideo.html?szIp='+obj.data.ip+"&szPort="+obj.data.port+"&szUsername="+obj.data.user_name+"&szPassword="+obj.data.password
            // });
        });


    });
}

layui.use(['layer', 'form', 'table', 'util', 'admin', 'xmSelect', 'fileChoose'], function () {
    var $ = layui.jquery;
    var layer = layui.layer;
    var form = layui.form;
    var table = layui.table;
    var util = layui.util;
    var admin = layui.admin;
    var xmSelect = layui.xmSelect;
    var fileChoose = layui.fileChoose;

    // 地图选择位置
    $("body").on("click","#dialogBtn9",function(){
        selectLocationDialog = admin.open({
            type:1,
            title: '选择位置',
            url: '../location.html',
            area: ['800px','90%'],
            offset: '65px',
            skin: 'diy-class',
            success: function (layero, dIndex) {
                // 弹窗超出范围不出现滚动条
                $(layero).children('.layui-layer-content').css('overflow', 'visible');
            }
        });
    });
});   
function editOV(vId){
    layui.use(['layer', 'form', 'table', 'util', 'admin', 'xmSelect', 'fileChoose'], function () {
        var $ = layui.jquery;
        var layer = layui.layer;
        var form = layui.form;
        var table = layui.table;
        var util = layui.util;
        var admin = layui.admin;
        var xmSelect = layui.xmSelect;
        var fileChoose = layui.fileChoose;
        
        var loadIndex = layer.load(2);
        $.ajax({
          url:baseUrl + "dq/ov/getById",
          type:"POST",
          data:{videoId: vId},
          dataType:"json",
          success: function(res){
            layer.close(loadIndex);
            if (res.code === 0) {
                var mData=res.data;
                admin.open({
                    type: 1,
                    fixed: true,
                    offset: 'auto',
                    area: '745px',
                    title: '编辑高架视频',
                    content: $('#userEditDialog').html(),
                    success: function (layero, dIndex) {
                        if(mData){
                            var formData=mData;
                        }
                        // 回显表单数据
                        form.val('userEditForm', formData);
                        // 表单提交事件
                        form.on('submit(userEditSubmit)', function (data) {
                            if( (data.field.baiduLng&&data.field.baiduLat) || (data.field.gpsLng&&data.field.gpsLat) ){
                                var loadIndex = layer.load(2);
                                $.ajax({
                                  url:mData ? baseUrl + "dq/ov/save": baseUrl + "dq/ov/save",
                                  type:"POST",
                                  data:data.field,
                                  dataType:"json",
                                  success: function(res){
                                    layer.close(loadIndex);
                                    if (res.code === 0) {
                                        layer.close(dIndex);
                                        layer.msg(res.msg, {icon: 1});
                                    } else {
                                        layer.msg(res.msg, {icon: 2});
                                    }
                                  }
                                })
                            }else{
                                layer.alert('请至少输入一组经纬度');
                            }
                            return false;
                        });
                    }
                });
            } else {
                layer.msg(res.msg, {icon: 2});
            }
          }
        })
    });
}