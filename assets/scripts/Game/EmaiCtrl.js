var Net = require('Net');
cc.Class({
    extends: cc.Component,

    properties: {
        redDot:{
            default:null,
            type:cc.Node
        },
        alertLayer:{//第一层遮罩层
            default:null,
            type:cc.Prefab
        },
        //邮件start
        msgBox:{
            default:null,
            type:cc.Prefab
        },
        msgBtn:{
            default:null,
            type:cc.Node
        }
        //邮件end
    },
    onLoad () {
        //消息id数组
        this.msgArr = [];
        //this.msgBtn.on(cc.Node.EventType.TOUCH_END,this.openMsgBox,this);
        this.inter_val = null;
        this.getMsg();
        this.init();
    },
    init(){
        this.inter_val = setInterval(()=>{
            this.getMsg();
        },5*1000);
    },
    //把消息列表存到本地且不超过50条
    /*
    * content 消息内容
    * datetime 消息时间
    * type 消息类型 1赠送 2交易
    * */
    saveMsg(msgList){
        let len = msgList.length;//新消息的长度
        var newList;

        //如果新消息的长度大于50 截取后50个
        if(len>50){
            newList = msgList.slice(len-50,len);
        }else {
            newList = msgList;
        }
        let localMsg = cc.sys.localStorage.getItem('msgArr');
        //如果本地没有储存消息
        if(!localMsg){
            cc.sys.localStorage.setItem('msgArr',JSON.stringify(newList));
        }else{//如果本地有消息
            //本地消息长度
            var localLen = JSON.parse(localMsg).length;
            //新消息的长度
            var msgLen = newList.length;

            //console.log(newList, JSON.parse(localMsg),777);

            //在本地消息后追加新消息
            newList = (JSON.parse(localMsg)).concat(newList);


            //如果追加后的消息长度大于50
            if(newList.length>50){
                newList = newList.slice(newList.length-50,newList.length);
            }
        }
        //在本地储存新消息
        cc.sys.localStorage.setItem('msgArr',JSON.stringify(newList));
        this.msgArr = newList;
        return newList;

    },
    //获取消息
    getMsg(){
        Net.get('/game/message/new',1,null,(res)=>{
            if(res.success){
                if(res.obj){
                    this.redDot.active = true;
                }else{
                    this.redDot.active = false;
                }
                /*if(res.obj){
                    //如果消息不为空
                    if(res.obj.length>=1){
                        this.redDot.active = true;
                        Global.isLookMsg = false;
                        this.saveMsg(res.obj);
                    }else{
                        this.saveMsg([]);
                        //如果没有看过新邮件
                        if(!Global.isLookMsg){
                            this.redDot.active = true;
                        }
                    }
                }else{
                    this.saveMsg([]);
                }*/
            }
        });
    },
    //打开普通遮罩层
    opendNormalLayer(){
        if(!Global.layer||!Global.layer.name){
            Global.layer = cc.instantiate(this.alertLayer);
        }
        Global.layer.parent = cc.find('Canvas');
        Global.layer.active = true;
    },
    //打开邮件弹框
    openMsgBox(){
        Global.isLookMsg = true;
        this.redDot.active = false;
        if(this.msgArr.length<=0){
            this.showLittleTip('暂时没有新邮件!');
            return;
        }
        this.opendNormalLayer();
        if(!Global.MsgBox||!Global.MsgBox.name){
            Global.MsgBox = cc.instantiate(this.msgBox);
        }
        Global.MsgBox.parent = cc.find('Canvas');
        Global.MsgBox.getComponent('MsgBox').initMsg(this.msgArr);
        Global.MsgBox.getComponent('MsgBox').showThis();
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    onDestroy(){
        if(this.inter_val){
            clearInterval(this.inter_val);
        }
    },
    // update (dt) {},
});
