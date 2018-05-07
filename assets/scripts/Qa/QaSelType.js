let Util = require('Util');
let QaUtil = require('QaUtil');
cc.Class({
    extends: cc.Component,
    properties: {
        doubleNums:cc.Label,//单p
        threeNums:cc.Label,//3p
        curNode:cc.Node,//当前node
        //匹配弹层
        boxLayer:cc.Node,
        matchBox:cc.Node,
        waitCountDown:cc.Label,//等待倒计时label

    },
    onLoad () {
        this._interVal = null;//匹配倒计时
        this.doubleChance = 0;//单人次数
        this.threeChance = 0;//双人次数
    },
    start () {
        //Util.showTips('你的答题次数已用完');
    },
    showThis(){
        this.curNode.active = true;
        this.curNode.runAction(Global.openAction);
        this.renderThis();
    },
    //初始化自己
    renderThis(){
        Util.getNewToken().then((res)=>{
            if(!res.success){
                Util.showConDia('您的身份过期,请重新登录',()=>{
                    cc.director.loadScene('LogIn');
                },()=>{});
            }else{
                QaUtil.getQaNum().then((res)=>{
                    if(!res.success){
                        Util.showTips(res.msg);
                    }else{
                        this.doubleChance = res.obj.doubleCnt+res.obj.doubleFreeCnt;
                        this.threeChance = res.obj.teamCnt+res.obj.teamFreeCnt;
                        this.doubleNums.string = this.doubleChance
                        this.threeNums.string = this.threeChance
                    }
                });
            }
        });
    },
    //显示匹配弹层
    showMatchLayer(){
        let timer = 0;
        this.boxLayer.active = this.matchBox.active = true;
        this.waitCountDown.string = timer;
        this._interVal = setInterval(_=>{
            timer++;
            this.waitCountDown.string = timer;
        },1000);
    },
    //取消匹配
    cancelMatch(){
        this.boxLayer.active = this.matchBox.active = false;
        clearInterval(this._interVal);
        this.waitCountDown.string = 0;
        this.socket.close();
    },
    //单人答题
    singleQa(){
        Util.showConDia('开始答题,您即将离开游戏进入单人答题.',()=>{
            let token = encodeURI(cc.sys.localStorage.getItem('token'));
            if(!cc.sys.isNative){
                window.location.href = 'http://qa.zjiayuan.com?isFromGame=1&token='+token;
            }else{
                cc.sys.openURL('http://qa.zjiayuan.com?isFromGame=1&token='+token);
            }
        },()=>{

        });
    },
    //双人答题
    doubleQa(){
        Global.Qa.playType = 1;
        if(!this.doubleChance){
            Util.showTips('你的答题次数已用完');
        }else{
            this.connectSocket(1);
        }
    },
    //三人答题
    threeQa(){
        Global.Qa.playType = 2;
        if(!this.threeChance){
            Util.showTips('你的答题次数已用完');
            //Util.showConDia('111',()=>{},()=>{});
        }else{
            this.connectSocket(2);
        }
    },
    //链接socket
    connectSocket(type){
        var message = {
            "cmd":"create",
            "data":type.toString()
        };
        message = JSON.stringify(message);
        Util.getSocketoken().then((res)=>{
            let url = 'ws://'+'web.qa.zjiayuan.com'+'/qa/websocket/' + res.obj.accessToken;

            this.socket =  Util.getPerNode('PersistNode').getComponent('PersistNode').mySocket  = new WebSocket(url);

            this.socket.onopen = (res)=>{
                //console.log(res,'open')

                this.socket.send(message);
                this.socket.onmessage = (res)=>{
                    //console.log(res,'msg');
                    res = JSON.parse(res.data);

                    if(res.cmd=='create'&&res.code==0){//匹配成功
                        this.showMatchLayer();
                    }

                    if(res.cmd=='create'&&res.code!=0){//匹配失败
                        this.cancelMatch();
                        Util.showTips(res.msg);
                    }

                    if(res.cmd=='ready_info'&&res.code==0){//匹配成功
                        cc.director.loadScene('QaReady',()=>{//进入等待界面

                        });
                    }
                };
                this.socket.onclose = (res)=>{
                    cc.log('close');
                };
                this.socket.onerror = (res)=>{
                    cc.log(res,'error');
                };
                //setTimeout(()=>{
                //   cc.director.loadScene('QaReady');
                //},1000);
            }
        });
        //if(!this.socket){
        //
        //}
    },
    onDestroy(){
        //销毁定时器
        if(this._interVal){
            clearInterval(this._interVal);
        }
    },
    // update (dt) {},
});
