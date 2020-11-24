
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

function videolist(areaId,limit,page) {
    //$('#demoCardList1').html('正在加载...');
    layui.use(['laypage', 'dataGrid', 'element'], function () {
        var $ = layui.jquery;
        var laypage = layui.laypage;
        var dataGrid = layui.dataGrid;
        var element = layui.element;

        $.ajax({
            url: URL_sop_video_list + '?areaId=' + areaId,
            data: {
                limit: limit,
                page: page
            },
            type: "post",
            dataType: "json",
            beforeSend: function () {
                // loading show
                layer.load(2, {shade: 0.6});
            },
            success: function (res) {
                //alert(JSON.stringify(res));
                if (res.code == 0) {
                    setHtml(res);
                    initPage(res.count, areaId);
                }
            },
            complete: function () {
                layer.closeAll('loading');
            }
        });
    });

}


        //
        // dataGrid.render({
        //     elem: '#demoCardList1',
        //     templet: '#demoCardItem1',
        //     //data: [],
        //     url: URL_sop_video_list + '?areaId=' + areaId,  // 数据接口
        //     // url: 'json/data-grid.json',  // 数据接口
        //     page: {limit: 8, limits: [8, 16, 24, 32, 40]}
        // });
        // dataGrid.on('item(demoCardList1)', function (obj) {
        //     //layer.msg('点击了第' + (obj.index + 1) + '个');
        //     // alert(JSON.stringify(obj));
        //     var url =  pageUrl+'views/sop/webVideo.html?vUrl='+ obj.data.video_url;
        //     window.open(url,obj.data.video_name,'location=no,width=650,height=490,menubar=no');
        //     // top.layer.open({
        //     //     type : 2,
        //     //     title : '视频详情',
        //     //     shadeClose : true,
        //     //     shade : 0.6,
        //     //     maxmin : true,
        //     //     area : [ '960px', '580px' ],
        //     //     content : pageUrl+'views/dq/ohvideo.html?szIp='+obj.data.ip+"&szPort="+obj.data.port+"&szUsername="+obj.data.user_name+"&szPassword="+obj.data.password
        //     // });
        // });


function setHtml(res){
    var list = res.data;
    $('#video1').html('');
    for (var i = 0; i < list.length; i++) {
        var title = list[i].video_name;
        var coll = '\n' +
            '                            <div class="layui-colla-item">\n' +
            '                            <h2 class="layui-colla-title">'+title+'</h2>\n' +
            '                            <div class="layui-colla-content">' +
            '<div class="layui-row layui-col-space30" id="demoCardList_'+i+'">' +
            '</div>' +
            '</div>\n' +
            ' </div>\n';
        $('#video1').append(coll);

        layui.dataGrid.render({
            elem: '#demoCardList_'+i,
            templet: '#demoCardItem1',
            data: list[i].children,
            // url: URL_sop_video_list + '?areaId=' + areaId,  // 数据接口
            // url: 'json/data-grid.json',  // 数据接口
            //page: {limit: 8, limits: [8, 16, 24, 32, 40]}
        });
        layui.dataGrid.on('item(demoCardList_'+i+')', function (obj) {
            //layer.msg('点击了第' + (obj.index + 1) + '个');
            //alert(JSON.stringify(obj));
            var url = pageUrl + 'views/sop/webVideo.html?vUrl=' + encodeURI(obj.data.video_url);
            window.open(url, encodeURI(obj.data.video_name), 'location=no,width=650,height=490,menubar=no');
        });
    }
    layui.element.render('collapse');
}

function initPage(count, areaId){
    layui.laypage.render({
        elem: 'videoPage1' //注意，这里的 test1 是 ID，不用加 # 号
        , limit: 8
        , count: count //数据总数，从服务端得到
        , jump: function (obj, first) {
            //obj包含了当前分页的所有参数，比如：
            console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
            console.log(obj.limit); //得到每页显示的条数

            //首次不执行
            if (!first) {
                //do something
                $.ajax({
                    url: URL_sop_video_list + '?areaId=' + areaId,
                    data: {
                        limit: obj.limit,
                        page: obj.curr
                    },
                    type: "post",
                    dataType: "json",
                    beforeSend: function () {
                        // loading show
                        layer.load(2, {shade: 0.6});
                    },
                    success: function (res) {
                        //alert(JSON.stringify(res));
                        if (res.code == 0) {
                            setHtml(res);
                        }
                    },
                    complete: function () {
                        layer.closeAll('loading');
                    }
                });
            }
        }
    });
}
