module.exports = {
    // 上下文路径
    pageUrl: '/wisdomecology-web/',

    // 接口统一配置
    baseUrl: 'https://www.wisdomjyhc.com:19501/wisdomecology-boot/',//数据接口(本地)
    wsLiveUrl: 'wss://www.wisdomjyhc.com:19000/websocket/liveStream',//websocket
    wsVideoUrl: 'wss://www.wisdomjyhc.com:19001/websocket/videoStream',//高架视频
    rtmpUrl: 'https://www.wisdomjyhc.com:17000/rtmpLive?app=live&stream=rtmpStreamvId',//RTMP
    jsonUrl: 'https://www.wisdomjyhc.com:18091/bigdata/file/wisdomecology/'//JSON地址
}