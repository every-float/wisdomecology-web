/**
	guotaov2018-08-15
	根据layer-1.8修改
	图片查看、旋转、放大、缩小。兼容IE8+
 */
(function (window, factory) {
    if (typeof exports === 'object') { // 支持 CommonJS
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) { // 支持 AMD
        define(factory);
    } else if (window.layui && layui.define) { //layui加载
        layui.define(function (exports) {
          exports('layPhoto', factory());
        });
    } else {
        window.layPhoto = factory();
    }
})(this, function () {
	layer.photosview = function(options){
	    options = options || {};
	    var log = {
	        imgIndex: 1,
	        end: null,
	        html: $('html')
	    }, win = $(window), json = options.json, page = options.page;
	    if(json){
	        var data = json.data;
			log.imgLen = data.length;
			log.printer = options.printer==undefined||options.printer==''?false:true;
			if(data.length > 0){
				log.thissrc = data[json.start].src;
				log.pid = data[json.start].pid;
				log.imgsname = data[json.start].alt;
				log.name = data[json.start].alt;
				log.imgIndex = json.start + 1;
				log.title = json.title==undefined||json.title==''?'':'《'+json.title+'》';
			} else {
				layer.msg('没有任何图片',{icon:2});
				return;
			}  
	    } else {
	        var imgs = $(page.photos).find('img'), nowimg = imgs.eq(page.start);
			log.printer = options.printer==undefined||options.printer==''?false:true;
	        log.thissrc = (nowimg.attr('layer-img') || nowimg.attr('layer-src'));
	        log.pid = nowimg.attr('pid');
	        log.imgLen = imgs.length;
	        log.imgsname = nowimg.attr('alt');
	        log.name = nowimg.attr('alt');
	        log.imgIndex = page.start + 1;
			log.title = page.title==undefined||page.title==''?'':'《'+page.title+'》';
	    }
	    
	    //上一张
        log.imgprev = function(){
            log.imgIndex--;
            if(log.imgIndex < 1){
                log.imgIndex = log.imgLen;
            }
            log.tabimg();
        };
        //下一张
        log.imgnext = function(){
            log.imgIndex++;
            if(log.imgIndex > log.imgLen){
                log.imgIndex = 1;
            }
            log.tabimg();
        };
        //键盘操作
        log.keyup = function(e){
        	if(!log.end){
                var code = e.keyCode;
                e.preventDefault();
                if(code === 37){
                    log.imgprev();
                } else if(code === 39) {
                	log.imgnext();
                } else if(code === 27) {
                    layer.close(log.index);
                }
            }
        };
        log.tabimg = function(){
            var timer, src, pid, name;
            log.imgs.removeAttr('style');
            if(json){
                var nowdata = data[log.imgIndex - 1];
                src = nowdata.src;
                pid = nowdata.pid;
                name = nowdata.alt;
            } else {
                var thisimg = imgs.eq(log.imgIndex - 1);
                src = thisimg.attr('layer-img') || thisimg.attr('layer-src');
                pid = thisimg.attr('layer-pid') || '';
                name = thisimg.attr('alt') || '';
            }
            log.imgs.attr({
                src: src,
                'layer-pid': pid,
                alt: name
            });
			log.imgtit.find('a').text(name);
            log.imgtit.find('em').text(log.imgIndex + '/' + log.imgLen);
            log.imgsee.show();
			//图片操作
			$("#viewer").iviewer('loadImage', src);
			
        }
	    //一些动作
	    log.event = function(){
	        log.bigimg.hover(function(){
	            log.imgsee.show();
				$('.iviewer_common_box').show();
	        }, function(){
	            log.imgsee.hide();
				$('.iviewer_common_box').hide();
	        });
	        log.bigimg.find('.layui-layer-imgprev').on('click', function(event){
	            event.preventDefault();
	            log.imgprev();
	        });
	        log.bigimg.find('.layui-layer-imgnext').on('click', function(event){
	            event.preventDefault();
	            log.imgnext();
	        });
	        //方向键
	        $(document).keyup(function(event){
	            log.keyup(event);
	        });
	        
	    };
	    
	    //相册响应式
	    log.resize = function(layero){
	        var relog = {}, wa = [win.width(), win.height()];
	        relog.limit = wa[0] - wa[0]/wa[1]*(60*wa[0]/wa[1]);
	        if(relog.limit < 600){
	            relog.limit = 600;
	        }
	        var area = [relog.limit,  wa[1] > 400 ? wa[1] - 50 : 400];
	        area[0] = options.html ? area[0] : (area[0] - 300);
			
	        layer.style(log.index, {
	            width: area[0] - (options.html ? 0 : 0),
	            height: area[1],
				left: (wa[0]-area[0])/2
	        });
	        relog.flwidth = area[0] - (options.html ? 300 : 0);
	        if(log.imgarea[0] > relog.flwidth){
	            log.imgs.css({width: relog.flwidth});
	        } else {
	            log.imgs.css({width: log.imgarea[0]});
	        }
	        if(log.imgs.outerHeight() < area[1]){
	            log.imgs.css({top: (area[1] - log.imgs.outerHeight())/2});
	        }
			
	        log.imgs.css({visibility: 'visible'});
	        log.bigimg.css({width: relog.flwidth, height: area[1], 'background-color': options.bgcolor});
	        log.viewimg.css({width: relog.flwidth, height: area[1]});
	        if(options.html){
	            layero.find('.xubox_intro').css({height: area[1]});
	        }
	        relog = null;
	        wa = null;
	        area = null;
			
			$("#viewer").iviewer('update');
			$("#viewer").iviewer('fit');
			
			layero.find('img').focus();
	    };
	    
	    win.on('resize', function(){
	        if(log.end){
	            return;
	        }
	        if(log.timer){
	            clearTimeout(log.timer); 
	        }
	        log.timer = setTimeout(function(){
	            log.resize(log.layero);
	        }, 200); 
			
	    });
	    var conf = {
	        type: 1,
	        border: [0],
	        area: [(options.html ? 915 : 600) + 'px', 'auto'],
	        title: false,
	        shade: [.9, '#000', true],
	        shadeClose: true,
	        offset: ['25px', ''],
	        scrollbar: false,
	        bgcolor: '',
	        content: '<div class="layui-layer-phimg" style="position:relative; width:600px; "><div id="viewer"><img src="'+ log.thissrc +'" alt="'+ (log.name || '') +'" layer-pid="'+ (log.pid || '') +'"></div><div class="xubox_imgsee">'+ function(){
				if(log.imgLen > 1){
					return '<a href="" class="layui-layer-iconext layui-layer-imgprev"></a><a href="" class="layui-layer-iconext layui-layer-imgnext"></a>'
				} else {
					return '';
				}   
			}() +'<div class="xubox_imgbar"><span class="xubox_title">'+log.title+'</span><span class="xubox_imgtit"><a href="javascript:;">'+ log.imgsname +' </a><em>'+ log.imgIndex +'/'+ log.imgLen +'</em></span></div></div></div>'+ function(){
				if(options.html){
					return '<div class="xubox_intro">'+ options.html +'</div>';
				} else {
					return '';
				}
	         }()
	        , success: function(layero,index){
				
	            log.bigimg = layero.find('.layui-layer-phimg');
	            log.viewimg = layero.find('#viewer');
	            log.imgsee = log.bigimg.find('.xubox_imgsee');
	            log.imgbar = log.imgsee.find('.xubox_imgbar');
	            log.imgtit = log.imgbar.find('.xubox_imgtit');
	            log.layero = layero;
	            
	            var img = log.imgs = log.bigimg.find('img');
	            
	            clearTimeout(log.timerr);
	            log.timerr = setTimeout(function(){
	                $('html').css('overflow', 'hidden').attr('layer-full', log.index);
	            }, 10);
	            
				
	            img.load(function(){
	                log.imgarea = [img.outerWidth(), img.outerHeight()];
	                log.resize(layero);
	                options.success && options.success(json || page);
	            });
	            
	            log.event();
	            
	            //图片操作
				$("#viewer").iviewer({printer: log.printer});
				
	        }, end: function(){
	        	layer.close(log.index);
	            log.end = true;
	            $(document).off('keyup', log.keyup());
	        }
	    };
	    log.index = layer.open(conf);
	    return log.index;
	};
	
	//获取页面元素包含的所有图片，快捷调用
	layer.photosPage = function(options){
	    var log = {};
	    log.run = function(index){
	        layer.photosview({
	            html: options.html,
	            success: options.success,
				printer: options.printer,
	            page: {
	                title: options.title,
	                id: options.id,
	                start: index,
	                photos: options.photos
	            }
	        });
	    };
	    options = options || {};
	    if($(options.photos).length>0){
	    	if($(options.photos).find('img').length>0){
				$(options.photos).find('img').each(function(index){
			        $(this).on('click', function(){
			            log.run(index);
			        });
				});
			}
	    }else{
	    	//json
			layer.photosview({
				html: options.html,
				printer: options.printer,
				success: options.success,
				json: options.photos
			});
	    }
	};
});
