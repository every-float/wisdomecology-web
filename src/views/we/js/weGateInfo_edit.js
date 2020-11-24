var gateId = $.getUrlParam('gateId');
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
			
				layui.use("form", function(){
					var form = layui.form;
					form.render('select');
				})
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
		url : URL_gateInfo_gateInfoType,
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
				var gateType = res.data.gateType;
				var option_ryz = '<option value="">--请选择--</option>';
				for (var i = 0; i < gateType.length; i++) {
					option_ryz += '<option value="'+gateType[i].value+'">'+gateType[i].name+'</option>';
				}
				$('#gateType').html(option_ryz);
				layui.form.render('select');
				if(gateId){
					initDataInfo();
				}
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
		url : URL_gateInfo_detailInfo,
		data : {
			gateId: gateId
		},
		type : "post",
		dataType : "json",
		beforeSend: function() {
			// loading show
			// layer.load(2, {shade: 0.6});
		},
		success : function(res) {
			if(res.code==0){
				var form = layui.form;
				// 初始赋值
				form.val('form1', {
					'gateId': res.data.gateId,
					'areaId': res.data.areaId,
					'intoRiver': res.data.intoRiver,
					'areaName': res.data.areaName,
					'waterName': res.data.waterName,
					'gateType': res.data.gateType,
					'gpsLng': res.data.gpsLng,
					'gpsLat': res.data.gpsLat,
					'baiduLng': res.data.baiduLng,
					'baiduLat': res.data.baiduLat,
					'shore': res.data.shore,
					'intoWay': res.data.intoWay,
					'intoType': res.data.intoType,
					'receivingRange': res.data.receivingRange,
					'overlayPipe': res.data.overlayPipe,
					'legalDuty': res.data.legalDuty,
					'governancePlan': res.data.governancePlan,
					'pluggingFlag': res.data.pluggingFlag,
					'address': res.data.address,
					'remark': res.data.remark,
					'riverLeaderName': res.data.riverLeaderName,
					'riverLeaderPhone':res.data.riverLeaderPhone
				});
				var filesOutfall = res.data.filesOutfall;
				fu.uploadPaneledCallBack('filesOutfall', ObjectParse(filesOutfall));
			}else{
				
			}
		},
		complete: function () {
			layer.closeAll('loading');
		}
	});
}
