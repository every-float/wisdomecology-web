var setting_deptPosi = {
	async: {
		enable: true,
		url: URL_position_treeList,
		dataFilter: filterPosi,
		otherParam: { 
			'orgId': function(){
				return $('#orgId').val();
			}
		}
	},
	callback: {
		onClick: onClickPosi,
		onAsyncSuccess: zTreeOnAsyncSuccessPosi
	}
};

function filterPosi(treeId, parentNode, childNodes) {
	if (!childNodes) return null;
	for (var i=0, l=childNodes.length; i<l; i++) {
		childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
	}
	return childNodes;
}

function onClickPosi(event, treeId, treeNode, clickFlag) {
	if(treeNode.stype=="d"){
		alert("请选择岗位");
		return;
	}
	$("#selDeptPosiId").val(treeNode.id);
	$("#selDeptPosiName").val(treeNode.name);
}

function zTreeOnAsyncSuccessPosi(event, treeId, treeNode, msg) {
	layer.closeAll('loading');
}

var deptPosiTree;
var form;
$(document).ready(function(){
	//deptUserTree = $.fn.zTree.init($("#zTreeList"), setting_deptUser);
	
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
			deptPosiTree.reAsyncChildNodes(null, 'refresh');
		});
		
		deptPosiTree = $.fn.zTree.init($("#zTreeList"), setting_deptPosi);
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
				
				form.render('select');
			}
		},
		complete: function () {
			layer.close(this.layerIndex);
		}
	});
}
