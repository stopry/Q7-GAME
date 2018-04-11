//jquery-ajax
//<script src="./zepto.min.js"></script>

//微信api接口 打包后添加到 index.html
//<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>

//复制插件代码
//<script src="https://cdn.jsdelivr.net/npm/clipboard@1/dist/clipboard.min.js"></script>

//Jquery
//<script src="https://cdn.bootcss.com/jquery/2.1.4/jquery.min.js"></script>

$(function(){
  
});

function getDataAndRegist(){
  $.ajax({
    url:'/market/wx/getJsapiInfo',
    type:'GET',
    data:{urlStr:window.location.href},
    success:function(res){
      console.log(res);
      if(res.success){
        var obj = res.obj;
        wx.config({
          debug: false,
          appId: 'wxaaefb51cb3707a3a',
          timestamp: parseInt(obj.timestamp),//服务端获取
          nonceStr: obj.nonceStr,//服务端获取
          signature: obj.signature,//服务端获取
          jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',//分享到朋友圈
            'onMenuShareAppMessage',//分享到微信好友
          ]
        });
      }

      //registShare();

    },
    error:function(error){

    }
  })
}
setTimeout(function(){
  getDataAndRegist();
},1000)

wx.ready(function () {
  // 1 判断当前版本是否支持指定 JS 接口，支持批量判断
  wx.checkJsApi({
    jsApiList: [
      'getNetworkType',
      'previewImage'
    ],
    success: function (res) {
      //alert(JSON.stringify(res));
    }
  });

  //getDataAndRegist();

  /*
  // 2. 分享接口
  // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
  wx.onMenuShareAppMessage({
    title: Global.wxShare.title,
    desc: Global.wxShare.desc,
    link: Global.wxShare.link,
    imgUrl: Global.wxShare.imgUrl,
    trigger: function (res) {
      //alert('用户点击发送给朋友');
    },
    success: function (res) {
      //alert('已分享');
    },
    cancel: function (res) {
      //alert('已取消');
    },
    fail: function (res) {
      //alert(JSON.stringify(res));
    }
  });

  // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
  wx.onMenuShareTimeline({
    title: Global.wxShare.title,
    desc: Global.wxShare.desc,
    link: Global.wxShare.link,
    imgUrl: Global.wxShare.imgUrl,
    trigger: function (res) {
      //alert('用户点击分享到朋友圈');
    },
    success: function (res) {
      //alert('已分享');
    },
    cancel: function (res) {
      //alert('已取消');
    },
    fail: function (res) {
      //alert(JSON.stringify(res));
    }
  });
  */

});

function registShare(){
  //console.log(Global.wxShare);
  // 2. 分享接口
  // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
  wx.onMenuShareAppMessage({
    title: Global.wxShare.title,
    desc: Global.wxShare.desc,
    link: "http://www.senchen.vip/goUrl.html?url="+Global.wxShare.link,
    imgUrl: Global.wxShare.imgUrl,
    trigger: function (res) {
      //alert('用户点击发送给朋友');
    },
    success: function (res) {
      //alert('已分享');
    },
    cancel: function (res) {
      //alert('已取消');
    },
    fail: function (res) {
      //alert(JSON.stringify(res));
    }
  });

  // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
  wx.onMenuShareTimeline({
    title: Global.wxShare.title,
    desc: Global.wxShare.desc,
    link: "http://www.senchen.vip/goUrl/goUrl.html?url="+Global.wxShare.link,
    imgUrl: Global.wxShare.imgUrl,
    trigger: function (res) {
      //alert('用户点击分享到朋友圈');
    },
    success: function (res) {
      //alert('已分享');
    },
    cancel: function (res) {
      //alert('已取消');
    },
    fail: function (res) {
      //alert(JSON.stringify(res));
    }
  });
}