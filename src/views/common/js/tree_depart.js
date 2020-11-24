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
	$("#selDeptId").val(treeNode.id);
	$("#selDeptName").val(treeNode.name);
}
var departTree;
var form;
$(document).ready(function(){
	//$.fn.zTree.init($("#orgTreeList"), setting_org);
	
	layui.use(['form'], function() {
		form = layui.form;
		//初始化
		initParamInfo();
		// 监听select
		form.on('select(orgList)', function(data){
			// 获取菜单列表
			layer.load(2, {shade: 0.6});
			$('#orgId').val(data.value);
			//刷新树
			departTree.reAsyncChildNodes(null, 'refresh');
		});
		
		departTree = $.fn.zTree.init($("#zTreeList"), setting_dept);
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
}
