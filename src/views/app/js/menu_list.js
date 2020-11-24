var setting = {
	async : {
		enable : true,
		url : URL_appMenu_tree,
		dataFilter : filter
	},
	check : {
		enable : false
	},
	data : {
		simpleData : {
			enable : true,
			idKey : 'id',
			pIdKey : 'parent_id'
		},
		key : {
			name : 'name',
			title : 'name'
		}
	},
	callback : {
		onClick : onClick,
		beforeAsync: beforeAsync,
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
	$('#sortNum').val(treeNode.sort_num);
	$('#menuUrl').val(treeNode.menu_url);
	$('#menuIcon').val(treeNode.menu_icon);
	$('#ishavechild').val(treeNode.ishavechild);
	$('#winName').val(treeNode.win_name);
	$('#itemClass').val(treeNode.item_class);
	//searchPrivilege();
}

function beforeAsync() {
	curAsyncCount++;
}

function onAsyncSuccess(event, treeId, treeNode, msg) {
	curAsyncCount--;
	if (curStatus == 'expand') {
		expandNodes(treeNode.children);
	} else if (curStatus == 'async') {
		asyncNodes(treeNode.children);
	} else{
		var zTree = $.fn.zTree.getZTreeObj('menuTree');
		expandNodes(zTree.getNodes());
	}

	if (curAsyncCount <= 0) {
		if (curStatus != 'init' && curStatus != '') {
			asyncForAll = true;
		}
		curStatus = '';
	}
}
function expandNodes(nodes) {
	if (!nodes) return;
	curStatus = 'expand';
	var zTree = $.fn.zTree.getZTreeObj('menuTree');
	for (var i=0, l=nodes.length; i<l; i++) {
		//zTree.expandNode(nodes[i], true, false, false);
		/*if (nodes[i].isParent && nodes[i].zAsync) {
			expandNodes(nodes[i].children);
		} else {
			goAsync = true;
		}*/
	}
}

function asyncNodes(nodes) {
	if (!nodes) return;
	curStatus = 'async';
	var zTree = $.fn.zTree.getZTreeObj('menuTree');
	for (var i=0, l=nodes.length; i<l; i++) {
		if (nodes[i].isParent && nodes[i].zAsync) {
			asyncNodes(nodes[i].children);
		} else {
			goAsync = true;
			zTree.reAsyncChildNodes(nodes[i], 'refresh', true);
		}
	}
}
var setting2 = {
	async : {
		enable : true,
		url : URL_appMenu_tree,
		dataFilter : filter
	},
	check : {
		enable : false
	},
	data : {
		simpleData : {
			enable : true,
			idKey : 'id',
			pIdKey : 'parent_id'
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
var menuTree;
var menuTreeList;
var curStatus = 'init', curAsyncCount = 0, asyncForAll = false,
goAsync = false;
$(function() {
	// 获取菜单列表
	menuTree = $.fn.zTree.init($('#menuTree'), setting);
	
	layui.use('form', function() {
		var form = layui.form;
		// 监听提交
		form.on('submit(btnSave)', function(data) {
			//layer.msg(JSON.stringify(data.field));
			save();
			return false;
		});
	});
});

function showList() {
	menuTreeList = $.fn.zTree.init($('#menuTreeList'), setting2);
	var parent = $('#parentName');
	var parentOffset = $('#parentName').offset();
	$('#parentList').slideDown('fast');
	$('body').bind('mousedown', onBodyDown);
}

function onBodyDown(event) {
	if (!(event.target.id == 'parentList' || $(event.target).parents(
			'#parentList').length > 0)) {
		$('#parentList').fadeOut('fast');
		$('body').unbind('mousedown', onBodyDown);
	}
}
	
function setRoot() {
	$('#parentId').val(0);
	$('#parentName').val('无');
}

function add(){
	$('#form1')[0].reset();
	$('#menuId').val('');
	$('#parentId').val('');
}

function save() {
	$.ajax({
		url : URL_appMenu_save,
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
					//刷新树
					menuTree.reAsyncChildNodes(null, 'refresh');
					//刷新按钮
					//searchPrivilege();
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
			url : URL_appMenu_del,
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
						//刷新树
						menuTree.reAsyncChildNodes(null, 'refresh');
						//刷新按钮
						//searchPrivilege();
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