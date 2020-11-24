var datalistInte;
var datalist;
var inteId="";
$(function(){
	initDatagrid();
});
/////////////////////////////加载树形数据接口
var setting_inte = {
	async: {
		enable: true,
		url: URL_appinteRole_tree,
		dataFilter: filterInte
	},
	data:{
		simpleData: {
			enable:true,
			idKey: "id",
			pIdKey: "pId",
			rootPId: "1"
		}
	},
	callback: {
		onClick: onClickInte,
		onAsyncSuccess: zTreeOnAsyncSuccessInte
	}
};

function filterInte(treeId, parentNode, childNodes) {
	if (!childNodes) return null;
	for (var i=0, l=childNodes.length; i<l; i++) {
		childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
	}
	return childNodes;
}

function zTreeOnAsyncSuccessInte(event, treeId, treeNode, msg) {
	//var treeObj = $.fn.zTree.getZTreeObj("zTreeList");
	//$("#parentDepartName").val(node.name);
}

function onClickInte(event, treeId, treeNode, clickFlag) {
	inteId = treeNode.id;
	search();
}
var inteTree;
$(document).ready(function(){
	inteTree = $.fn.zTree.init($("#zTreeList"), setting_inte);
});

function initDatagrid() {
	layui.use('table', function(){
		datalist = layui.table;
		datalist.render({
			elem : '#dataGrid',
			url : URL_appinteRole_list,
			page : true,
			toolbar: '#toolbar',
			cols : [ [ // 表头
			{
				type : 'checkbox',
				fixed: 'left'
			}, {
				field : 'role_name',
				title : '角色名称',
				width: 200
			}, {
				field : 'access_level',
				title : '访问级别',
				width : 100
			}, {
				field : 'access_levelCN',
				title : '访问级别名称',
				width : 230
			}, {
				field : 'create_time',
				title : '创建时间',
				width : 180,
				templet: '<div>{{ new Date(d.create_time).format("yyyy-MM-dd hh:mm:ss") }}</div>'
			}, {
				field : '',
				title : '操作',
				width : 80,
				fixed: 'right',
				toolbar : '#barOpt'
			} ] ]
		});
		//监听工具条
		datalist.on('tool(dataGrid)', function(obj) {
			var data = obj.data;
			if (obj.event === 'edit') {
				//layer.alert('编辑行：<br>' + JSON.stringify(data))
				edit(data.id);
			}
		});
	});
};

//得到查询的参数
function queryParams(params) {
	var temp = { 
		roleName : $("#search_roleName").val(),
		inteId: inteId
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
	if(inteId==""){
		layer.alert('请选择1个数据接口！', {icon: 2, title:'提示'});
		return;
	}
	layer.open({
		type : 2,
		title : '新增数据权限',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '520px', '500px' ],
		content : pageUrl+"views/app/inteRole_edit.html?inteId="+inteId,
		btn: ['保存', '关闭'],
		yes: function(index, layero){
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']];
			//提交
			iframeWin.checkForm();
			
		},
		btn2: function(index, layero){
			layer.close(index);
		}
	});
}

function edit(pid) {
	layer.open({
		type : 2,
		title : '修改数据权限',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '520px', '500px' ],
		content : pageUrl+"views/app/inteRole_edit.html?id="+pid,
		btn: ['保存', '关闭'],
		yes: function(index, layero){
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']];
			//提交
			iframeWin.checkForm();
			
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
		ids[i]= data[i].id;
	}
	layer.confirm('确定删除选择的 '+data.length+' 条记录吗 ？', {icon: 3, title:'提示'}, function(index){
		layer.close(index);
		$.ajax({
			url : URL_appinteRole_del,
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
