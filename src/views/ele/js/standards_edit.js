var standardsId = $.getUrlParam('standardsId');
var $columnCode;
$(function() {
	layui.use(['form','xmSelect','laydate'], function() {
		var form = layui.form;

		$columnCode = xmSelect.render({
			el: '#columnCode',
			name: 'columnCode',
			filterable: true,
			data: []
		});

		initParamInfo();
		layui.laydate.render({ 
			elem: '#publicityTime'
			,type: 'datetime'
			,trigger: 'click'
		});
		form.on('switch(isRedirect)', function(data){
			if(data.elem.checked){
				$('#urlDiv').css("display", "block");
				$('#contDiv').css("display", "none");
			}else{
				$('#urlDiv').css("display", "none");
				$('#contDiv').css("display", "block");
			}
		});
	});
});

function checkForm(){
	$('#btnSave').click();
}

function initParamInfo(){
	$.ajax({
		url : URL_standards_initParamInfo,
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
				var list = res.data.list_column;
				var arr = new Array();
				for (var i = 0; i < list.length; i++) {
					arr[i] = {"name": list[i].name, "value": list[i].value};
				}

				$columnCode.update({
					data: arr,
					autoRow: true,
				});
				
				if(standardsId!=null){
					///初始化数据
					initDataInfo();
				}
			}
		},
		complete: function () {
			layer.close(this.layerIndex);
		}
	});
}
function initDataInfo(){
	$.ajax({
		url : URL_standards_detailInfo,
		data : {
			standardsId: standardsId
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
					'standardsId': res.data.standardsId,
					'title': res.data.title,
					'isTop': res.data.isTop,
					'publicityTime': new Date(res.data.publicityTime).format("yyyy-MM-dd hh:mm:ss"),
					'columnCode': res.data.columnCode
				});
				
				var columns = new Array();
				if(res.data.columnCode!=null){
					var urs = res.data.columnCode.split(',');
					for (var i = 0; i < urs.length; i++) {
						columns[i] = urs[i];
					}
				}
				//赋值
				$columnCode.setValue(columns);

				form.render('checkbox');
				form.render('select');


				ue.setContent(res.data.content, true);

				var files = res.data.files;
				fu1.uploadPaneledCallBack('files', ObjectParse(files));

			}else{
				
			}
		},
		complete: function () {
			layer.closeAll('loading');
		}
	});
}

function save(){
	$('#columnName').val($columnCode.getValue('nameStr'));

	$('#content').val(ue.getContent());

	$.ajax({
		url : URL_standards_save,
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
