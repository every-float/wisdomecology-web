/**
	guotaov2018-10-28
	根据webuploader修改
	文件上传。兼容IE8+
 */
var layUploader = {};
(function(window, factory) {
	if (typeof exports === 'object') { // 支持 CommonJS
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) { // 支持 AMD
		define(factory);
	} else if (window.layui && layui.define) { //layui加载
		layui.define(function(exports) {
			exports('layUploader', factory());
		});
	} else {
		window.layUploader = factory();
	}
})(this, function() {
	// 上传操作，传入
	layUploader.uploadFile = function(obj, callback){
		//layer弹出层内容
		var htmlDiv = '<div id="uploader" class="wu-example">'
					+'<div class="queueList">'
					+'<div id="dndArea" class="placeholder">'
					+'	<div id="filePicker"></div>'
					+'	<p id="uploadRemark">可以将文件拖到这里进行上传</p>'
					+'</div>'
					+'</div>'
					+'<div class="statusBar" style="display: none;">'
					+'	<div class="progress">'
					+'		<span class="text">0%</span> <span class="percentage"></span>'
					+'	</div>'
					+'	<div class="info"></div>'
					+'	<div class="btns">'
					+'		<div id="filePicker2"></div>'
					+'		<div class="uploadBtn">开始上传</div>'
					+'	</div>'
					+'</div>'
					+'</div>';
		layer.open({
			type: 1,
			title: '上传文件',
			//skin: 'layui-layer-rim', //加上边框
			area: [obj.width, obj.height], 
			content: htmlDiv,
			btn: ['关闭'],
			btn2: function(index, layero){
				layer.close(index);
			},
			success: function(layero, index){
				obj.layer_index = index;
				layUploader.initWebUploader(obj, callback);
			},
			end: function(layero, index){
				//关闭模态框销毁WebUploader，解决再次打开模态框时按钮越变越大问题
				$("#thelist").html("");
			}
		});
	}
	
	layUploader.initWebUploader = function(obj, callback){
		var currToken = obj.token;
		var jsonData = new Array(); //服务器返回的jsonData
		var server = obj.server;
		var swf = obj.swf;
		var language = obj.language;
		var extensions = obj.extensions;
		var mimeTypes = obj.mimeTypes;
		var fileNumLimit = obj.fileNumLimit;
		
		var $ = jQuery,
		$wrap = $('#uploader'),
		// 图片容器
		$queue = $('<ul class="filelist"></ul>').appendTo($wrap.find('.queueList')),
		// 状态栏，包括进度和控制按钮
		$statusBar = $wrap.find('.statusBar'),
		// 文件总体选择信息。
		$info = $statusBar.find('.info'),
		// 上传按钮
		$upload = $wrap.find('.uploadBtn'),
		// 没选择文件之前的内容。
		$placeHolder = $wrap.find('.placeholder'),
		// 总体进度条
		$progress = $statusBar.find('.progress').hide(),
		// 添加的文件数量
		fileCount = 0,
		// 添加的文件总大小
		fileSize = 0,
		// 优化retina, 在retina下这个值是2
		ratio = window.devicePixelRatio || 1,
		// 缩略图大小
		thumbnailWidth = 110 * ratio, thumbnailHeight = 110 * ratio,
		// 可能有pedding, ready, uploading, confirm, done.
		state = 'pedding',
		// 所有文件的进度信息，key为file id
		percentages = {}, supportTransition = (function() {
			var s = document.createElement('p').style, r = 'transition' in s
					|| 'WebkitTransition' in s
					|| 'MozTransition' in s
					|| 'msTransition' in s
					|| 'OTransition' in s;
			s = null;
			return r;
		})(),
		// WebUploader实例
		uploader;
		
		if (!WebUploader.Uploader.support()) {
			alert('WebUploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
			throw new Error('WebUploader does not support the browser you are using.');
		}
		// 实例化
		uploader = WebUploader.create({
			pick : {
				id : '#filePicker',
				label : (language == "cn" ? "选择上传文件": "Select upload file")
			},
			dnd : '#uploader .queueList',
			paste : document.body,
			accept : {
				title : 'Files',
				extensions : extensions,
				mimeTypes : mimeTypes
			},
			formData : {
				
			},
			// swf文件路径
			swf : swf,
			disableGlobalDnd : true,
			chunked : true,
			server : server,
			fileNumLimit : fileNumLimit
		});
		
		// 添加“添加文件”的按钮，
		uploader.addButton({
			id : '#filePicker2',
			label : (language == "cn" ? "继续添加" : "Continue to add")
		});

		// 当有文件添加进来时执行，负责view的创建
		function addFile(file) {
			var $li = $('<li id="' + file.id + '">'
					+ '<p class="title">' + file.name + '</p>'
					+ '<p class="imgWrap"></p>'
					+ '<p class="progress"><span></span></p>'
					+ '</li>'),
			$btns = $(
					'<div class="file-panel">'
							+ '<span class="cancel">删除</span>'
							+ '<span class="rotateRight">向右旋转</span>'
							+ '<span class="rotateLeft">向左旋转</span></div>')
					.appendTo($li), $prgress = $li
					.find('p.progress span'), $wrap = $li
					.find('p.imgWrap'), $info = $('<p class="error"></p>'),
			showError = function(code) {
				switch (code) {
				case 'exceed_size':
					text = '文件大小超出';
					break;
				case 'interrupt':
					text = '上传暂停';
					break;
				default:
					text = '上传失败，请重试';
					break;
				}
				$info.text(text).appendTo($li);
			};
			if (fileCount >= fileNumLimit) {
				if (fileNumLimit != 0) {
					$("#filePicker2").hide();
				}
			}
			if (file.getStatus() === 'invalid') {
				showError(file.statusText);
			} else {
				$wrap.text('预览中');
				uploader.makeThumb(file, function(error, src) {
					if (error) {
						$wrap.text('');
						return;
					}
					var img = $('<img src="' + src + '">');
					$wrap.empty().append(img);
				}, thumbnailWidth, thumbnailHeight);
				percentages[file.id] = [ file.size, 0 ];
				file.rotation = 0;
			}
			file.on('statuschange',function(cur, prev) {
				if (prev === 'progress') {
					$prgress.hide().width(0);
				} else if (prev === 'queued') {
					$li.off('mouseenter mouseleave');
					$btns.remove();
				}
				// 成功
				if (cur === 'error' || cur === 'invalid') {
					console.log(file.statusText);
					showError(file.statusText);
					percentages[file.id][1] = 1;
				} else if (cur === 'interrupt') {
					showError('interrupt');
				} else if (cur === 'queued') {
					percentages[file.id][1] = 0;
				} else if (cur === 'progress') {
					$info.remove();
					$prgress.css('display', 'block');
				} else if (cur === 'complete') {
					$li.append('<span class="success"></span>');
				}
				$li.removeClass('state-' + prev).addClass('state-' + cur);
			});
			$li.on('mouseenter', function() {
				$btns.stop().animate({
					height : 30
				});
			});
			$li.on('mouseleave', function() {
				$btns.stop().animate({
					height : 0
				});
			});
			$btns.on('click', 'span', function() {
				var index = $(this).index(), deg;
				switch (index) {
				case 0:
					uploader.removeFile(file);
					return;
				case 1:
					file.rotation += 90;
					break;
				case 2:
					file.rotation -= 90;
					break;
				}
				if (supportTransition) {
					deg = 'rotate(' + file.rotation + 'deg)';
					$wrap.css({'-webkit-transform' : deg,
								'-mos-transform' : deg,
								'-o-transform' : deg,
								'transform' : deg
							});
				} else {
					$wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation='
						+ (~~((file.rotation / 90) % 4 + 4) % 4)
						+ ')');
				}
			});
			$li.appendTo($queue);
		}

		// 负责view的销毁
		function removeFile(file) {
			var $li = $('#' + file.id);
			delete percentages[file.id];
			updateTotalProgress();
			$li.off().find('.file-panel').off().end().remove();
			if (fileCount < fileNumLimit) {
				$("#filePicker2").show();
			}
		}

		function updateTotalProgress() {
			var loaded = 0, total = 0, spans = $progress
					.children(), percent;
			$.each(percentages, function(k, v) {
				total += v[0];
				loaded += v[0] * v[1];
			});
			percent = total ? loaded / total : 0;
			spans.eq(0).text(Math.round(percent * 100) + '%');
			spans.eq(1).css('width', Math.round(percent * 100) + '%');
			updateStatus();
		}

		function updateStatus() {
			var text = '', stats;
			if (state === 'ready') {
				text = '选中' + fileCount + '个文件，共' + WebUploader.formatSize(fileSize) + '。';
			} else if (state === 'confirm') {
				stats = uploader.getStats();
				if (stats.uploadFailNum) {
					text = '已成功上传'
							+ stats.successNum
							+ '个文件，'
							+ stats.uploadFailNum
							+ '个文件上传失败，<a class="retry" href="#">重新上传</a>失败文件或<a class="ignore" href="#">忽略</a>'
				}
			} else {
				stats = uploader.getStats();
				text = '共' + fileCount + '个文件（' + WebUploader.formatSize(fileSize) + '），已上传' + stats.successNum + '个';
				if (stats.uploadFailNum) {
					text += '，失败' + stats.uploadFailNum + '个';
				}
			}
			$info.html(text);
		}

		function setState(val) {
			var file, stats;
			if (val === state) {
				return;
			}
			$upload.removeClass('state-' + state);
			$upload.addClass('state-' + val);
			state = val;
			switch (state) {
			case 'pedding':
				$placeHolder.removeClass('element-invisible');
				$queue.parent().removeClass('filled');
				$queue.hide();
				$statusBar.addClass('element-invisible');
				uploader.refresh();
				break;
			case 'ready':
				$placeHolder.addClass('element-invisible');
				$('#filePicker2').removeClass('element-invisible');
				$queue.parent().addClass('filled');
				$queue.show();
				$statusBar.removeClass('element-invisible');
				uploader.refresh();
				var text = (language == "cn" ? "开始上传" : "Start uploading");
				$upload.text(text);
				break;
			case 'uploading':
				$('#filePicker2').addClass('element-invisible');
				$progress.show();
				var text = (language == "cn" ? "暂停上传" : "Suspend upload");
				$upload.text(text);
				break;
			case 'paused':
				$progress.show();
				var text = (language == "cn" ? "继续上传" : "Continue uploading");
				$upload.text(text);
				break;
			case 'confirm':
				$progress.hide();
				var text = (language == "cn" ? "开始上传" : "Start uploading");
				$upload.text(text).addClass('disabled');
				stats = uploader.getStats();
				if (stats.successNum && !stats.uploadFailNum) {
					setState('finish');
					return;
				}
				break;
			case 'finish':
				stats = uploader.getStats();
				if (stats.successNum) {
					// 所有文件上传完毕后执行方法
					return callback(obj, jsonData);
				} else {
					// 没有成功的图片，重设
					state = 'done';
					location.reload();
				}
				break;
			}
			updateStatus();
		}
		
		uploader.onUploadBeforeSend = function(obj, data, headers) {
		   _.extend(headers, { 
				'Authorization':'Bearer ' + currToken
		   }); 
		};
		
		uploader.onUploadProgress = function(file, percentage) {
			var $li = $('#' + file.id), $percent = $li.find('.progress span');
			$percent.css('width', percentage * 100 + '%');
			percentages[file.id][1] = percentage;
			updateTotalProgress();
		};

		uploader.onFileQueued = function(file) {
			fileCount++;
			fileSize += file.size;
			if (fileCount === 1) {
				$placeHolder.addClass('element-invisible');
				$statusBar.show();
			}
			addFile(file);
			setState('ready');
			updateTotalProgress();
		};

		uploader.onFileDequeued = function(file) {
			fileCount--;
			fileSize -= file.size;
			if (!fileCount) {
				setState('pedding');
			}
			removeFile(file);
			updateTotalProgress();
	
		};
		var index = 0;
		uploader.on('uploadSuccess', function(file, response) {
			if (response.code != 0) {
				uploader.stop();
				alert('失败:'+response.msg);
			} else {
				// 上传成功
				var fileId = response.data.fileId;
				var fileName = response.data.fileName;
				var originalFileType = response.data.originalFileType;
				var fileType = response.data.fileType;
				var filePath = response.data.filePath;
				if (fileType == 'file') {
					// 文件默认图片
					thumbnail = 'scripts/webuploader/images/bg.png';
				}
				var thumbnail = filePath;
				jsonData[index] = {
					"path" : filePath,
					"thumbnail" : thumbnail,
					"name" : fileName,
					"fileId" : fileId
				};
				index++;
			}
		});

		uploader.on('all', function(type) {
			var stats;
			switch (type) {
			case 'uploadFinished':
				setState('confirm');
				break;
			case 'startUpload':
				setState('uploading');
				break;
			case 'stopUpload':
				setState('paused');
				break;
			}
		});
		uploader.onError = function(code) {
			switch (code) {
			case "Q_TYPE_DENIED":
				layer.msg("对不起，只能上传" + extensions + "格式的文件！");
				break;
			case "F_DUPLICATE":
				layer.msg('对不起，此文件已经选择！');
				break;
			case "Q_EXCEED_SIZE_LIMIT":
				layer.msg("对不起，所有文件大小不能超过" + fileSizeLimit + "kb！");
				break;
			case "F_EXCEED_SIZE":
				layer.msg("对不起，每个文件大小不能超过" + fileSingleSizeLimit + "kb！");
				break;
			case "Q_EXCEED_NUM_LIMIT":
				layer.msg("对不起，只能选择" + fileNumLimit + "个文件！");
				break;
			default:
				layer.msg(code);
				break;
			}
		};

		$upload.on('click', function() {
			if ($(this).hasClass('disabled')) {
				return false;
			}
			if (state === 'ready') {
				uploader.upload();
			} else if (state === 'paused') {
				uploader.upload();
			} else if (state === 'uploading') {
				uploader.stop();
			}
		});

		$info.on('click', '.retry', function() {
			uploader.retry();
		});
	
		$info.on('click', '.ignore', function() {
			alert('todo');
		});
		$upload.addClass('state-' + state);
		updateTotalProgress();
	}
});
