var datalistType;
var datalist;
var typeCode="";
var typeId="";
$(function(){
	initDatagrid();
});
/////////////////////////////加载树形数据字典类型
var setting_type = {
	async: {
		enable: true,
		url: baseUrl+'/system/dataInfo/getTypeList',
		dataFilter: filterType
	},
	data:{
		simpleData: {
			enable:true,
			idKey: "id",
			pIdKey: "parentId",
			rootPId: "1"
		}
	},
	callback: {
		onClick: onClickType,
		onAsyncSuccess: zTreeOnAsyncSuccessType
	}
};

function filterType(treeId, parentNode, childNodes) {
	if (!childNodes) return null;
	for (var i=0, l=childNodes.length; i<l; i++) {
		childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
	}
	return childNodes;
}

function zTreeOnAsyncSuccessType(event, treeId, treeNode, msg) {
	//var treeObj = $.fn.zTree.getZTreeObj("zTreeList");
	//$("#parentDepartName").val(node.name);
}

function onClickType(event, treeId, treeNode, clickFlag) {
	typeCode = treeNode.code;
	typeId = treeNode.id;
	search();
}
var typeTree;
$(document).ready(function(){
	typeTree = $.fn.zTree.init($("#zTreeList"), setting_type);
});

function initDatagrid() {
	layui.use('table', function(){
		datalist = layui.table;
		datalist.render({
			elem : '#dataGrid',
			url : baseUrl+'/system/dataInfo/getPageList',
			page : true,
			toolbar: '#toolbar',
			cols : [ [ // 表头
			{
				type : 'checkbox',
			}, {
				field : 'data_name',
				title : '数据名称'
			}, {
				field : 'data_val',
				title : '数据值'
			}, {
				field : 'sort_num',
				title : '排序',
				width: 100
			}, {
				field : 'attribute1',
				title : '属性1'
			}, {
				field : 'create_time',
				title : '创建时间',
				width : 180,
				templet: '<div>{{ new Date(d.create_time).format("yyyy-MM-dd hh:mm:ss") }}</div>'
			}, {
				field : '',
				title : '操作',
				width : 80,
				toolbar : '#barOpt'
			} ] ]
		});
		//监听工具条
		datalist.on('tool(dataGrid)', function(obj) {
			var data = obj.data;
			if (obj.event === 'edit') {
				//layer.alert('编辑行：<br>' + JSON.stringify(data))
				edit(data.data_id);
			}
		});
	});
};

//得到查询的参数
function queryParams(params) {
	var temp = { 
		typeName : $("#search_typeName").val(),
		typeCode: typeCode
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

function reload2() {
	window.location.reload();
}

function add(){
	layer.open({
		type : 2,
		title : '新增数据信息',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '50%', '90%' ],
		content : pageUrl+"views/system/dataInfo_edit.html?typeCode="+typeCode,
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
		title : '修改数据信息',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '50%', '90%' ],
		content : pageUrl+"views/system/dataInfo_edit.html?dataId="+pid,
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
		ids[i]= data[i].data_id;
	}
	layer.confirm('确定删除选择的 '+data.length+' 条记录吗 ？', {icon: 3, title:'提示'}, function(index){
		layer.close(index);
		$.ajax({
			url : baseUrl+"/system/dataInfo/del",
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
					reload();
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
/////////////////////////类型

function addType(){
	layer.open({
		type : 2,
		title : '新增数据类型',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '520px', '450px' ],
		content : pageUrl+"views/system/dataType_edit.html",
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

function editType() {
	if(typeId==''){
		layer.alert('请选择1条记录',{icon: 2});
		return;
	}
	layer.open({
		type : 2,
		title : '修改数据类型',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '520px', '450px' ],
		content : pageUrl+"views/system/dataType_edit.html?typeId="+typeId,
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

function delType() {
	if(typeId==''){
		layer.alert('请选择至少1条记录',{icon: 2});
		return;
	}
	var ids = [];
	ids[0]= typeId;
	layer.confirm('确定删除选择的记录吗 ？', {icon: 3, title:'提示'}, function(index){
		layer.close(index);
		$.ajax({
			url : baseUrl+"/system/dataType/del",
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
					reload2();
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

