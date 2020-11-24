var appId = "4d04277574e64421a2e1862162f7ddc5";
// var userId = "", channel = "channel"+new Date().getTime(); // 选中的用户UID、房间名
var userId = "", channel = ""; // 选中的用户UID、房间名
var chatType = "video";  //  语音类型
/* 
 * websocket方法设定
 * 初始化、监听、关闭
*/
var webSocket = null;
var websocketFunc = {
    initWebsocket:function(){
      if('WebSocket' in window){
        layui.use('layer',function(){
          layui.layer.load(2,{shade:0.5});
          // var webSocketUrl = "ws://192.168.0.128:9000/websocket/liveStream";
          // var webSocketUrl = "ws://39.105.57.146:9000/websocket/liveStream";
          var webSocketUrl = window.profiles.wsLiveUrl;
          webSocket = new WebSocket(webSocketUrl+"?uId=00426-OEM-8992662-00173");
          webSocket.onopen = function(){
            layui.layer.closeAll("loading");
            console.log("websocket 连接成功");
            if(chatType=="video"){
              var e = event||window.event;
                e.preventDefault();
                // This will start the join functions with all the configuration selected by the user.
                var params = {
                  "appID":appId,
                  "channel":"channel"+userId,
                  "token":"",
                  "UID":userId,
                  "cameraId":$("#cameraId").val(),
                  "microphoneId":$("#microphoneId").val(),
                  "cameraResolution":"default",
                  "mode":"rtc",
                  "codec":"h264"
                }
                join(rtc, params)
            }
          }
          webSocket.onerror = function(){
            console.log("websocket 通信出错");
            var webSocketUrl = window.profiles.wsLiveUrl;
            webSocket = new WebSocket(webSocketUrl+"?uId=00426-OEM-8992662-00173");
          }
        })
      }else {
        alert('当前浏览器不支持websocket，请更换浏览器！')
      }
    },
    sendMsg:function(){
      webSocket.send(JSON.stringify({"uId":userId,"roomName":channel}));
    },
    closeIt:function(){
      webSocket.close();
    }
}

// index.html调用的function
// 获取联系人
function contactListPage(){
    // layui.use('layer',function(){
    //     var layer = layui.layer;
    //     layer.open({
    //         type:2,
    //         title:"联系人列表",
    //         btn:['开始语音','开始视频', "取消"],
    //         area:["650px", "80%"],
    //         content:"contactList.html",
    //         yes:function(index, layero){
    //           chatType = "audio";
    //           var iframeWin = window[layero.find('iframe')[0]['name']];
    //           userId = iframeWin.getUserId();
    //           sendNotice(userId);
    //           layer.close(index);
    //         },
    //         btn2:function(index, layero){
    //           chatType = "video";
    //           var iframeWin = window[layero.find('iframe')[0]['name']];
    //           userId = iframeWin.getUserId();
    //           sendNotice(userId);
    //           layer.close(index);
    //         }
    //     })
    // })
    layui.use('layer',function(){
        var layer = layui.layer;
        layer.open({
            type:2,
            title:"联系人列表",
            btn:['开始视频', "取消"],
            area:["650px", "80%"],
            content:"contactList.html",
            yes:function(index, layero){
              chatType = "video";
              var iframeWin = window[layero.find('iframe')[0]['name']];
              userId = iframeWin.getUserId();
              sendNotice(userId);
              layer.close(index);
            }
        })
    })
}
// 挂断
function leaveChannel(){
  // websocketFunc.closeIt();
  var e = event||window.event;
  e.preventDefault()
  leave(rtc)
}
// 音视频切换
function changeType(){
  if(chatType == "video"){  // 视频转语音
    chatType = "audio";
    rtc.localStream.muteVideo();
    $(".video-view").css("visibility", "hidden");
  }else{        // 语音转视频
    chatType = "video";
    rtc.localStream.unmuteVideo();
    $(".video-view").css("visibility", "visible");
  }
  sendCallType(chatType);
}
// 发送通话请求通知
function sendNotice(uId){
  layui.use('layer', function(){
    var layer = layui.layer;
    $.ajax({
      type:"post",
      url:baseUrl+"index/sendVideoReq",
      dataType:"json",
      data:{
        uId:uId
      },
      beforeSend:function(){
        layer.load(2,{shade:0.6});
      },
      success:function(ret){
        if(ret.code == 0){
          // websocketFunc.initWebsocket();
          if(chatType=="video"){
            var e = event||window.event;
            e.preventDefault();
            // This will start the join functions with all the configuration selected by the user.
            var params = {
              "appID":appId,
              "channel":"channel"+userId,
              "token":"",
              "UID":userId,
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
function sendCallType(chatType){
  layui.use('layer', function(){
    var layer = layui.layer;
    $.ajax({
      type:"post",
      url:baseUrl+"index/sendAPPVAReq",
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
var layer;
layui.use('layer', function(){
  layer = layui.layer;
});

function addView (id, show) {
    if (!$("#" + id)[0]) {
      $("<div/>", {
        id: "remote_video_panel_" + id,
        class: "video-view",
		style: "position: absolute; width: 100%; height: 100%; bottom: 0; right: 0; z-index: 199;"
      }).appendTo("#video")

      $("<div/>", {
        id: "remote_video_" + id,
        class: "video-placeholder",
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
var connectTime,timeCount;

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
      console.log("id", evt);
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
      leaveChannel();
      layer.msg("对方退出了当前通话")
      console.log("peer-leave", id)
    })

    // Occurs when the local stream is published.
    rtc.client.on("stream-published", function (evt) {
      layer.msg("stream published success")
      console.log("stream-published")
    })

    // Occurs when the remote stream is added.
    rtc.client.on("stream-added", function (evt) { 
      clearInterval(timeCount);
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
      addView(id)
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
    rtc.client.on("enable-local-video", function(){
      if(chatType=="audio"){
        $(".video-view").css("visibility", "visible");
        rtc.localStream.unmuteVideo();
      }
    })

    // 该回调表示远端 Native 用户调用了 enableLocalVideo(false) 关闭视频采集---视频转音频
    rtc.client.on("disable-local-video", function(){
      if(chatType=="video"){
        $(".video-view").css("visibility", "hidden");
        rtc.localStream.muteVideo();
      }
    })

    // 该回调通知应用，对方用户在视频通话中将自己的视频关掉
    rtc.client.on("mute-video", function(){
      console.log("mute-video");
      $(".video-view").css("visibility", "hidden");
      rtc.localStream.muteVideo();
    })

    // 该回调通知应用，对方用户在视频通话中将自己的视频打开
    rtc.client.on("unmute-video", function(){
      console.log("unmute-video");
      $(".video-view").css("visibility", "visible");
      rtc.localStream.unmuteVideo();
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
          leave(rtc);
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
    
    // This publishes the video feed to Agora
    $("#publish").on("click", function (e) {
      console.log("publish")
      e.preventDefault()
      publish(rtc)
    });
    // Unpublishes the video feed from Agora
    $("#unpublish").on("click", function (e) {
      console.log("unpublish")
      e.preventDefault()
      unpublish(rtc)
    });
});