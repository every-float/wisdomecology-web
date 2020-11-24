//引入插件
document.write('<link rel="stylesheet" type="text/css" href="../../scripts/webuploader/webuploader.css">');
document.write('<link rel="stylesheet" type="text/css" href="../../scripts/webuploader/style.css">');
document.write('<script type="text/javascript" src="../../scripts/webuploader/webuploader.js"></script>');
/**
 * 父级页面调用使用
 * @param divid
 * @param obj
 * @returns
 */
;(function ($) {

	var myfu = function(ele, options){
		this.$element = $(ele); //主元素
		this.defaults = {
			token: '',
			objId: '',
			isupload: 1,
			fileType : 'images',
			fileNumLimit : 1,
			server : '', // 上传接口
			swf: '../../scripts/webuploader/Uploader.swf',
			title : '文件上传',
			width : '700px',
			height : '400px',
			extensions: 'gif,jpg,jpeg,png,doc,docx,xls,xlsx,ppt,pptx,pdf,dbf,txt,rar,zip',
			mimeTypes: '*',
			language : 'cn'
		};
		this.settings = $.extend({}, this.defaults, options);
	};
	myfu.prototype = {
		init: function() {
			var _this = this;
			layui.use(['form','layUploader'], function() {
				var $this = $('#'+_this.settings.objId);
				var initialization = $this.attr("data-initialization");
				if (initialization == undefined) {
					initialization = false;
				} else {
					initialization = true;
				}
				$this.attr("data-initialization", "true");
				var $input = $this;
				var objId = $this.attr("id");
				//获取传入的参数，没有使用默认参数
				var jsonParams = _this.settings;
				if(jsonParams.isupload==1&&jsonParams.server==null){
					alert('请设置上传接口地址');
					return;
				}

				//实例化参数信息
				//var defaultParams = _this.defaults;
				// defaultParams.server = jsonParams.server;
				// defaultParams.token = jsonParams.token;
				// defaultParams.isupload = jsonParams.isupload==null?defaultParams.isupload:jsonParams.isupload;
				// defaultParams.fileType = jsonParams.fileType==null?defaultParams.fileType:jsonParams.fileType;
				// defaultParams.fileNumLimit = jsonParams.fileNumLimit==null?defaultParams.fileNumLimit:jsonParams.fileNumLimit;
				// defaultParams.swf = jsonParams.swf==null?defaultParams.swf:jsonParams.swf;
				// defaultParams.title = jsonParams.title==null?defaultParams.title:jsonParams.title;
				// defaultParams.width = jsonParams.width==null?defaultParams.width:jsonParams.width;
				// defaultParams.height = jsonParams.height==null?defaultParams.height:jsonParams.height;
				// defaultParams.extensions = jsonParams.extensions==null?defaultParams.extensions:jsonParams.extensions;
				// defaultParams.mimeTypes = jsonParams.mimeTypes==null?defaultParams.mimeTypes:jsonParams.mimeTypes;
				// defaultParams.language = jsonParams.language==null?defaultParams.language:jsonParams.language;

				// var fileNumLimit = defaultParams.fileNumLimit;
				// var language = defaultParams.language;
				// var title = defaultParams.title;
				// var fileType = defaultParams.fileType;
				// var width = defaultParams.width;
				// var height = defaultParams.height;

				var fileNumLimit = jsonParams.fileNumLimit;
				var language = jsonParams.language;
				var title = jsonParams.title;
				var width = jsonParams.width;
				var fileType = jsonParams.fileType;
				var extensions = jsonParams.extensions;
				var mimeTypes = jsonParams.mimeTypes;
				var isupload = jsonParams.isupload;

				$this.attr("data-fileNumLimit", fileNumLimit);
				if (!initialization) {
					var boxHtml = "";
					if (fileType == "images" || fileType == "image") {
						//设定文件类型
						extensions = 'gif,jpg,jpeg,png';
						mimeTypes = 'image/jpg,image/jpeg,image/png,image/gif';
						boxHtml = "<div id=\"img_"+objId+"\" class=\"upload-attachments-list\"><dl><dd class=\"item hidden\" data-id=\"{id}\" data-path=\"{path}\" data-thumbnail=\"{thumbnail}\" data-name=\"{name}\" data-fileId=\"{fileId}\" ><a href=\"{path}\" class=\"layphoto-example\" target=\"_blank\" title=\"{name}\"><img src=\"\" _src=\"{thumbnail}\" onerror=\"imgerror(this)\"/></a>";
						if(isupload==1){
							boxHtml += "<span class=\"lb-control-box\">";
							boxHtml += " <i class=\"btn-control btn-delete layui-icon layui-icon-delete\" title=\""
								+ (language == "cn" ? "删除" : "Delete")
								+ "\"></i></span>";
						}
						boxHtml += "</dd>";
						if(isupload==1){
							boxHtml += "<dd class=\"btn-upload\"><a href=\"javascript:void(0)\" title=\""
								+ (language == "cn" ? "点击上传" : "Update File")
								+ "\"><i class=\"layui-icon layui-icon-add-1\"></i><a></dd>";
						}
						boxHtml += "</dl></div>";
					} else if (fileType == "file" || fileType == "files") {
						boxHtml = "<div class=\"upload-attachments-list upload-attachments-file-list\"><dl><dd class=\"item hidden\" data-id=\"{id}\" data-path=\"{path}\" data-thumbnail=\"{thumbnail}\" data-name=\"{name}\" data-fileId=\"{fileId}\"><a href=\"{path}\" target=\"_blank\"  title=\"{name}\">{name}</a>";
						if(isupload==1){
							boxHtml += "<span class=\"lb-control-box\"><i class=\"btn-control btn-delete layui-icon layui-icon-delete\"  title=\"删除\"></i></span>";
						}
						boxHtml += "</dd>";
						if(isupload==1){
							boxHtml += "<dd class=\"btn-upload\"><a href=\"javascript:void(0)\" title=\""
								+ (language == "cn" ? "点击上传" : "Update File")
								+ "\"><i class=\"layui-icon layui-icon-add-1\"></i><a></dd>";
						}
						boxHtml += "</dl></div>";
					}
					$this.after(boxHtml);
					$this.hide();
				}

				var $attachments = $this.siblings(".upload-attachments-list");
				// 注册按钮点击
				var $btnButton;
				var $btnDelete;

				if (fileType == "image" || fileType == "images" || fileType == "file"|| fileType == "files") {
					$btnButton = $attachments.find(".btn-upload");
				} else {
					$btnButton = $this.siblings(".input-group-btn").children(".btn-upload");
					$btnDelete = $btnButton.siblings(".btn-delete");
				}

				if (!initialization) {
					$btnButton.click(function() {
						//layUploader文件上传
						layUploader.uploadFile(jsonParams, function (obj, jsonData){
							layer.close(obj.layer_index);
							_this.uploadPaneledCallBack(objId, jsonData);
						});
					});
				}

				var uploadValue = $this.val();
				if (uploadValue == "") {
					uploadValue = "";
				}
				var data;
				if (fileType == "image") {
					if (uploadValue != "") {
						var name = uploadValue.substring(uploadValue.lastIndexOf("/") + 1);
						var thumbnail = uploadValue;
						data = [ {
							"path" : uploadValue,
							"name" : name,
							"thumbnail" : thumbnail
						} ];
						$btnButton.hide();
						$attachments.children("dl").ListBind({
							showFooter : false
						}, data);
					}
				} else {
					var uploadedNum = 0;
					if (uploadValue != "") {
						data = JsonParse(uploadValue);
						uploadedNum = data.length;
						$this.attr("data-fileNumLimit", fileNumLimit - uploadedNum);
						if (uploadedNum >= fileNumLimit && fileNumLimit != 0) {
							$btnButton.hide();
						}
					}
					$attachments.children("dl").ListBind({
						showFooter : false
					}, data);
					$btnButton.insertAfter($attachments.find(".item").last());
				}

				if (!initialization) {
					// /点击删除按钮
					var options = {
						fileType : fileType,
						btnUpload : $btnButton,
						input : $input,
						attachments : $attachments
					};
					$attachments.on("click", ".btn-delete", options, function(event) {
						var $this = $(this);
						var thiParent = $this.parent().parent();
						thiParent.remove();
						var option = event.data;
						var fileType = option.fileType;
						var $btnButton = option.btnUpload;
						var $input = option.input;
						var $attachments = option.attachments;
						if (fileType == "image") {
							$input.val("");
							$btnButton.show();
						} else {
							var jsonArray = new Array();
							var $items = $attachments.find(".item");
							$items.each(function(index) {
								var $this = $(this);
								var json = {
									"path" : $this.attr("data-path"),
									"thumbnail" : $this.attr("data-thumbnail"),
									"name" : $this.attr("data-name"),
									"fileId" : $this.attr("data-fileId")
								};
								jsonArray[index] = json;
							});
							if (jsonArray.length == 0) {
								$input.val("");
							} else {
								$input.val(JSON.stringify(jsonArray));
							}
							var fileNumLimit = $input.attr("data-fileNumLimit");
							$input.attr("data-fileNumLimit", fileNumLimit + 1);
							if (fileNumLimit + 1 > 0) {
								$btnButton.show();
							}
						}
					});
				}
			});
		},

		uploadPaneledCallBack: function(objId, jsonData){
			var _this = this;
			if(jsonData==null||jsonData==''){
				return '';
			}

			var $obj = $('#' + objId);
			if ($obj.length == 0) {
				alert("未找到"+objId+"对象！")
				return;
			}
			// var defaultParams = {
			// 	fileType : 'image',
			// 	fileNumLimit : 1
			// }

			var jsonParams = _this.settings;
			// defaultParams.fileType = jsonParams.fileType==null?defaultParams.fileType:jsonParams.fileType;
			// defaultParams.fileNumLimit = jsonParams.fileNumLimit==null?defaultParams.fileNumLimit:jsonParams.fileNumLimit;
			//
			// var fileNumLimit = defaultParams.fileNumLimit;
			// var fileType = defaultParams.fileType;

			var fileType = jsonParams.fileType;
			var fileNumLimit = jsonParams.fileNumLimit;
			var isupload = jsonParams.isupload;

			var $attachments = $obj.siblings(".upload-attachments-list");
			var $btnButton = $attachments.find(".btn-upload");

			if ($attachments.length == 0) {
				alert("未找到upload-attachments-list对象！")
				return;
			}
			var bindData = null;
			if (fileType == "file") {
				$btnButton.hide();
			}else if (fileType == "image") {
				var path = jsonData[0].path;
				var name = jsonData[0].name;
				var fileId = jsonData[0].fileId;
				bindData = [ {
					"path" : path,
					"name" : name,
					"thumbnail" : path,
					"fileId" : fileId
				} ];
				$obj.val(JSON.stringify(bindData));
				$btnButton.hide();
			} else {
				//判断是否已达上限
				//console.info("jsonData.length="+jsonData.length);
				//console.info("fileNumLimit="+fileNumLimit);
				if((isupload == 1)&&(jsonData.length > fileNumLimit)){
					//$btnButton.hide();
				}else{
					bindData = $obj.val();
					if (bindData != "") {
						bindData = ObjectParse(bindData);
						if (jsonData != "") {
							bindData.push.apply(bindData, jsonData);
						}
					} else {
						bindData = jsonData;
					}
					$obj.val(JSON.stringify(bindData));
				}

			}
			$attachments.children("dl").ListBind({
				showFooter : false
			}, bindData);
			$btnButton.insertAfter($attachments.find(".item").last());
			//判断是否已达上限
			var $items = $attachments.find(".item");
			console.info("$items.length="+$items.length);
			if($items.length >= fileNumLimit){
				$btnButton.hide();
			}

			//调用示例
			var imgdata = [];
			$('#img_'+ objId).find('a.layphoto-example').each(function(index,item){
				var fileId = $(this).attr("data-fileId");
				var fileSrc = $(this).attr("href");
				var fileName = $(this).attr("title");
				imgdata[index] = {"src":""+fileSrc+"","pid":""+fileId+"","thumb":""+fileSrc+"","alt":""+fileName+""};
				$(this).unbind("click").click(function(e){
					var json = {"start":index,"data":imgdata};
					top.layer.photosPage({
						printer: true,//是否显示打印
						photos:json
					});
					return false;
				});
			});
		}
	};
//初始化上传插件
	$.fn.fileupload = function (opts) {
		var fu = new myfu(this, opts);
		return fu;
	};

})(jQuery);
//图片错误处理
function imgerror(img){
	var _src = img.getAttribute('_src');
	if(_src != '{thumbnail}'){
		img.setAttribute('src', _src);
		img.removeAttribute('onerror');
	}
}
// 删除上传的文件
(function($) {
	$.fn.DeleteUploadedFile = function() {
		var $thisObj = this;
		$thisObj.val("").data("pass", 0);
		var $btnDelete = $thisObj.siblings(".upload-attachments-list").find(".btn-delete");
		$btnDelete.click();
	}
})(jQuery);

function closeLoading() {
	layer.closeAll('loading', { anim: -1 });
}

// 数据绑定
(function($) {
	$.fn.ListBind = function(thisOptions, jsonList) {
		if(jsonList==undefined){
			return;
		}
//		alert(JSON.stringify(jsonList));
		var $thisObj = this;
		if ($thisObj.length == 0) {
			alert("未找到ListBind绑定对象!")
			return;
		}
		var itemObj = '.item';
		var $items = $thisObj.find(itemObj);
		var templateHtml;
		if ($thisObj.data("templateHtml") != undefined) {
			templateHtml = $thisObj.data("templateHtml");
		} else {
			if ($items.length == 0) {
				alert("ListBind未找到列表页模板!")
				return;
			}
			var $templateItem = $items.eq(0);
			$templateItem.addClass("data-list-bind-item")
			templateHtml = $templateItem.removeClass("hidden").prop("outerHTML");
			$thisObj.data("templateHtml", templateHtml);
		}
		$items.remove();
		var Bind = function(jsonData) {
			// 回调
			if (typeof (jsonData) != "object") {
				jsonData = JsonParse(jsonData)
			}
			if (jsonData == undefined) {
				closeLoading();
				return;
			}
			var jsonPage, jsonListArray;
			if (jsonData.hasOwnProperty("pageInfo")) {
				isPageList = true;
				jsonPage = jsonData.pageInfo;
				jsonListArray = jsonData.data;
			} else {
				jsonListArray = jsonData;
			}
			var recordCount = 0
			if (jsonListArray != undefined) {
				recordCount = jsonListArray.length
			}
			// 创建每行数据
			var CreateItem = function(number, template) {
				// 模板html中{key}替换为json数据
				var rowData = jsonListArray[number];
				$.each(rowData, function(name, ival) {
					if (ival == undefined) {
						ival = "";
					}
					var reg = new RegExp("{" + name + "}", "gi");
					template = template.replace(reg, ival);
					reg = new RegExp("{_number}", "gi");
					template = template.replace(reg, (number + 1));
				});
				$thisObj.append(template);
			}
			// 循环创建行
			for (var i = 0; i < recordCount; i++) {
				CreateItem(i, templateHtml);
			}
			closeLoading();
		}
		// 判断是否为空对象
		if (!$.isEmptyObject(jsonList)) {
			Bind(jsonList);
		}

		return this;
	}
})(jQuery);
