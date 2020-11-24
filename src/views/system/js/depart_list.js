var setting_dept = {
	async: {
		enable: true,
		url: URL_depart_treeList,
		dataFilter: filterDept,
		otherParam: { 
			'orgId': function(){
				return $('#orgId').val();
			}
		}
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
		onClick: onClickDept,
		onAsyncSuccess: zTreeOnAsyncSuccessDept
	}
	// view: {
	// 	addDiyDom: addDiyDom
	// }
};

function filterDept(treeId, parentNode, childNodes) {
	if (!childNodes) return null;
	for (var i=0, l=childNodes.length; i<l; i++) {
		childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
	}
	return childNodes;
}

function zTreeOnAsyncSuccessDept(event, treeId, treeNode, msg) {
	//var treeObj = $.fn.zTree.getZTreeObj("zTreeList");
	//$("#parentDepartName").val(node.name);
	layer.closeAll('loading');
}

function onClickDept(event, treeId, treeNode, clickFlag) {
	var pId = '';
	var pName = '';
	if(treeNode.getParentNode()!=null){
		pId = treeNode.getParentNode().id;
		pName = treeNode.getParentNode().name;
	}
	$('#departId').val(treeNode.id);
	$('#departName').val(treeNode.name);
	$('#departCode').val(treeNode.departCode);
	$('#parentDepartId').val(pId);
	$('#parentDepartName').val(pName);
	$('#sortNum').val(treeNode.sortNum);
	$('#departType').val(treeNode.departType);
	$('#contact').val(treeNode.contact);
	$('#phone').val(treeNode.phone);
	$('#location').val(treeNode.location);
	$('#remark').val(treeNode.remark);
	//默认选中
	layui.form.render();
	searchPosition();
}

function addDiyDom(treeId, treeNode) {
	if(treeNode.getParentNode() == null){
		var aObj = $("#" + treeNode.tId + "_a");
		if ($("#diyBtn_"+treeNode.id).length>0) return;
		var editStr = "<span id='diyBtn_space_" +treeNode.id+ "' > </span>"
			+ "<button type='button' class='layui-btn layui-btn-xs' id='diyBtn_" + treeNode.id
			+ "' title='"+treeNode.name+"' onfocus='this.blur();'>查看人员组织</button>";
		aObj.append(editStr);
		var btn = $("#diyBtn_"+treeNode.id);
		if (btn) btn.bind("click", function(){
			var orgId = treeNode.id;
			viewTree(orgId);
		});
	}
};

function viewTree(orgId){
	layer.open({
		type : 2,
		title : '人员组织',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '600px', '90%' ],
		content: pageUrl + 'views/common/tree_departUser.html?orgId='+orgId,
		btn: ['关闭'],
		btn2: function(index, layero){
			layer.close(index);
		}
	});
	
}

var departTree;
$(document).ready(function(){
	//$.fn.zTree.init($("#orgTreeList"), setting_org);
	
	//departTree = $.fn.zTree.init($("#zTreeList"), setting_dept);
});
$(function() {
	layui.use(['form'], function() {
		var form = layui.form;
		
		// 监听select
		form.on('select(orgList)', function(data){
			// 获取菜单列表
			layer.load(2, {shade: 0.6});
			$('#orgId').val(data.value);
			//刷新树
			departTree.reAsyncChildNodes(null, 'refresh');
			//清除表单数据
			$('#form1')[0].reset();
			$('#departId').val('');
		});
		
		departTree = $.fn.zTree.init($("#zTreeList"), setting_dept);
	});
	
	initParamInfo();
});

function setDepartRoot() {
	$('#parentDepartId').val('0');
	$('#parentDepartName').val('无');
}

function add(){
	$('#form1')[0].reset();
	$('#departId').val('');
	$('#parentDepartId').val('0');
}


function initParamInfo(){
	layui.use(['form'], function() {
		var form = layui.form;
		// 监听提交
		form.on('submit(btnSave)', function(data) {
			//layer.msg(JSON.stringify(data.field));
			save();
			return false;
		});
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
					
					var list_bmxz = res.data.list_bmxz;
					var option_bmxz = '<option value=""></option>';
					for (var i = 0; i < list_bmxz.length; i++) {
						option_bmxz += '<option value="'+list_bmxz[i].value+'">'+list_bmxz[i].name+'</option>';
					}
					$('#departType').html(option_bmxz);
					
					form.render('select');
				}
			},
			complete: function () {
				layer.close(this.layerIndex);
			}
		});
	});
}

function save(){
	var orgId = $('#orgId').val();
	if(orgId==''){
		layer.alert('请选择一个组织结构！',{icon: 2});
		return;
	}
	$.ajax({
		url : URL_depart_save,
		data : $('#form1').serialize(),
		type : 'post',
		dataType : 'json',
		beforeSend: function() {
			// loading show
			layer.load(2, {shade: 0.6});
		},
		success : function(res) {
			if(res.code==0){
				layer.confirm(res.msg+' 是否刷新信息？', {icon: 3, title:'提示'}, function(index){
					layer.close(index);
					$('#departId').val('');
					$('#parentDepartId').val('0');
					$('#form1')[0].reset();
					//刷新树
					departTree.reAsyncChildNodes(null, 'refresh');
					//刷新按钮
					searchPosition();
				});
			}else{
				layer.msg(res.msg, {icon:2});
			}
		},
		complete: function () {
			layer.closeAll('loading');
		}
	});
}

function showDepartList(orgId){
	layer.open({
		type : 2,
		title : '选择部门',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '380px', '500px' ],
		content: pageUrl+'views/common/tree_depart.html?orgId='+orgId,
		btn: ['确定', '关闭'],
		yes: function(index, layero){
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']];
			//获取选中的部门信息
			var selDeptId = body.find('#selDeptId').val();
			var selDeptName = body.find('#selDeptName').val();
			if(selDeptId==''){
				layer.msg('请选择部门');
				return;
			}
			//赋值
			$('#parentDepartId').val(selDeptId);
			$('#parentDepartName').val(selDeptName);
			
			layer.close(index);
		},
		btn2: function(index, layero){
			layer.close(index);
		}
	});
}

function del(){
	var zTree = $.fn.zTree.getZTreeObj('zTreeList'),
	nodes = zTree.getSelectedNodes(),
	treeNode = nodes[0];
	if (nodes.length == 0) {
		layer.alert('请先选择一个节点', {icon: 2});
		return;
	}
	layer.confirm('确认删除该部门吗?', {icon: 3, title:'提示'}, function(index){
		layer.close(index);
		$.ajax({
			url : URL_depart_del,
			data : {
				'pid': nodes[0].id
			},
			type : 'post',
			dataType : 'json',
			beforeSend: function() {
				// loading show
				layer.load(2, {shade: 0.6});
			},
			success : function(res) {
				if(res.code==0){
					layer.confirm(res.msg+' 是否刷新信息？', {icon: 3, title:'提示'}, function(index){
						layer.close(index);
						$('#departId').val('');
						$('#parentDepartId').val('0');
						$('#form1')[0].reset();
						//刷新树
						departTree.reAsyncChildNodes(null, 'refresh');
						//刷新按钮
						searchPosition();
					});
				}else{
					layer.alert(res.msg);
				}
			},
			complete: function () {
				layer.closeAll('loading');
			}
		});
	});
}

function checkCode(){
	if($('#departCode').val()==''){
		alert('请填写代码！');
		return;
	}
	$.ajax({
		url : URL_depart_checkCode,
		data : {
			code : $('#departCode').val(),
			pk : $('#departId').val()
		},
		type : 'post',
		dataType : 'json',
		beforeSend: function() {
			// loading show
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
}