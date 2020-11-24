var illegalId = $.getUrlParam('illegalId');
$(function() {
	
	layui.use(['form','laydate'], function() {
		var form = layui.form;
		var laydate = layui.laydate;

		//听证责改日期
		laydate.render({ 
			elem: '#hearChangeDate',type: 'date',theme: 'grid'
		});

		//处罚决定日期
		laydate.render({ 
			elem: '#penaltyDecisionDate',type: 'date',theme: 'grid'
		});

		//罚款缴纳日期
		laydate.render({ 
			elem: '#penaltyDate',type: 'date',theme: 'grid'
		});

		//交钱日期
		laydate.render({ 
			elem: '#payDate',type: 'date',theme: 'grid'
		});

		//结案日期
		laydate.render({ 
			elem: '#closeDate',type: 'date',theme: 'grid'
		});

		form.render();

	});
		//企业下拉初始化
		initParamInfo();

		initDataInfo()
});

function initParamInfo(){
	$.ajax({
		url : URL_companyInfo_initParamInfo,
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
				var company_list = res.data.company_list;
				var option_ryz = '<option value=""></option>';
				for (var i = 0; i < company_list.length; i++) {
					option_ryz += '<option value="'+company_list[i].companyId+'">'+company_list[i].companyName+'</option>';
				}
				console.log(option_ryz)
				$('#companyId').html(option_ryz);
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
		url : URL_companyIllegal_detailInfo,
		data : {
			illegalId: illegalId
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
					'illegalId': res.data.illegalId,
					'docNo': res.data.docNo,
					'companyId': res.data.companyId,
					'hearChangeDate': new Date(res.data.hearChangeDate).format('yyyy-MM-dd').toString(),
					'penaltyDecisionDate': new Date(res.data.penaltyDecisionDate).format('yyyy-MM-dd').toString(),
					'penaltyAmount': res.data.penaltyAmount,
					'penaltyDate': new Date(res.data.penaltyDate).format('yyyy-MM-dd').toString(),
					'breakTerms': res.data.breakTerms,
					'punishmentBasis': res.data.punishmentBasis,
					'enforcer': res.data.enforcer,
					'team': res.data.team,
					'bookings': res.data.bookings,
					'payDate': new Date(res.data.payDate).format('yyyy-MM-dd').toString(),
					'creditRating': res.data.creditRating,
					'closeDate': new Date(res.data.closeDate).format('yyyy-MM-dd').toString(),
					'placeFile': res.data.placeFile,
					'remark': res.data.remark
				});
			
				
				//是否可用
				var isZdpwdw =  $("#isZdpwdw").val();
				if(isZdpwdw == '1'){
					$("#sw_isZdpwdw").prop("checked","checked");
				}
				form.render();	
			}else{
				
			}
		},
		complete: function () {
			layer.closeAll('loading');
		}
	});
}
