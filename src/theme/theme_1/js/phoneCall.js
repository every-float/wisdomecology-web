var appId = "4d04277574e64421a2e1862162f7ddc5";
var userId = "", channel = ""; // 选中的用户UID、房间名
var idLabelNum = 0, noticeSendNum = 0, leaveNum = 0;
var chatType = "video";  //  语音类型

/* 
 * websocket方法设定
 * 初始化、监听、关闭
 * 判断用户是否在线
*/
// var webSocket = null;
var websocketFunc = {
  initWebsocket:function(token){
    if('WebSocket' in window){
      // var webSocketUrl = "ws://39.105.57.146:9002/websocket/onlineUser";
      var webSocketUrl = wsUrl + 'websocket/onlineUser';
      // var webSocketUrl = window.profiles.wsOnlineUrl;
      // webSocket = new WebSocket(webSocketUrl+"?uId=00426-OEM-8992662-00173");
      var webSocket = new WebSocket(webSocketUrl+"/"+token);
      // var webSocket = new WebSocket(webSocketUrl);
      webSocket.onopen = function(){
        console.log("websocket 连接成功");
        webSocket.send("上线了！");
      };

      webSocket.onmessage = function(evt){
        console.log(evt);
        for(var i in vm.contactList){
          if(evt.data == vm.contactList[i].token){
            vm.contactList[i].isOnline = true;
          }
        }
        // vm.renderContactTable();
      };
      
      webSocket.onerror = function(){
        console.log("websocket 通信出错");
        webSocket = new WebSocket(webSocketUrl+"/"+token);
      };
    }else{
      layer.alert('当前浏览器不支持websocket，请更换浏览器！');
    }
  },
  // sendMsg:function(){
  //   webSocket.send({"token":token});
  // },
  closeIt:function(){
    webSocket.close();
  }
}

/**
 * 页面基本信息
**/
var table, layer, layerIndex;
var contactList, tableHeight;
$(function(){
  tableHeight = $("body").height()-63;
  $(".callList .layui-card-body").height(tableHeight+23);
  window.onresize = function(){
    tableHeight = $("body").height()-63;
    $(".callList .layui-card-body").height(tableHeight+23);
    vm.contactTable();
  }
  var accessToken = window.location.href.split("=")[1];
  $.cookie('login_sid_t_we', accessToken, {path: '/'});
  $.ajax({
    type: 'post',
    url: baseUrl_https + 'index/getUserInfo',
    dataType: 'json',
    success: function(res) {
      if(res.code == 0) {
        vm.userName = res.data.realName;
      }else{
        layer.msg(res.msg);
      }
    },
    error: function(err) {
      layer.msg("网络访问出错！");
    }
  });
  
  layui.use(['table', 'layer'],function(){
    table = layui.table;
    layer = layui.layer;

    vm.getContactList();
  })
})

var vm = new Vue({
  el:"#webPage",
  data:{
    userName:"",
    contactList:[],
    chosenUserList:[],
    isConnection:false,    // 通话是否接通(false-未接通，true-已接通)
  },
  methods:{
    // 获取用户列表
    getContactList:function(){
      layerIndex = layer.load(2,{shade:0.5});
      $.ajax({
        type:"get",
        url:baseUrl_https+"index/getXJAppOnlineUserList",
        dataType:"json",
        data:{
          page:1,
          limit:9999
        },
        success:function(ret){
          if(ret.code == 0){
            vm.contactList = ret.data;
            websocketFunc.initWebsocket(vm.contactList[1].token);
            // for(var i in vm.contactList){
            //   vm.contactList[i].isOnline = false;
            //   if(vm.contactList[i].token){
            //     websocketFunc.initWebsocket(vm.contactList[i].token);
            //   }
            // }
            vm.contactTable();
          }else{
            layer.close(layerIndex);
            layer.msg(ret.msg);
          }
        },
        error:function(){
          layer.close(layerIndex);
          layer.msg("网络访问出错，联系人列表获取失败！");
        }
      })
    },

    contactTable:function(){
      contactList = table.render({
        elem:'#contactList',
        data:vm.contactList,
        height:tableHeight,
        page: false,
        toolbar: false,
        cols: [[
          {type: 'checkbox', fixed: 'left'},
          {title: '序号', align: 'center', templet:function(d){
            return d.LAY_TABLE_INDEX+1;
          }},
          {field: 'real_name', title: '用户姓名', width:180, align:'center'},
          {title: '设备名称', width:180, align:'center', templet:function(d){
            return d.device_name;
            // return "<img src='images/"+(d.device_model.indexOf("iPhone")==-1?"android_":"ios_")+(d.isOnline?"online":"offline")+".png' style='width:20px;height:20px;display:inline-block;margin-right:5px;' /><span>"+d.device_name+"</span>"
          }},
          {field: 'device_model', title: '设备类型', minWidth:180, align:'center'}
        ]],
        done:function(){
          layer.close(layerIndex);
        }
      })
    },
    renderContactTable:function(){
      var layerIndex = layer.load(2,{shade:0.5});
      contactList.reload({
        data:vm.contactList,
        height:tableHeight,
        page:false,
        done:function(){
          layer.close(layerIndex);
        }
      })
    },

    showZoomView: function(type, index){
      layer.open({
        type: 1,
        title: false,
        content: type=="local"?$('#localView'):$("#video"+index),
        area: ['410px', '94%'],
        shade: 0.6,
        success: function(layero, index){
          $(".layui-layer-page").find(".remote-video-placeholder").css("height", "100%");
          $(".layui-layer-page").find(".layui-layer-close").css("z-index", "999");
        },
        cancel:function(){
          $(".layui-layer-page").find(".remote-video-placeholder").css("height", "140px");
        }
      });
    },

    // 邀请新用户进入视频聊天
    addUser:function(){
      var data = table.checkStatus("contactList").data;
      if(data.length && vm.chosenUserList.length<8){
        for(var i in data){
          var num = 0;
          for(var j in vm.chosenUserList){
            if(data[i].token == vm.chosenUserList[j].token){
              break;
            }else{
              num++;
            }
          }
          if(num == vm.chosenUserList.length && vm.chosenUserList.length<8){
            vm.chosenUserList.push(data[i]);
            sendNotice(data[i].token);
          }
        }
      }
    },
  }
})

// index.html调用的function
// 开始视频
function startVideo(){
  chatType = "video";
  var checkStatus = table.checkStatus('contactList');
  vm.chosenUserList = checkStatus.data;
  if(vm.chosenUserList.length){
    if(vm.chosenUserList.length > 8){
      layer.alert("最多支持9人同时在线视频通话！");
      return false;
    }else{
      for(var i in vm.chosenUserList){
        sendNotice(vm.chosenUserList[i].token);
      }
    }
  }else{
    layer.alert("您还未选择要视频通话的对象！");
  }
}

// 挂断
function leaveChannel(){
  // var e = event||window.event;
  // e.preventDefault();
  idLabelNum = 0;
  noticeSendNum = 0;
  leaveNum = 0;
  vm.isConnection = false;
  vm.chosenUserList = [];
  clearInterval(connectionTimeRecord);
  layer.closeAll("page");
  leave(rtc)
}

// 音视频切换
function changeType(){
  if(chatType == "video"){  // 视频转语音
    chatType = "audio";
    rtc.localStream.muteVideo();
    $("#local_stream").parent(".video-view").css("visibility", "hidden");
  }else{        // 语音转视频
    chatType = "video";
    rtc.localStream.unmuteVideo();
    $("#local_stream").parent(".video-view").css("visibility", "visible");
  }
  for(var i in vm.chosenUserList){
    sendCallType(chatType, vm.chosenUserList[i].token);
  }
}

// 发送通话请求通知
function sendNotice(uId){
  layui.use('layer', function(){
    var layer = layui.layer;
    $.ajax({
      type:"post",
      url:baseUrl_https+"index/sendVideoReq",
      dataType:"json",
      data:{
        uId:uId,
        userNum:vm.chosenUserList[0].token+"_"+vm.chosenUserList.length
      },
      beforeSend:function(){
        layer.load(2,{shade:0.6});
      },
      success:function(ret){
        if(ret.code == 0){
          noticeSendNum++;
          if(noticeSendNum==vm.chosenUserList.length && chatType=="video"){
            var e = event||window.event;
            e.preventDefault();
            // This will start the join functions with all the configuration selected by the user.
            var params = {
              "appID":appId,
              "channel":"channel"+vm.chosenUserList[0].token,
              "token":"",
              "UID":uId,
              "cameraId":$("#cameraId").val(),
              "microphoneId":$("#microphoneId").val(),
              "cameraResolution":"default",
              "mode":"rtc",
              "codec":"h264"
            }
            join(rtc, params)
          }else{
            var e = event||window.event;
            e.preventDefault();
          }
        }else{
          layer.msg("通话通知发送失败");
        }
      },
      error:function(){
        layer.msg("通话通知发送失败");
      },
      complete:function(){
        layer.closeAll("loading");
      }
    })
  })
}

// 发送通话类型通知
function sendCallType(chatType, userId){
  layui.use('layer', function(){
    var layer = layui.layer;
    $.ajax({
      type:"post",
      url:baseUrl_https+"index/sendAPPVAReq",
      dataType:"json",
      data:{
        uId:userId,
        chatType:chatType
      },
      success:function(ret){
        if(ret.code == 0){}else{}
      },
      error:function(){
        layer.msg("发送失败");
      }
    })
  })
}

/* 
 * 视频通话
 * 初始化、结束、音视频切换
*/
function addView (idLabelNum, id, show) {
    if (!$("#" + id)[0]) {
      $("<div/>", {
        id: "remote_video_panel_" + id,
        class: "video-view",
		    style: "position: absolute; width: 100%; height: 100%; bottom: 0; right: 0; z-index: 199;"
      }).appendTo("#video"+idLabelNum)

      $("<div/>", {
        id: "remote_video_" + id,
        class: "video-placeholder remote-video-placeholder",
        style: "width:100%;height:140px;"
      }).appendTo("#remote_video_panel_" + id)

      $("<div/>", {
        id: "remote_video_info_" + id,
        class: "video-profile " + (show ? "" :  "hide"),
      }).appendTo("#remote_video_panel_" + id)

      $("<div/>", {
        id: "video_autoplay_"+ id,
        class: "autoplay-fallback hide",
      }).appendTo("#remote_video_panel_" + id)
    }
}
function removeView (id) {
    if ($("#remote_video_panel_" + id)[0]) {
      $("#remote_video_panel_"+id).remove()
    }
}

function getDevices (next) {
  AgoraRTC.getDevices(function (items) {
    items.filter(function (item) {
      return ["audioinput", "videoinput"].indexOf(item.kind) !== -1
    })
    .map(function (item) {
      return {
      name: item.label,
      value: item.deviceId,
      kind: item.kind,
      }
    })
    var videos = []
    var audios = []
    for (var i = 0; i < items.length; i++) {
      var item = items[i]
      if ("videoinput" == item.kind) {
        var name = item.label
        var value = item.deviceId
        if (!name) {
          name = "camera-" + videos.length
        }
        videos.push({
          name: name,
          value: value,
          kind: item.kind
        })
      }
      if ("audioinput" == item.kind) {
        var name = item.label
        var value = item.deviceId
        if (!name) {
          name = "microphone-" + audios.length
        }
        audios.push({
          name: name,
          value: value,
          kind: item.kind
        })
      }
    }
    next({videos: videos, audios: audios})
  })
}

var rtc = {
    client: null,
    joined: false,
    published: false,
    localStream: null,
    remoteStreams: [],
    params: {}
}
var connectTime,timeCount,connectionTimeRecord;

function handleEvents (rtc) {
    connectTime = 0;
    timeCount = setInterval(function(){
      connectTime++;
    }, 1000);
    // Occurs when an error message is reported and requires error handling.
    rtc.client.on("error", function(err) {
      console.log(err)
    })
    // Occurs when the peer user leaves the channel; for example, the peer user calls Client.leave.
    rtc.client.on("peer-leave", function (evt) {
      var id = evt.uid;
      leaveNum++;
      let streams = rtc.remoteStreams.filter(function(e){
        return id !== e.getId();
      })
      let peerStream = rtc.remoteStreams.find(function(e){
        return id === e.getId();
      })
      if(peerStream && peerStream.isPlaying()) {
        peerStream.stop()
      }
      rtc.remoteStreams = streams
      if (id !== rtc.params.uid) {
        removeView(id)
      }
      if(vm.chosenUserList.length == leaveNum){
        leaveChannel();
      }
      layer.msg("对方退出了当前通话")
      console.log("peer-leave", id)
    })

    // Occurs when the local stream is published.
    rtc.client.on("stream-published", function (evt) {
      layer.msg("stream published success")
      console.log("stream-published")
    })
    
    var joinIn = 0;
    // Occurs when the remote stream is added.
    rtc.client.on("stream-added", function (evt) {
      if(joinIn==0){
        clearInterval(timeCount);
        vm.isConnection = true;
        var connectionTime = "";
        var min=0, sec=0;
        connectionTimeRecord = setInterval(function(){
          sec++;
          if(sec<10){
            if(min<10){
              connectionTime = "0"+min+":0"+sec;
            }else{
              connectionTime = min+":0"+sec;
            }
          }else if(sec>=10 && sec<60){
            if(min<10){
              connectionTime = "0"+min+":"+sec;
            }else{
              connectionTime = min+":"+sec;
            }
          }else{
            min++;
            sec = 0;
            if(min<10){
              connectionTime = "0"+min+":0"+sec;
            }else{
              connectionTime = min+":0"+sec;
            }
          }
          $(".connectionTime").html(connectionTime);
        }, 1000);
      }
      joinIn++;
      var remoteStream = evt.stream
      var id = remoteStream.getId()
      layer.msg("用户" + id+"加入了当前通话");
      if (id !== rtc.params.uid) {
        rtc.client.subscribe(remoteStream, function (err) {
          console.log("stream subscribe failed", err)
        })
      }
      console.log("stream-added remote-uid: ", id)
    })

    // Occurs when a user subscribes to a remote stream.
    rtc.client.on("stream-subscribed", function (evt) {
      var remoteStream = evt.stream
      var id = remoteStream.getId()
      rtc.remoteStreams.push(remoteStream)
      idLabelNum++;
      addView(idLabelNum, id)
      remoteStream.play("remote_video_" + id)
      console.log("stream-subscribed remote-uid: ", id)
    })

    // Occurs when the remote stream is removed; for example, a peer user calls Client.unpublish.
    rtc.client.on("stream-removed", function (evt) {
      var remoteStream = evt.stream
      var id = remoteStream.getId()
      if(remoteStream.isPlaying()) {
        remoteStream.stop()
      }
      rtc.remoteStreams = rtc.remoteStreams.filter(function (stream) {
        return stream.getId() !== id
      })
      removeView(id)
      console.log("stream-removed remote-uid: ", id)
    })

    rtc.client.on("onTokenPrivilegeWillExpire", function(){
      // After requesting a new token
      // rtc.client.renewToken(token);
      layer.msg("onTokenPrivilegeWillExpire")
      console.log("onTokenPrivilegeWillExpire")
    })

    rtc.client.on("onTokenPrivilegeDidExpire", function(){
      // After requesting a new token
      // client.renewToken(token);
      layer.msg("onTokenPrivilegeDidExpire")
      console.log("onTokenPrivilegeDidExpire")
    })

    // 该回调表示远端 Native 用户调用了 enableLocalVideo(true) 打开视频采集---音频转视频
    rtc.client.on("enable-local-video", function(evt){
      var id = evt.uid;
      if(vm.chosenUserList.length==1){
        rtc.localStream.unmuteVideo();
      }else{
        $("#remote_video_panel_"+id).parent(".video-view").css("visibility", "visible");
      }
    })
    
    // 该回调表示远端 Native 用户调用了 enableLocalVideo(false) 关闭视频采集---视频转音频
    rtc.client.on("disable-local-video", function(evt){
      var id = evt.uid;
      if(vm.chosenUserList.length==1){
        rtc.localStream.muteVideo();
      }else{
        $("#remote_video_panel_"+id).parent(".video-view").css("visibility", "hidden");
      }
    })

    // 该回调通知对方，用户在视频通话中将自己的视频关掉
    rtc.client.on("mute-video", function(evt){
      console.log(evt);
      if(vm.chosenUserList.length==1){
        $("#local_stream").parent(".video-view").css("visibility", "hidden");
        rtc.localStream.muteVideo();
      }else{}
    })
    
    // 该回调通知对方，用户在视频通话中将自己的视频打开
    rtc.client.on("unmute-video", function(evt){
      console.log(evt);
      if(vm.chosenUserList.length==1){
        $("#local_stream").parent(".video-view").css("visibility", "visible");
        rtc.localStream.unmuteVideo();
      }else{}
    })
}

  /**
    * rtc: rtc object
    * option: {
    *  mode: string, "live" | "rtc"
    *  codec: string, "h264" | "vp8"
    *  appID: string
    *  channel: string, channel name
    *  uid: number
    *  token; string,
    * }
   **/
function join (rtc, option) {
    if (rtc.joined) {
      layer.msg("您的视频通话已接通。")
      return;
    }

    /**
     * A class defining the properties of the config parameter in the createClient method.
     * Note:
     *    Ensure that you do not leave mode and codec as empty.
     *    Ensure that you set these properties before calling Client.join.
     *  You could find more detail here. https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.clientconfig.html
    **/
    rtc.client = AgoraRTC.createClient({mode: option.mode, codec: option.codec})

    rtc.params = option

    // handle AgoraRTC client event
    handleEvents(rtc)

    // init client
    rtc.client.init(option.appID, function () {
      console.log("init success")

      /**
       * Joins an AgoraRTC Channel
       * This method joins an AgoraRTC channel.
       * Parameters
       * tokenOrKey: string | null
       *    Low security requirements: Pass null as the parameter value.
       *    High security requirements: Pass the string of the Token or Channel Key as the parameter value. See Use Security Keys for details.
       *  channel: string
       *    A string that provides a unique channel name for the Agora session. The length must be within 64 bytes. Supported character scopes:
       *    26 lowercase English letters a-z
       *    26 uppercase English letters A-Z
       *    10 numbers 0-9
       *    Space
       *    "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
       *  uid: number | null
       *    The user ID, an integer. Ensure this ID is unique. If you set the uid to null, the server assigns one and returns it in the onSuccess callback.
       *   Note:
       *      All users in the same channel should have the same type (number or string) of uid.
       *      If you use a number as the user ID, it should be a 32-bit unsigned integer with a value ranging from 0 to (232-1).
      **/
      rtc.client.join(option.token ? option.token : null, option.channel, option.uid ? +option.uid : null, function (uid) {
        console.log("join channel: " + option.channel + " success, uid: " + uid)
        rtc.joined = true

        rtc.params.uid = uid

        // create local stream
        rtc.localStream = AgoraRTC.createStream({
          streamID: rtc.params.uid,
          audio: true,
          video: true,
          screen: false,
          microphoneId: option.microphoneId,
          cameraId: option.cameraId
        })

        // initialize local stream. Callback function executed after intitialization is done
        rtc.localStream.init(function () {
          console.log("init local stream success")
          // play stream with html element id "local_stream"
          rtc.localStream.play("local_stream")

          // publish local stream
          publish(rtc)
        }, function (err)  {
          layer.msg("stream init failed, please open console see more detail")
          console.error("init local stream failed ", err)
        })
      }, function(err) {
        layer.msg("client join failed, please open console see more detail")
        console.error("client join failed", err)
      })
    }, function(err) {
      layer.msg("client init failed, please open console see more detail")
    })
    
    setTimeout(function(){
      if(connectTime==30){
        clearInterval(timeCount);
        layui.use("layer", function(){
          leaveChannel();
          layui.layer.alert("对方长时间无人接听，请稍后再拨！");
        })
      }
    }, 30000);
}

function publish (rtc) {
  if (!rtc.client) {
    layer.msg("请先进入")
    return
  }
  if (rtc.published) {
    layer.msg("Your already published")
    return
  }
  var oldState = rtc.published

  // publish localStream
  rtc.client.publish(rtc.localStream, function (err) {
    rtc.published = oldState
    console.log("publish failed")
  })
  rtc.published = true
}

function unpublish (rtc) {
    if (!rtc.client) {
      layer.msg("Please Join Room First")
      return
    }
    if (!rtc.published) {
      layer.msg("Your didn't publish")
      return
    }
    var oldState = rtc.published
    rtc.client.unpublish(rtc.localStream, function (err) {
      rtc.published = oldState
      console.log("unpublish failed")
    })
    rtc.published = false
}

function leave (rtc) {
    if (!rtc.client) {
      layer.msg("Please Join First!")
      return
    }
    if (!rtc.joined) {
      layer.msg("You are not in channel")
      return
    }
    /**
     * Leaves an AgoraRTC Channel
     * This method enables a user to leave a channel.
     **/
    rtc.client.leave(function () {
      // stop stream
      if(rtc.localStream.isPlaying()) {
        rtc.localStream.stop()
      }
      // close stream
      rtc.localStream.close()
      for (let i = 0; i < rtc.remoteStreams.length; i++) {
        var stream = rtc.remoteStreams.shift()
        var id = stream.getId()
        if(stream.isPlaying()) {
          stream.stop()
        }
        removeView(id)
      }
      rtc.localStream = null
      rtc.remoteStreams = []
      rtc.client = null
      console.log("client leaves channel success")
      rtc.published = false
      rtc.joined = false
      layer.msg("您已退出当前通话！")
    }, function (err) {
      console.log("channel leave failed")
      layer.msg("leave success")
      console.error(err)
    })
}

// This function automatically executes when a document is ready.
$(function () {
    // This will fetch all the devices and will populate the UI for every device. (Audio and Video)
    getDevices(function (devices) {
      devices.audios.forEach(function (audio) {
        $("<option/>", {
          value: audio.value,
          text: audio.name,
        }).appendTo("#microphoneId")
      })
      devices.videos.forEach(function (video) {
        $("<option/>", {
          value: video.value,
          text: video.name,
        }).appendTo("#cameraId")
      })
      M.AutoInit()
    })
});