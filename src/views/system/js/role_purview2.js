
/**
 * 子系统权限
 * @returns
 */
var form;
$(function() {
	layui.use(['form'], function() {
		form = layui.form;
		
		roleId = $.getUrlParam('roleId');
		if(roleId != null){
			///初始化数据
			$('#roleId').val(roleId);
		}
		
		initParamInfo();
		
		// 监听提交
		form.on('submit(btnSave)', function(data) {
			//layer.msg(JSON.stringify(data.field));
			save();
			return false;
		});
	});
});

function initParamInfo(){
	$.ajax({
		url : URL_role_initParamInfo2,
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
				var list = res.data.list_module;
				var roleModules = res.data.roleModules;
				var ss = '';
				for (var i = 0; i < list.length; i++) {
					var m = list[i];
					ss += '<input type="checkbox" name="modules" value="'+m.code +'" title="'+m.name +'" lay-skin="primary" ';
					if(roleModules.indexOf(m.code)>-1){
						ss += ' checked';
					}
					ss += '>';
				}
				$('#moduleList').html(ss);
				
				form.render('checkbox');
				
			}
		},
		complete: function () {
			layer.closeAll('loading');
		}
	});
}

function getCheckValue() {
	var result = "[";
	$("input:checkbox[name='modules']:checked").each(function(i){
		result += "{'id':'"+$(this).val()+"','type':'module'},";
	});
	if(result!="[")
		result = result.substring(0, result.lastIndexOf(","));
	result += "]";
	return result;
}

function checkForm(){
	$('#btnSave').click();
}

function save(){
	var btns = getCheckValue();
	$('#btn_json').val(btns);
	$.ajax({
		url : URL_role_savePurview2,
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
			}else{
				parent.layer.msg(res.msg);
			}
		},
		complete: function () {
			parent.layer.closeAll('loading');
		}
	});
}
