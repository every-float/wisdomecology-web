
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
    searchAreaId = treeNode.id;
    search();
}

function onAsyncSuccess(event, treeId, treeNode, msg) {
    layer.closeAll('loading');
}
var menuTree;
var zNodes=[];
var datalist;
var searchAreaId = "0";
$(function() {
    layui.use(['form'], function() {
        var form = layui.form;

        //加载树
        var parentId = '0';
        initMenuTree(parentId);

        //监听提交
        form.on('submit(formSearch)', function(data){
            search();
            return false;
        });

        initDatagrid();
    });
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
function initDatagrid() {
    layui.use('table', function(){
        datalist = layui.table;
        datalist.render({
            elem : '#dataGrid',
            url : URL_company_list,
            page : true,
            toolbar: '#toolbar',
            cols : [[
                {
                    type : 'checkbox',
                    fixed: 'left'
                }, {
                    field : 'co_name',
                    title : '企业名称',
                    minWidth : 300
                // }, {
                //     field : 'publicity_time',
                //     title : '名录类别',
                //     width : 180
                }, {
                    field : 'industry_name',
                    title : '行业类别',
                    width : 200
                }, {
                    title : '统一社会信用代码',
                    width : 180,
                    templet:function(d){
                        if(d.co_bu_societycode){
                            return d.co_bu_societycode;
                        }else{
                            return "暂无相关信息";
                        }
                    }
                }, {
                    field : 'co_code',
                    title : '组织机构代码',
                    width : 180
                }, {
                    title : '地址',
                    width : 300,
                    templet:function(d){
                        if(d.co_conaddress){
                            return d.co_conaddress;
                        }else{
                            return "暂无相关信息";
                        }
                    }
                // }, {
                //     field : 'create_time',
                //     title : '创建时间',
                //     width : 180,
                //     align : 'center',
                //     templet: '<div>{{ new Date(d.create_time).format("yyyy-MM-dd hh:mm:ss") }}</div>'
                }, {
                    field : '',
                    title : '操作',
                    width : 130,
                    fixed: 'right',
                    align : 'center',
                    toolbar : '#barOpt'
                } ] ]
        });
        //监听工具条
        datalist.on('tool(dataGrid)', function(obj) {
            var data = obj.data;
            if (obj.event === 'edit') {
                //layer.alert('编辑行：<br>' + JSON.stringify(data))
                edit(data.co_id);
            }else if (obj.event === 'detail') {
                detail(data.co_id);
            }
        });
    });
};

//得到查询的参数
function queryParams(params) {
    var temp = {
        coName : $("#search_title").val(),
        areaId : searchAreaId
    };
    return temp;
}

function search() {
    datalist.reload('dataGrid', {
        where : queryParams()
        ,page: {
            curr: 1 //重新从第 1 页开始
        }
    });
    layer.closeAll('iframe');
}

function reload() {
    datalist.reload('dataGrid', {
        where : queryParams()
    });
    layer.closeAll('iframe');
}

function add(){
    layer.open({
        id:"changeInfo",
        type : 2,
        title : '新增企业信息',
        shadeClose : true,
        shade : 0.6,
        maxmin : true,
        area : [ '90%', '90%' ],
        content : pageUrl+'views/sop/companyInfo_edit.html?coId=',
        btn: ['确定', '关闭'],
        yes: function(index, layero){
            var body = layer.getChildFrame('body', index);
            var iframeWin = window[layero.find('iframe')[0]['name']];
            iframeWin.vm.toSave();
        },
        btn2: function(index, layero){
            layer.close(index);
        }
    });
}

function edit(pid) {
    layer.open({
        id:"changeInfo",
        type : 2,
        title : '修改企业信息',
        shadeClose : true,
        shade : 0.6,
        maxmin : true,
        area : [ '90%', '90%' ],
        content : pageUrl+'views/sop/companyInfo_edit.html?coId='+pid,
        btn: ['确定', '关闭'],
        yes: function(index, layero){
            var body = layer.getChildFrame('body', index);
            var iframeWin = window[layero.find('iframe')[0]['name']];
            iframeWin.vm.toSave();
        },
        btn2: function(index, layero){
            layer.close(index);
        }
    });
}

function detail(pid, url) {
    var cont = pageUrl+'views/sop/companyInfo_detail.html?coId='+pid;
    if(url!=null){
        cont = url;
    }
    layer.open({
        type : 2,
        title : '查看企业详情',
        shadeClose : true,
        shade : 0.6,
        maxmin : true,
        area : [ '1000px', '90%' ],
        content : cont,
        btn: ['关闭'],
        btn2: function(index, layero){
            layer.close(index);
        }
    });
}

function del() {
    var checkStatus = datalist.checkStatus('dataGrid'),data = checkStatus.data;
    if(data.length==0){
        layer.alert('请选择至少1条记录',{icon: 2});
        return;
    }
    var ids = [];
    for (var i = 0; i < data.length; i++) {
        ids[i]= data[i].co_id;
    }
    layer.confirm('确定删除选择的 '+data.length+' 条记录吗 ？', {icon: 3, title:'提示'}, function(index){
        layer.close(index);
        $.ajax({
            type : "post",
            url : URL_company_info_delete,
            data : {
                ids:ids.join(",")
            },
            dataType : "json",
            beforeSend: function() {
                // loading show
                layer.load(2, {shade: 0.6});
            },
            success : function(res) {
                if(res.code==0){
                    layer.msg(res.msg);
                    search();
                }else{
                    layer.msg(res.msg);
                }
            },
            complete: function () {
                layer.closeAll('loading');
            }
        });
    });
}

//一键生成json数据
function makeJson() {
    layer.confirm('确定一键生成json数据吗 ？', {icon: 3, title:'提示'}, function(index){
        layer.close(index);
        $.ajax({
            url:baseUrl + "sop/generateAllJson",
            type:"POST",
            dataType:"json",
            beforeSend: function() {
                layer.load(2, {shade: 0.6});
            },
            success : function(res) {
                if(res.code==0){
                    layer.msg(res.msg);
                }else{
                    layer.msg(res.msg);
                }
            },
            complete: function () {
                layer.closeAll('loading');
            }
        });
    });
}

function getLocation(){
    layui.use('admin', function(){
        var admin = layui.admin;
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
            },
            end:function(){
                $("#changeInfo iframe").contents().find("#baiduLat").val($("#baidu_lat").val());
                $("#changeInfo iframe").contents().find("#baiduLng").val($("#baidu_lng").val());
            }
        });
    })
}
