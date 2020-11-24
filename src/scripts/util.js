var util = {
    showMsg: function (msg, time, fn) {
        if(!time) {
            time = 1000;
        }
        layer.msg(msg, {
            icon: 1,
            time: time
        }, fn);
    },
    showErrMsg: function (msg) {
        layer.msg(msg, {
            icon: 2,
            time: 1000
        });
    },
    showLoading: function () {
        layer.load(2, {
            shade: 0.6
        });
    },
    closeLoading: function () {
        layer.closeAll('loading');
    },
    showWarnMsg: function (msg) {
        layer.msg(msg, {
            icon: 7,
            time: 2000
        });
    },
    showWarnAlert: function(msg, fn) {
        layer.alert(msg, {icon: 7}, function(index) {
            fn && typeof fn === 'function' ? fn(index) : '';
            layer.close(index);
        })
    },
    showConfirm: function (msg, onOk, onCancel) {
        return layer.confirm(msg, {icon: 3, title: '提示'}, onOk, onCancel);
    },

    /**
     *
     * @param option<br/>
     * formType 输入框类型，支持0（文本）默认1（密码）2（多行文本）<br/>
     * initVal 初始时的值，默认空字符<br/>
     * maxLen 可输入文本的最大长度，默认500<br/>
     * cancel 用户点击取消时的回调 入参有两个当前层索引参数（index）、当前层的DOM对象（layero）<br/>
     * ok 用户点击确定时的回调 入参3个参数 value(用户填写的内容), index(layer弹框的index), elem(dom元素)<br/>
     * success: 弹出层完全打开后的回调 两个参数当前dom层layero, 当前层索引index
     */
    showPrompt: function(option) {
        var opt = {
            formType: option.formType ? option.formType : 0, //输入框类型，支持0（文本）默认1（密码）2（多行文本）
            value: option.initVal ? option.initVal : '', //初始时的值，默认空字符
            maxlength: option.maxLen ? option.maxLen : 500, //可输入文本的最大长度，默认500,
            cancel: option.cancel,
            success: option.success
        };

        layer.prompt(opt, option.ok);
    },
    errorBorder: function (jquerySelector) {
        var orignColor = $(jquerySelector).css('border-color');
        $(jquerySelector).css('border-color', 'red');
        setTimeout(function () {
            $(jquerySelector).css('border-color', orignColor);
        }, 2000)
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    imgCompound: function (obj){
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var myImage = new Image();
        myImage.src = obj.src_bg;
        myImage.crossOrigin = 'Anonymous';
        myImage.onload = function(){
            // console.log('width:'+myImage.width+',height:'+myImage.height);
            canvas.width = myImage.width;
            canvas.height = myImage.height;
            ctx.fillStyle = '#E6E6E8';
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.save();
            ctx.drawImage(myImage , 0, 0, myImage.width, myImage.height);
            var myImage2 = new Image();
            myImage2.src = obj.src_qr;
            myImage2.crossOrigin = 'Anonymous';
            myImage2.onload = function(){
                ctx.restore();
                ctx.drawImage(myImage2 , obj.x, obj.y, obj.w, obj.h);
                var base64 = canvas.toDataURL();
                var img = document.getElementById(obj.id);
                img.setAttribute('src' , base64);
            }
        }
    },
    closeDialog: function (index){
        if(!index) {
            return;
        }
        layer.close(index);
    },
    /**
     *
     * @param option<br/>
     * title:弹出框标题<br/>
     * url:弹出框页面链接<br/>
     * area:弹出框大小，默认["90%","90%"]<br/>
     * shadeClose: 点击阴影是否可以关闭，默认false,<br/>
     * success:弹出框加载完成后执行的函数<br/>
     */
    openIframeDialog: function(option) {
        var opt = {
            type: 2,
            title: option.title,
            content: option.url,
            area: option.area ? option.area : ["90%", "90%"],
            shadeClose: option.shadeClose ? option.shadeClose : false,
            success: option.success,
            end: option.end
        };
        var open = layer.open(opt);
        return open;
    }
};