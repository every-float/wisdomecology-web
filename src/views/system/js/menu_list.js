var iconPicker;
layui.use(['iconPicker'], function() {
	iconPicker = layui.iconPicker;
	iconPicker.render({
		// 选择器，推荐使用input
		elem : '#iconPicker',
		// 数据类型：fontClass/unicode，推荐使用fontClass
		type : 'fontClass',
		// 是否开启搜索：true/false
		search : true,
		// 点击回调
		click : function(data) {
			$('#menuIcon').val(data.icon);
			//console.log(data);
		}
	});
	//默认选中
	iconPicker.checkIcon('iconPicker', '');
});

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
	$('#menuId').val(treeNode.id);
	$('#menuName').val(treeNode.name);
	$('#parentId').val(pId);
	$('#parentName').val(pName);
	$('#sortNum').val(treeNode.sortNum);
	$('input[name="isDefault"]:radio[value="'+treeNode.isDefault+'"]').prop('checked',true);
	$('#menuIcon').val(treeNode.menuIcon);
	$('#menuType').val(treeNode.menuType);
	//默认选中
	iconPicker.checkIcon('iconPicker', treeNode.menuIcon==null?'':treeNode.menuIcon);
	layui.form.render();
	searchPrivilege();
}

function onAsyncSuccess(event, treeId, treeNode, msg) {
	layer.closeAll('loading');
}

/*********下拉选择父节点**********/
var setting2 = {
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
		onClick : onClick2
	}
};
function onClick2(event, treeId, treeNode, clickFlag) {
	$('#parentId').val(treeNode.id);
	$('#parentName').val(treeNode.name);
	$('#parentList').fadeOut('fast');
}

var form;
var menuTree;
var menuTreeList;
var zNodes=[];
$(function() {
	layui.use(['form'], function() {
		form = layui.form;
		
		//初始化
		initParamInfo();
		
		// 监听提交
		form.on('submit(btnSave)', function(data) {
			//layer.msg(JSON.stringify(data.field));
			save();
			return false;
		});
		// 监听select
		form.on('select(moduleList)', function(data){
			// 获取菜单列表
			layer.load(2, {shade: 0.6});
			var code = $(data.elem).find("option:selected").attr("data-code");
			$('#moduleCode').val(code);
			$('#moduleId').val(data.value);
			//加载树
			initMenuTree(code);
			//清除表单数据
			$('#form1')[0].reset();
			$('#menuId').val('');
			$('#parentId').val(code);
			//默认选中
			iconPicker.checkIcon('iconPicker', '');
			//刷新按钮
			searchPrivilege();
		});
	});
});

function initMenuTree(moduleCode){
	$.ajax({
		url : URL_menu_moduleMenuList,
		data : {
			moduleCode: moduleCode
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
				menuTree = $.fn.zTree.init($('#menuTree'), setting, zNodes);
				//初始化下拉菜单
				menuTreeList = $.fn.zTree.init($('#menuTreeList'), setting2, zNodes);
			}
		},
		complete: function () {
			layer.closeAll('loading');
		}
	});
}

function initParamInfo(){
	$.ajax({
		url : URL_menu_initParamInfo,
		data : {},
		type : "post",
		dataType : "json",
		beforeSend: function() {
			// loading show
			layer.load(2, {shade: 0.6});
		},
		success : function(res) {
			//alert(JSON.stringify(res));
			if(res.code==0){
				var list = res.data.list_module;
				var option = '<option value=""></option>';
				for (var i = 0; i < list.length; i++) {
					option += '<option value="'+list[i].value+'" data-code="'+list[i].code+'">'+list[i].name+'</option>';
				}
				$('#moduleList').html(option);
				
				form.render('select');
				
			}
		},
		complete: function () {
			layer.closeAll('loading');
		}
	});
}

function showList() {
	var parent = $('#parentName');
	var parentOffset = $('#parentName').offset();
	$('#parentList').slideDown('fast');
	$('body').bind('mousedown', onBodyDown);
}

function onBodyDown(event) {
	if (!(event.target.id == 'parentList' || $(event.target).parents('#parentList').length > 0)) {
		$('#parentList').fadeOut('fast');
		$('body').unbind('mousedown', onBodyDown);
	}
}
	
function setRoot() {
	$('#parentId').val($('#moduleCode').val());
	$('#parentName').val('无');
}

function add(){
	$('#form1')[0].reset();
	$('#menuId').val('');
	$('#parentId').val($('#moduleCode').val());
	$('#moduleId').val($('#moduleList').val());
	//默认选中
	iconPicker.checkIcon('iconPicker', '');
}

function save() {
	if($('#parentId').val()==''){
		$('#parentId').val($('#moduleCode').val());
	}
	$.ajax({
		url : URL_menu_save,
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
					$('#menuId').val('');
					$('#form1')[0].reset();
					//加载树
					initMenuTree($('#moduleCode').val());
					//刷新按钮
					searchPrivilege();
					//默认选中
					iconPicker.checkIcon('iconPicker', '');
				});
			}else{
				layer.msg(res.msg);
			}
		},
		complete: function () {
			layer.closeAll('loading');
		}
	});
}
function del(){
	var zTree = $.fn.zTree.getZTreeObj('menuTree'),
	nodes = zTree.getSelectedNodes(),
	treeNode = nodes[0];
	if (nodes.length == 0) {
		layer.alert('请先选择一个节点', {icon: 2});
		return;
	}
	layer.confirm('确认删除该菜单吗?', {icon: 3, title:'提示'}, function(index){
		layer.close(index);
		$.ajax({
			url : URL_menu_del,
			data : {
				'pid':nodes[0].id
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
						$('#menuId').val('');
						$('#form1')[0].reset();
						//加载树
						initMenuTree($('#moduleCode').val());
						//刷新按钮
						searchPrivilege();
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