
var iframeWin;
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
    searchAreaId=treeNode.id;
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
    });

    //下拉初始化
    initParamInfo();

    initDatagrid();
});

function initParamInfo(){
	$.ajax({
		url : URL_gateInfo_gateInfoType,
		data : {},
		type : "post",
		dataType : "json",
		beforeSend: function() {
			// loading show
			// layer.load(2, {shade: 0.6});
		},
		success : function(res) {
			// alert(JSON.stringify(res));
			if(res.code==0){
				var gateType = res.data.gateType;
				var option_ryz = '<option value=""></option>';
				for (var i = 0; i < gateType.length; i++) {
					option_ryz += '<option value="'+gateType[i].value+'">'+gateType[i].name+'</option>';
				}
				$('#gateType').html(option_ryz);
				layui.form.render('select');
			}else{
				
			}
		},
		complete: function () {
			// layer.closeAll('loading');
		}
	});
}

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
            url : URL_gateInfo_list,
            page : true,
            toolbar: '#toolbar',
            cols : [[
                {
                    type : 'checkbox',
                    fixed: 'left'
                }, {
                    field : 'into_river',
                    title : '入河排污（水）',
                    minWidth : 180,
                    align : 'center'
                }, {
                    field : 'water_name',
                    title : '排入水体名称',
                    width : 200,
                    align : 'center'
                }, {
                    field : 'data_name',
                    title : '闸口分类',
                    width : 150,
                    align : 'center'
                }, {
                    field : 'gps_lng',
                    title : '经度',
                    width : 100,
                    align : 'center'
                }, {
                    field : 'gps_lat',
                    title : '纬度',
                    width : 100,
                    align : 'center'
                }, {
                    field : 'shore',
                    title : '岸别',
                    width : 100,
                    align : 'center'
                    
                }, {
                    field : 'address',
                    title : '详细地址',
                    width : 200,
                    align : 'center'
                }, {
                    field : 'into_way',
                    title : '入河方式',
                    width : 100,
                    align : 'center'
                    
                }, {
                    field : 'legal_duty',
                    title : '责任主体',
                    width : 100,
                    align : 'center'
                    
                }, {
                    field : 'create_time',
                    title : '创建时间',
                    width : 180,
                    align : 'center',
                    templet: '<div>{{ new Date(d.create_time).format("yyyy-MM-dd hh:mm:ss") }}</div>'
                }, {
                    field : '',
                    title : '操作',
                    width : 120,
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
                edit(data.gate_id);
            }else if (obj.event === 'detail') {
                detail(data.gate_id);
            }
        });
    });
};

//得到查询的参数
function queryParams(params) {
    var temp = {
        waterName : $("#search_waterName").val(),
        gateType : $("#gateType").val(),
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
        title : '新增闸口信息',
        shadeClose : true,
        shade : 0.6,
        maxmin : true,
        area : ['95%', '95%'],
        content : pageUrl+'views/we/weGateInfo_edit.html?areaId='+searchAreaId,
        btn: ['确定', '关闭'],
        success:function(layero, index){
            iframeWin = window[layero.find('iframe')[0]['name']];
        },
        yes: function(index, layero){
            var body = layer.getChildFrame('body', index);
            var param = body.find('#form1').serialize();
			$.ajax({
				url : URL_gateInfo_save,
				data : param,
				type : 'post',
				dataType : 'json',
				beforeSend: function() {
					// loading show
					layer.load(2, {shade: 0.6});
				},
				success : function(res) {
					if(res.code==0){
						layer.msg(res.msg, {icon:1});
						layer.close(index);
						search();
					}else{
						layer.msg(res.msg, {icon:2});
					}
				},
				complete: function () {
					layer.closeAll('loading');
				}
			});
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
        title : '修改闸口信息',
        shadeClose : true,
        shade : 0.6,
        maxmin : true,
        area : [ '95%', '95%' ],
        content : pageUrl+'views/we/weGateInfo_edit.html?gateId='+pid+'&areaId='+searchAreaId,
        btn: ['确定', '关闭'],
        success:function(layero, index){
            iframeWin = window[layero.find('iframe')[0]['name']];
        },
        yes: function(index, layero){
            var body = layer.getChildFrame('body', index);
            var param = body.find('#form1').serialize();
			$.ajax({
				url : URL_gateInfo_save,
				data : param,
				type : 'post',
				dataType : 'json',
				beforeSend: function() {
					// loading show
					layer.load(2, {shade: 0.6});
				},
				success : function(res) {
					if(res.code==0){
						layer.msg(res.msg, {icon:1});
						layer.close(index);
						search();
					}else{
						layer.msg(res.msg, {icon:2});
					}
				},
				complete: function () {
					layer.closeAll('loading');
				}
			});
        },
        btn2: function(index, layero){
            layer.close(index);
        }
    });
}

function detail(pid) {
    layer.open({
        type : 2,
        title : '查看闸口信息',
        shadeClose : true,
        shade : 0.6,
        maxmin : true,
        area : [ '90%', '90%' ],
        content : pageUrl+'views/we/weGateInfo_detail.html?gateId='+pid,
        btn: ['关闭'],
        success: function(layero, index){
			var body = layer.getChildFrame('body', index);
			iframeWin = window[layero.find('iframe')[0]['name']];
			//var param = body.find('#form1').serialize();
			
		},
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
        ids[i]= data[i].gate_id;
    }
    layer.confirm('确定删除选择的 '+data.length+' 条记录吗 ？', {icon: 3, title:'提示'}, function(index){
        layer.close(index);
        $.ajax({
            url : URL_gateInfo_del,
            data : {
                "ids":ids.toString()
            },
            type : "post",
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
