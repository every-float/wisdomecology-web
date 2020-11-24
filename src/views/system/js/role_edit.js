var roleId;
var form;
$(function() {
	layui.use(['form'], function() {
		form = layui.form;
		
		roleId = $.getUrlParam('roleId');
		if(roleId != null){
			///初始化数据
			initDataInfo();
		}
		// 监听提交
		form.on('submit(btnSave)', function(data) {
			//layer.msg(JSON.stringify(data.field));
			save();
			return false;
		});
	});
});

function checkForm(){
	$('#btnSave').click();
}

function initDataInfo(){
	$.ajax({
		url : URL_role_detailInfo,
		data : {
			roleId: roleId
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
				var form = layui.form;
				// 初始赋值
				form.val('form1', {
					'roleId': res.data.roleId,
					'roleCode': res.data.roleCode,
					'roleName': res.data.roleName,
					'isUse': res.data.isUse,
					'remark': res.data.remark
				});
			}else{
				
			}
		},
		complete: function () {
			layer.closeAll('loading');
		}
	});
}

function save(){
	$.ajax({
		url : URL_role_save,
		data : $('#form1').serialize(),
		type : "post",
		dataType : "json",
		beforeSend: function() {
			// loading show
			parent.layer.load(2, {shade: 0.6});
		},
		success : function(res) {
			if(res.code==0){
				parent.layer.msg(res.msg);
				parent.reload();
			}else{
				parent.layer.msg(res.msg);
			}
		},
		complete: function () {
			parent.layer.closeAll('loading');
		}
	});
}
