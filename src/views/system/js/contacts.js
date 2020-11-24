var setting = {
	async: {
		enable: true,
		url: URL_depart_treeList,
		dataFilter: filter,
		otherParam: { 
			'orgId': function(){
				return $('#orgId').val();
			}
		}
	},
	data:{
		simpleData: {
			enable:true,
			idKey: 'id',
			pIdKey: 'parentId',
			rootPId: '1'
		}
	},
	callback: {
		onClick: onClick,
		onAsyncSuccess: zTreeOnAsyncSuccess
	}
};

function filter(treeId, parentNode, childNodes) {
	if (!childNodes) return null;
	for (var i=0, l=childNodes.length; i<l; i++) {
		childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
	}
	return childNodes;
}
function onClick(event, treeId, treeNode, clickFlag) {
	$('#departId').val(treeNode.id);
	search();
}
function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
	var treeObj = $.fn.zTree.getZTreeObj("departTree");
	var node = treeObj.getNodeByParam("id", $('#departId').val());
	
	layer.closeAll('loading');
	
	treeObj.selectNode(node);
	
	initDatagrid();
	

}
var datalist;
$(function() {
	layui.use(['form'], function() {
		var form = layui.form;
		//监听提交
		form.on('submit(formSearch)', function(data){
			search();
			return false;
		});
		//部门
		var departTree = $.fn.zTree.init($('#departTree'), setting);
		//初始化组织
		initParamInfo();
		// 监听select
		form.on('select(orgList)', function(data){
			// 获取菜单列表
			layer.load(2, {shade: 0.6});
			$('#orgId').val(data.value);
			//刷新树
			departTree.reAsyncChildNodes(null, 'refresh');
		});
	});
});

function initParamInfo(){
	$.ajax({
		url : URL_depart_initParamInfo,
		data : {},
		type : "post",
		dataType : "json",
		beforeSend: function() {
			// loading show
			this.layerIndex = layer.load(2, {shade: 0.6});
		},
		success : function(res) {
			//alert(JSON.stringify(res));
			if(res.code==0){
				var list = res.data.list_org;
				var option = '<option value=""></option>';
				for (var i = 0; i < list.length; i++) {
					option += '<option value="'+list[i].value+'">'+list[i].name+'</option>';
				}
				$('#orgList').html(option);

				layui.form.render('select');
			}
		},
		complete: function () {
			layer.close(this.layerIndex);
		}
	});
}

function initDatagrid() {
	layui.use('table', function(){
		datalist = layui.table;
		datalist.render({
			elem : '#dataGrid',
			url : URL_userInfo_positionList,
			where : {
				departId: $('#departId').val()
			},
			page : true,
			cols : [ [ // 表头
			{
				type : 'numbers'
			},{
				field : 'user_name',
				title : '用户名/账号'
			}, {
				field : 'real_name',
				title : '姓名'
			}, {
				field : 'sex',
				title : '性别',
				width : 80
			}, {
				field : 'depart_name',
				title : '部门'
			}, {
				field : 'phone',
				title : '电话'
			}, {
				field : 'email',
				title : '邮箱'
			} ] ]
		});
	});
};

function search() {
	datalist.reload('dataGrid', {
		where : { // 设定异步数据接口的额外参数，任意设
			names : $("#search_name").val(),
			departId: $("#departId").val()
		}
	});
}

function reset1() {
	datalist.reload('dataGrid', {
		where : { // 设定异步数据接口的额外参数，任意设
			names : '',
			departId: ''
		}
	});
}
