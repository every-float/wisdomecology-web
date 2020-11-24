
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
    videolist("");
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
    layui.use(['layer', 'dataGrid', 'element', 'dropdown'], function () {
        var $ = layui.jquery;
        var layer = layui.layer;
        var dataGrid = layui.dataGrid;
        // 项目
        $.get('json/data-grid.json', function (res) {
            if(res.data.length>0){
                dataGrid.render({
                    elem: '#demoCardList1',
                    templet: '#demoCardItem1',
                    data: res.data,
                    page: {limit: 8, limits: [8, 16, 24, 32, 40]}
                });
                dataGrid.on('item(demoCardList1)', function (obj) {
                    //layer.msg('点击了第' + (obj.index + 1) + '个');
                    // alert(JSON.stringify(obj));
                    top.layer.open({
                        type : 1,
                        title : '视频详情',
                        shadeClose : true,
                        shade : 0.6,
                        maxmin : true,
                        area : [ '960px', '580px' ],
                        content : '<div>暂无信息</div>'
                    });
                });
            }else{
                $('#demoCardList1').html('暂无数据');
            }
        });
    });
}
