var companyId = window.location.href.split("=")[1];
$(function() {
	
	layui.use(['form','laydate'], function() {
		var form = layui.form;

		form.on('select(areaId)', function(data){
			// console.log(data.value,this.innerText);//得到被选中的值
			// console.log(data.elem); //得到select原始DOM对象
			$('#areaName').val(this.innerText);
		})

		form.render();

	});
		//所属区域
		getTownList();

		//下拉初始化
		initParamInfo();

		initDataInfo()
});

function getTownList(){
	$.ajax({
		type:"get",
		url:URL_gb_areaTree,
		dataType:"json",
		data:{
			parentId:"120111"
		},
		success:function(ret){
			if(ret.code == 0){
				var townList = ret.data.tree;
				var option_ryz = '<option value=""></option>';
				for (var i = 0; i < townList.length; i++) {
					option_ryz += '<option value="'+townList[i].id+'">'+townList[i].name+'</option>';
				}

				$('#areaId').html(option_ryz);
			
				layui.form.render('select');
			}else{

			}
			
		},
		error:function(){
			layer.msg("网络访问出错，未能获取到详情！");
		},
		complete:function(){

		}
	})
}

// 获取地理位置
function getLocation(){
	parent.getLocation();
}

function initParamInfo(){
	$.ajax({
		url : URL_companyInfo_companyInfoType,
		data : {},
		type : "post",
		dataType : "json",
		beforeSend: function() {
			// loading show
			// layer.load(2, {shade: 0.6});
		},
		success : function(res) {
			// alert(JSON.stringify(res));
			if(res.code==0){
				var companyType = res.data.companyType;
				var option_ryz = '<option value=""></option>';
				for (var i = 0; i < companyType.length; i++) {
					option_ryz += '<option value="'+companyType[i].value+'">'+companyType[i].name+'</option>';
				}
				$('#companyType').html(option_ryz);
				layui.form.render('select');
			}else{
				
			}
		},
		complete: function () {
			// layer.closeAll('loading');
		}
	});
}

function initDataInfo(){
	
	$.ajax({
		url : URL_companyInfo_detailInfo,
		data : {
			companyId: companyId
		},
		type : "post",
		dataType : "json",
		beforeSend: function() {
			// loading show
			// layer.load(2, {shade: 0.6});
		},
		success : function(res) {
			//alert(JSON.stringify(res));
			if(res.code==0){
				var form = layui.form;
				// 初始赋值
				form.val('form1', {
					'companyId': res.data.companyId,
					'villageName': res.data.villageName,
					'areaId': res.data.areaId,
					'areaName': res.data.areaName,
					'companyName': res.data.companyName,
					'companyType': res.data.companyType,
					'gpsLng': res.data.gpsLng,
					'gpsLat': res.data.gpsLat,
					'baiduLng': res.data.baiduLng,
					'baiduLat': res.data.baiduLat,
					'sewageDischarge': res.data.sewageDischarge,
					'taskDemand': res.data.taskDemand,
					'progress': res.data.progress,
					'relevantDepartments': res.data.relevantDepartments,
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
