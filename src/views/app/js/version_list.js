var datalist;
$(function(){
	initDatagrid();
});
function initDatagrid() {
	layui.use('table', function(){
		datalist = layui.table;
		datalist.render({
			elem : '#dataGrid',
			url : URL_appVersion_list,
			page : true,
			toolbar: '#toolbar',
			cols : [[ // 表头
				{
					type : 'checkbox',
					fixed: 'left'
				}, {
					field : 'version_name',
					title : '版本名称',
					width : 260,
					align : 'center'
				}, {
					field : 'version_no',
					title : '版本号',
					width : 120,
					align : 'center'
				}, {
					field : 'app_type',
					title : '分类',
					width : 120,
					align : 'center',
					templet: function(d){
						var ss = '';
						if(d.app_type=='android'){
							ss = '<span class="layui-badge layui-bg-green">安卓</span>';
						}else if(d.app_type=='ios'){
							ss = '<span class="layui-badge layui-bg-primary">苹果</span>';
						}
						return ss;
					}
				}, {
					field : 'is_use',
					title : '是否使用',
					width: 100,
					align : 'center',
					templet: function(d){
						var ss = '<span class="layui-badge layui-bg-gray">否</span>';
						if(d.is_use=='1'){
							ss = '<span class="layui-badge layui-bg-green">是</span>';
						}
						return ss;
					}
				}, {
					field : 'remark',
					title : '备注',
					minWidth: 200,
					align : 'center'
				}, {
					field : 'create_time',
					title : '创建时间',
					width : 180,
					align : 'center',
					templet: '<div>{{ new Date(d.create_time).format("yyyy-MM-dd hh:mm:ss") }}</div>'
				}, {
					field : '',
					title : '操作',
					width : 100,
					align : 'center',
					fixed: 'right',
					toolbar : '#barOpt'
				} 
			]]
		});
		//监听工具条
		datalist.on('tool(dataGrid)', function(obj) {
			var data = obj.data;
			if (obj.event === 'edit') {
				//layer.alert('编辑行：<br>' + JSON.stringify(data))
				edit(data.version_id);
			}
		});
	});
};

//得到查询的参数
function queryParams(params) {
	var temp = { 
		versionName : $("#search_versionName").val()
	};
	return temp;
}

function search() {
	datalist.reload('dataGrid', {
		where : queryParams()
		,page: {
			curr: 1 //重新从第 1 页开始
		}
	});
	layer.closeAll('iframe');
}

function reload() {
	datalist.reload('dataGrid', {
		where : queryParams()
	});
	layer.closeAll('iframe');
}

function add(){
	layer.open({
		type : 2,
		title : '新增版本',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '90%', '90%' ],
		content : pageUrl+"views/app/version_edit.html",
		btn: ['确定', '关闭'],
		yes: function(index, layero){
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']];
			
			iframeWin.checkForm();
		},
		btn2: function(index, layero){
			layer.close(index);
		}
	});
}

function edit(pid) {
	layer.open({
		type : 2,
		title : '修改版本',
		shadeClose : true,
		shade : 0.6,
		maxmin : true,
		area : [ '90%', '90%' ],
		content : pageUrl+"views/app/version_edit.html?versionId="+pid,
		btn: ['确定', '关闭'],
		yes: function(index, layero){
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']];
			
			iframeWin.checkForm();
		},
		btn2: function(index, layero){
			layer.close(index);
		}
	});
}

function del() {
	var checkStatus = datalist.checkStatus('dataGrid'),data = checkStatus.data;
	if(data.length==0){
		layer.alert('请选择至少1条记录',{icon: 2});
		return;
	}
	var ids = [];
	for (var i = 0; i < data.length; i++) {
		ids[i]= data[i].version_id;
	}
	layer.confirm('确定删除选择的 '+data.length+' 条记录吗 ？', {icon: 3, title:'提示'}, function(index){
		layer.close(index);
		$.ajax({
			url : URL_appVersion_del,
			data : {
				"ids":ids.toString()
			},
			type : "post",
			dataType : "json",
			beforeSend: function() {
				// loading show
				layer.load(2, {shade: 0.6});
			},
			success : function(res) {
				if(res.code==0){
					layer.msg(res.msg);
					search();
				}else{
					layer.msg(res.msg);
				}
			},
			complete: function () {
				layer.closeAll('loading');
			}
		});
	});
}

function updateAppdlHtml(){
	layer.confirm('确定更新下载页面吗 ？', {icon: 3, title:'提示'}, function(index){
		layer.close(index);
		$.ajax({
			url : URL_appVersion_updateAppdlHtml,
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
					//layer.msg(res.msg);
					var cont = '<div style="margin: 15px;line"><div style="text-align: center;"><i class="layui-icon layui-icon-ok-circle" style="font-size: 100px;color: #5FB878;"></i><br><font style="font-size: 20px;font-weight: bold;">html文件生成成功</font></div>'+
						'<p style="margin: 20px 0 10px 0;">使用说明：</p>'+
						'<p style="margin-bottom: 5px;">1.<a href="'+res.data.url_html+'" target="_blank" download style="color: red;text-decoration: underline;">下载地址</a></p>'+
						'<p style="margin-bottom: 5px;">2.鼠标右键点击第1步的下载地址，点击菜单“链接另存为”，将html文件存到本机'+
						'<p >3.将下载的html文件存放在服务器前端centercontrol-web项目下的"views/download"目录下</p></div>';
					layer.open({
						type : 1,
						title : '提示',
						shadeClose : true,
						shade : 0.6,
						maxmin : true,
						area : [ '520px', '430px' ],
						content : cont,
						btn: ['关闭'],
						btn2: function(index, layero){
							layer.close(index);
						}
					});
				}else{
					layer.msg(res.msg);
				}
			},
			complete: function () {
				layer.closeAll('loading');
			}
		});
	});
}