function TimePlay(options) {
    var timePlay = this;
    timePlay.default_option = {
        speed: 3000,
        startDate: new Date(),
        endDate: new Date(),
        currentData: new Date(),
        timeUnitControl: true,
        backToday: true,
        timeUnit: '时',
        container: '#timePlay',
        onClickChangeEnd: null,
        onAnimateEnd: null
    };
    timePlay.options = jQuery.extend(true, timePlay.default_option, options);//基本配置

    timePlay.initDoms();//初始化结构
    timePlay.timer = null;//动画定时器
    timePlay.translate = 0;//时间轴位移
    timePlay.width = 0;//时间轴长度
    timePlay.timeUnit = timePlay.options.timeUnit;//单位
    timePlay.left = $(".timeProgress-box").offset().left;
    timePlay.right = $(window).width() - timePlay.left - $(".timeProgress-box").width();
    timePlay.dis = $('.timeProgress-inner li').outerWidth();//运动每格长度
    timePlay.dis_hour = timePlay.dis / 24;//小时单位移动距离
    timePlay.curr_x = 0;//临时记录X轴位移
    timePlay.temp_day = {};//临时记录时间
    timePlay.curr_day = {};//进度条时间
    timePlay.index_hover = 0;//临时索引
    timePlay.hover = 0;//当前索引
    timePlay.delay = false;//是否延迟
    timePlay.init();//初始化
}
TimePlay.prototype.init = function () {
    var timePlay = this;
    timePlay.initDate();//初始化日期

    $('.timeUnitBtn').on('click', function () {//切换显示单位
        var index = $(this).index();
        console.log(index);
        timePlay.changeTimeUnit(index);
    });

    $('.timeControl').on('click', function () {//时间轴播放暂停
        timePlay.play();
    });

    $('.timeProgress').on('mouseover', function () {
        timePlay.hoverPopup();
    })

    $('.timeProgress').on('click', function () {
        timePlay.clickPopup();
    })

    $(".next").on('click', function () {
        timePlay.pageNext();
    })

    $(".tprev").on('click', function () {
        timePlay.pagePrev();
    })

    $(".today").on('click', function () {
        $(".timeInfo span").text(dateFormat(new Date(), 'yyyy-MM-dd HH'))
        timePlay.stopPlay();
        timePlay.initDate();
        // var func = new Function('return ' + timePlay.options.onClickChangeEnd)();
        // func(new Date(timePlay.curr_day.year, timePlay.curr_day.mon - 1, timePlay.curr_day.day, timePlay.curr_day.hour));  

        setTimeout(function(){
            layui.use(['layer', 'admin'], function () {
                var $ = layui.jquery;
                var admin = layui.admin;

                vm.header_left=admin.util.deepClone(vm.old_header_left);
            });
            vm.fnAddMarker();
        },1000)
    })
}

TimePlay.prototype.hoverPopup = function () {
    var timePlay = this;
    $(window).on('mousemove', function (event) {
        var e = event || window.event;
        var x = e.clientX;
        var day_index = Math.floor((x + timePlay.translate - timePlay.left) / timePlay.dis);
        timePlay.index_hover = day_index;
        timePlay.temp_day = {
          "year": parseInt($('.every:eq(' + day_index + ')').attr('data-year')),
          "mon": parseInt($('.every:eq(' + day_index + ')').find('.mon').text()),
          "day": parseInt($('.every:eq(' + day_index + ')').find('.day').text()),
          "hour": Math.floor(((x + timePlay.translate - timePlay.left) % timePlay.dis) / timePlay.dis_hour)
        }
        timePlay.curr_x = x + timePlay.translate - timePlay.left;
        if (timePlay.timeUnit == '天') {
          var texts = timePlay.temp_day.mon + '月' + timePlay.temp_day.day + '日';
        } else {
          var texts = timePlay.temp_day.hour + ":00";
        }
        $(".hover-popup").show().css("left", x - timePlay.left).text(texts);
    })

    $('.timeProgress').one('mouseleave', function () {
        $(window).off('mousemove');
        $(".hover-popup").hide();
    })
}

TimePlay.prototype.clickPopup = function () {
    var timePlay = this;
    timePlay.stopPlay();
    if (timePlay.timeUnit == '天') {
        var texts = timePlay.temp_day.mon + '月' + timePlay.temp_day.day + '日';
    } else {
        var texts = timePlay.temp_day.hour + ":00";
    }
    $(".curr-popup").hide().text(texts);
    $(".curr-popup.for-click").show().css('left', timePlay.curr_x - timePlay.translate)
    $(".timeProgress-bar").stop().css('width', timePlay.curr_x)
    timePlay.width = timePlay.curr_x;
    timePlay.curr_day = timePlay.temp_day;
    timePlay.index = timePlay.index_hover;
    var func = new Function('return ' + timePlay.options.onClickChangeEnd)();
    func(new Date(timePlay.curr_day.year, timePlay.curr_day.mon - 1, timePlay.curr_day.day, timePlay.curr_day.hour));
    
}

TimePlay.prototype.initDate = function () {//初始化日期
    var timePlay = this;
    var curr_date = timePlay.options.currentData;
    var year = curr_date.getFullYear();
    var month = curr_date.getMonth() + 1;
    var day = curr_date.getDate();
    var hour = curr_date.getHours();
    $(".curr-popup").hide();
    $(".for-animate").show();
    timePlay.curr_day = {
        "year": year,
        "mon": month,
        "day": day,
        "hour": hour
    };
    $(".curr-popup").text(hour + ":00");
    for (var i = 0, len = $('.every').length; i < len; i++) {
        var m = parseInt($('.every:eq(' + i + ') .mon').text());
        var d = parseInt($('.every:eq(' + i + ') .day').text());
        if (month == m && day == d) {
            timePlay.index = i;
            timePlay.width = timePlay.dis * i + timePlay.dis / 24 * hour;
            timePlay.progressAni();
            break;
        }
    }
}

TimePlay.prototype.initDoms = function () {//初始化dom
    var timePlay = this;
    $(timePlay.options.container).hide();
    var mainContainer = $('<div id="timeMain"></div>'),
        timeUnitControl = '<div class="timeUnit"><div class="inner"><div class="timeUnitBtn">天</div><div class="timeUnitBtn active">时</div></div></div>',
        playControl = '<div class="timeControl-box"><div class="timeControl play"></div></div>',
        pageControl = '<div class="prev-box"><div class="tprev" title="上一页"></div></div><div class="next-box"><div class="next" title="下一页"></div></div>',
        backToday = '<div class="today">回到今天</div>',
        timeAxis = '<div class="timeProgress-box"><div class="hover-popup"></div><div class="curr-popup for-click">17:00</div><div class="timeProgress-hide"><div class="timeProgress-inner"><div class="timeProgress"><div class="timeProgress-bar"><div class="curr-popup for-animate">17:00</div></div></div><ul></ul></div></div></div>';
    if (timePlay.options.timeUnitControl) {
        $(timePlay.options.container).append(timeUnitControl);
    }
    $(timePlay.options.container).append(mainContainer);
    mainContainer.append(playControl).append(pageControl).append(timeAxis);
    timePlay.fillDate(timePlay.options.startDate, timePlay.options.endDate);
    if (timePlay.options.backToday) {
        $(timePlay.options.container).append(backToday);
    }
}

TimePlay.prototype.fillDate = function (start, end) {
    var timePlay = this;
    var startYear = start.getFullYear(),
        startMonth = start.getMonth() + 1,
        startDay = start.getDate(),
        endYear = end.getFullYear(),
        endMonth = end.getMonth() + 1,
        endDay = end.getDate(),
        datelist = '<li class="every" data-year=' + startYear + '><span class="mon">' + startMonth + '</span>-<span class="day">' + startDay + '</span></li>';
    while ((startDay != endDay) || (startMonth != endMonth) || (startYear != endYear)) {
        startDay++;
        if (startDay > timePlay.monthCount(startMonth, startYear)) {
            startDay = 1;
            startMonth++;
        }
        if (startMonth > 12) {
            startMonth = 1;
            startYear++;
        }
        datelist += '<li class="every" data-year=' + startYear + '><span class="mon">' + startMonth + '</span>-<span class="day">' + startDay + '</span></li>';
    }
    $(timePlay.options.container).show().find('ul').append(datelist);
}


TimePlay.prototype.calcLeapYear = function (year) {
    return (year % 4 == 0) && ((year % 100 == 0) ? (year % 400 == 0) : true)
}
TimePlay.prototype.monthCount = function (month, year) {
    var timePlay = this;
    return (month < 8) ? ((month == 2) ? (timePlay.calcLeapYear(year) ? 29 : 28) : ((month % 2 == 0) ? 30 : 31)) : ((month % 2 == 0) ? 31 : 30);
}
TimePlay.prototype.progressAni = function () {//进度条动画
    var timePlay = this,
        page_width = $('.timeProgress-box').width(),
        con_width = $('.timeProgress-inner').width(),
        page_num = Math.floor(timePlay.width / page_width),
        left_dis = page_num * page_width;
    if (page_width - timePlay.width + left_dis < timePlay.dis) {
        left_dis = left_dis + (page_width / 2);
    }
    if (left_dis + page_width > con_width + 40) {
        left_dis = $('.timeProgress-inner').width() - page_width + 40;
        $(".next").addClass('disable');
    }
    if ((timePlay.width - left_dis) < timePlay.dis) {
        left_dis = left_dis - (page_width / 2);
    }
    if (left_dis < 0) {
        left_dis = 0;
    }
    timePlay.translate = left_dis;
    $('.timeProgress-inner').css({ 'transform': "translateX(-" + left_dis + "px)" });
    $('.timeProgress-bar').animate({
        width: timePlay.width,
    }, 500, 'linear');
}


TimePlay.prototype.changeTimeUnit = function (index) {
    var timePlay = this;
    if (!$('.timeUnitBtn:eq(' + index + ')').hasClass('active')) {
        $('.timeUnitBtn').toggleClass('active');
        timePlay.timeUnit = $('.timeUnitBtn.active').text();
    };
    if (timePlay.timeUnit == '天') {
        var texts = timePlay.curr_day.mon + '月' + timePlay.curr_day.day + '日';
    } else {
        var texts = timePlay.curr_day.hour + ":00";
    }
    $(".curr-popup").text(texts);
    timePlay.stopPlay();

    //如果判断时间超过了当前时间，则
    // gotoPre(timePlay);
}

TimePlay.prototype.play = function () {
    var timePlay = this;
    if ($('.timeControl').hasClass('play')) {
        if(vm.isFirstPlay){
            vm.isFirstPlay=false;
            //跳到本页最前面的时间节点
            gotoPre(timePlay);
        }
        timePlay.startPlay();
    } else {
        timePlay.stopPlay();
    }
}

TimePlay.prototype.delayAnimation = function () {
    var timePlay = this;
    timePlay.delay = true;
}

TimePlay.prototype.continueAnimation = function () {
    var timePlay = this;
    timePlay.delay = false;
}

TimePlay.prototype.startPlay = function () {
    var timePlay = this;
    if (timePlay.width >= $('.timeProgress').width()) {
        return false;
    }
    $('.timeControl').toggleClass('play').toggleClass('pause');
    $(".curr-popup").hide();
    $(".curr-popup.for-animate").show();
    if('zhangtr-change'&&!vm.isFirstPlay){
        if('同setInterval里面的代码'){
            console.log('setInterval')
            if (timePlay.delay) {
                return false;
            }
            var temp_date = timePlay.curr_day;
            if (timePlay.reachEnd()) {
                timePlay.halfPageNext();
            }
            if (timePlay.timeUnit == "时") {
                var real_width = Math.floor(timePlay.width / timePlay.dis_hour) * timePlay.dis_hour;
                timePlay.width = real_width + timePlay.dis_hour;
                timePlay.curr_day.hour = timePlay.curr_day.hour + 1;
                if ((timePlay.curr_day.hour % 24) == 0) {
                    timePlay.index++;
                    timePlay.curr_day = {
                        "year": parseInt($('.every:eq(' + timePlay.index + ')').attr('data-year')),
                        "mon": parseInt($('.every:eq(' + timePlay.index + ')').find('.mon').text()),
                        "day": parseInt($('.every:eq(' + timePlay.index + ')').find('.day').text()),
                        "hour": 0
                    }

                }
                $(".curr-popup").text(timePlay.curr_day.hour + ":00")
            } else {
                timePlay.index++;
                var real_width = Math.floor(timePlay.width / timePlay.dis) * timePlay.dis;
                timePlay.width = real_width + timePlay.dis;
                timePlay.curr_day = {
                    "year": parseInt($('.every:eq(' + timePlay.index + ')').attr('data-year')),
                    "mon": parseInt($('.every:eq(' + timePlay.index + ')').find('.mon').text()),
                    "day": parseInt($('.every:eq(' + timePlay.index + ')').find('.day').text()),
                    "hour": 0
                }
                if (timePlay.index < $(".every").length) {
                    $(".curr-popup").text(timePlay.curr_day.mon + '月' + timePlay.curr_day.day + '日');
                }
            }
            if (timePlay.width >= $('.timeProgress').width()) {
                timePlay.width = $('.timeProgress').width();
                timePlay.curr_day = temp_date;
                timePlay.stopPlay();
            }
            $(".timeProgress-bar").css({ 'width': timePlay.width })
            var _func = new Function('return ' + timePlay.options.onAnimateEnd)();
            _func(new Date(timePlay.curr_day.year, timePlay.curr_day.mon - 1, timePlay.curr_day.day, timePlay.curr_day.hour))
        }
    }else{
        timePlay.progressAni();
    }
    timePlay.timer = setInterval(function () {
        console.log('setInterval')
        if (timePlay.delay) {
            return false;
        }
        var temp_date = timePlay.curr_day;
        if (timePlay.reachEnd()) {
            timePlay.halfPageNext();
        }
        if (timePlay.timeUnit == "时") {
            var real_width = Math.floor(timePlay.width / timePlay.dis_hour) * timePlay.dis_hour;
            timePlay.width = real_width + timePlay.dis_hour;
            timePlay.curr_day.hour = timePlay.curr_day.hour + 1;
            if ((timePlay.curr_day.hour % 24) == 0) {
                timePlay.index++;
                timePlay.curr_day = {
                    "year": parseInt($('.every:eq(' + timePlay.index + ')').attr('data-year')),
                    "mon": parseInt($('.every:eq(' + timePlay.index + ')').find('.mon').text()),
                    "day": parseInt($('.every:eq(' + timePlay.index + ')').find('.day').text()),
                    "hour": 0
                }

            }
            $(".curr-popup").text(timePlay.curr_day.hour + ":00")
        } else {
            timePlay.index++;
            var real_width = Math.floor(timePlay.width / timePlay.dis) * timePlay.dis;
            timePlay.width = real_width + timePlay.dis;
            timePlay.curr_day = {
                "year": parseInt($('.every:eq(' + timePlay.index + ')').attr('data-year')),
                "mon": parseInt($('.every:eq(' + timePlay.index + ')').find('.mon').text()),
                "day": parseInt($('.every:eq(' + timePlay.index + ')').find('.day').text()),
                "hour": 0
            }
            if (timePlay.index < $(".every").length) {
                $(".curr-popup").text(timePlay.curr_day.mon + '月' + timePlay.curr_day.day + '日');
            }
        }
        if (timePlay.width >= $('.timeProgress').width()) {
            timePlay.width = $('.timeProgress').width();
            timePlay.curr_day = temp_date;
            timePlay.stopPlay();
        }
        $(".timeProgress-bar").css({ 'width': timePlay.width })
        var _func = new Function('return ' + timePlay.options.onAnimateEnd)();
        _func(new Date(timePlay.curr_day.year, timePlay.curr_day.mon - 1, timePlay.curr_day.day, timePlay.curr_day.hour))
    }, timePlay.options.speed)
}
TimePlay.prototype.stopPlay = function () {
    var timePlay = this;
    if ($('.timeControl').hasClass('pause')) {
        $('.timeControl').toggleClass('play').toggleClass('pause');
    }
    clearInterval(timePlay.timer);
}
TimePlay.prototype.reachEnd = function () {
    var timePlay = this;
    var dis_right = $('.timeProgress-box').width() - (timePlay.width - timePlay.translate);
    if (dis_right <= 108) {
        return true;
    } else {
        return false;
    }
}
TimePlay.prototype.halfPageNext = function () {
    $(".curr-popup").hide();
    $(".curr-popup.for-animate").show();
    $(".prev").removeClass('disable');
    var timePlay = this,
        page_width = $('.timeProgress-box').width(),
        con_width = $('.timeProgress-inner').width();
    timePlay.translate += ($('.timeProgress-box').width() / 2);
    if (timePlay.translate + page_width > con_width + 40) {
        timePlay.translate = $('.timeProgress-inner').width() - page_width + 40;
        $(".next").addClass('disable');
    }
    $('.timeProgress-inner').css({ 'transform': "translateX(-" + timePlay.translate + "px)" });
}
TimePlay.prototype.pageNext = function () {
    $(".curr-popup").hide();
    $(".curr-popup.for-animate").show();
    $(".prev").removeClass('disable');
    var timePlay = this,
        page_width = $('.timeProgress-box').width(),
        con_width = $('.timeProgress-inner').width();
    timePlay.translate += $('.timeProgress-box').width();
    if (timePlay.translate + page_width > con_width + 40) {
        timePlay.translate = $('.timeProgress-inner').width() - page_width + 40;
        $(".next").addClass('disable');
    }
    $('.timeProgress-inner').css({ 'transform': "translateX(-" + timePlay.translate + "px)" });
}
TimePlay.prototype.pagePrev = function () {
    $(".next").removeClass('disable');
    $(".curr-popup").hide();
    $(".curr-popup.for-animate").show();
    var timePlay = this;
    timePlay.translate -= $('.timeProgress-box').width();
    if (timePlay.translate < 0) {
        timePlay.translate = 0;
        $(".tprev").addClass('disable');
    }
    $('.timeProgress-inner').css({ 'transform': "translateX(-" + timePlay.translate + "px)" });
}


function gotoPre(timePlay){
    var countDay=-Math.floor(($(".timeProgress-box").width()-40)/timePlay.dis)+1;
    var curr_date = new Date(GetDateStr(countDay));
    var year = curr_date.getFullYear();
    var month = curr_date.getMonth() + 1;
    var day = curr_date.getDate();
    var hour = curr_date.getHours();
    $(".curr-popup").hide();
    $(".for-animate").show();
    timePlay.curr_day = {
        "year": year,
        "mon": month,
        "day": day,
        "hour": 0
    };
    $(".curr-popup").text(hour + ":00");
    for (var i = 0, len = $('.every').length; i < len; i++) {
        var m = parseInt($('.every:eq(' + i + ') .mon').text());
        var d = parseInt($('.every:eq(' + i + ') .day').text());
        if (month == m && day == d) {
            timePlay.index = i;
            timePlay.width = timePlay.dis * i + timePlay.dis / 24 * hour;
            // timePlay.progressAni();
            break;
        }
    }
}

//校验时间是否到最后
function checkTime(){
    var _curDate = new Date();
    if($('.timeUnitBtn.active').html()=='天'){
        if (
            timeplay.curr_day.year == _curDate.getFullYear() && 
            timeplay.curr_day.mon == _curDate.getMonth()+1 &&
            timeplay.curr_day.day == _curDate.getDate()
        ) {
            vm.isFirstPlay=true;
            setTimeout(function(){
                $('.today').trigger('click');
            }, 3000)
        }
    }
    if($('.timeUnitBtn.active').html()=='时'){
        if (
            timeplay.curr_day.year == _curDate.getFullYear() && 
            timeplay.curr_day.mon == _curDate.getMonth()+1 &&
            timeplay.curr_day.day == _curDate.getDate() &&
            timeplay.curr_day.hour == _curDate.getHours()
        ) {
            vm.isFirstPlay=true;
            setTimeout(function(){
                $('.today').trigger('click');
            }, 3000)
        }
    }
}