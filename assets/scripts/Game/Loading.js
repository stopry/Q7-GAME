var Net = require('Net');
cc.Class({
    extends: cc.Component,

    properties: {
        plane:{
            default:null,
            type:cc.Node
        },//飞机
        grass:{
            default:null,
            type:cc.Node
        },//草地
        progress:{
            default:null,
            type:cc.ProgressBar
        },//进度条
        text:{
          default:null,
          type:cc.Label
        },
        maxWidth: 538,//草地最大长度
        maxDistance: 520,//飞机最大距离
        /*版本跟新框部分*/
        boxLayer:{
            default:null,
            type:cc.Node
        },
        verBox:{
            default:null,
            type:cc.Node
        },
        //cancelBtn
        cencelBtn:{
            default:null,
            type:cc.Node
        },
        confirmBtn:{
            default:null,
            type:cc.Node
        },
        bigConfirm:{
            default:null,
            type:cc.Node
        },
        smallSplit:{
            default:null,
            type:cc.Node
        }
        /*版本跟新框部分*/
    },
    // use this for initialization
    onLoad: function () {
        this.removeSplash();
        //this.loadRes();

        this.versionUpdate();
        //cc._initDebugSetting(cc.DebugMode.INFO);
    },
    //加载资源
    loadRes(){
        cc.loader.loadResDir('/', function (num, totalNum, item) {
            //cc.log(num,totalNum,item)
            var pge = num/totalNum;
            this.progress.progress = pge;
            this.plane.x = this.maxDistance*pge;
            this.grass.width = this.maxWidth*pge;
            this.text.string = parseInt(pge*100)+"%";
            if(pge>=1){
                cc.director.loadScene("LogIn",function(){//进入登录界面

                }.bind(this));
            }
        }.bind(this),function(err, assets) {
            //cc.log(assets)
        }.bind(this));
    },
    //判断是否为android平台 调用java方法 移除首屏图片
    removeSplash(){
        let isNative = cc.sys.isNative;
        if(isNative&&cc.sys.os == "Android"){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "removeLaunchImage", "()V");
        }
    },
    //版本更新判断
    versionUpdate(){
        /*console.log(cc.sys.isNative);
        console.log(cc.sys.isMobile,'mobile' , cc.sys.MOBILE_BROWSER,'mbro' , cc.sys.DESKTOP_BROWSER,'dpro')
        console.log(cc.sys.platform,'平台',cc.sys.os,'系统');*/
        var version = 1;
        //type1 ios  2 android
        var type = 1;
        // cc.sys.platform 平台判断 100是手机浏览器 101是pc浏览器

        //如果不是原生平台 直接加载资源进入登录界面
        if (!cc.sys.isNative) {
            this.loadRes();
        }else{//手机app平台 如果是原生平台 判断系统
            if (cc.sys.os == "Windows") {
                this.loadRes();
                return;
            }else if(cc.sys.os == "Android"){
                type = 2;
            }else if(cc.sys.os == "iOS"){
                type = 1;
            }

            Net.get('/version/get',!1,{type:type},(res)=>{
                if(res.success){
                    /**
                     * @type 1->ios 2->android
                     * @version 版本号
                     * @url 下载地址
                     * @coercion 是否强制更新 0->否 1->是
                     * */
                    let obj = res.obj;
                    if(!obj){
                        this.loadRes();
                    }else{
                        //console.log(JSON.stringify(obj));
                        let v = obj.version;
                        let a = obj.coercion;
                        if(v>version){
                            if(a==0){
                                this.bigConfirm.active = false;
                            }else{//强制更新
                                this.cencelBtn.active = false;
                                this.confirmBtn.active = false;
                                this.smallSplit.active = false;
                            }
                            this.showVerBox();
                            this.confirmBtn.on(cc.Node.EventType.TOUCH_END,()=>{
                                cc.sys.openURL(obj.url);
                            },this);
                            this.bigConfirm.on(cc.Node.EventType.TOUCH_END,()=>{
                                cc.sys.openURL(obj.url);
                            },this)
                        }else{
                            this.loadRes();
                        }
                    }
                }else{
                    this.loadRes();
                }
            },(err)=>{
                this.loadRes();
            });

        }
    },
    showVerBox(){
        this.boxLayer.active = true;
        this.verBox.active = true;
    },
    hideVerBox(){
        this.boxLayer.active = false;
        this.verBox.active = false;
        this.loadRes();
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
