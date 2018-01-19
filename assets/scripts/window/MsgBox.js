var Net = require('Net');
var Util = require('Util');
cc.Class({
    extends: cc.Component,

    properties: {
        root:{//根节点
            default:null,
            type:cc.Node
        },
        msgCon:{//邮件内容
            default:null,
            type:cc.Label
        },
        msgTime:{//邮件时间
            default:null,
            type:cc.Label
        }
    },
    onLoad () {
        this.msgList = [];
        this.msgIndex = 0;
        this.msgLen = 0;
    },
    //初始化 获取邮件列表
    initMsg(msgArr){
        this.msgList = msgArr;
        let len = this.msgList.length;
        this.msgLen = len;
        this.msgIndex = len-1;
    },
    showThis(){
        this.root.active = true;
        this.root.runAction(Global.openAction);
        this.renderMsg();
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    //渲染邮件文字
    renderMsg(){
        this.msgCon.string = this.msgList[this.msgIndex].content;
        let time = Util.formatTimeForH5(this.msgList[this.msgIndex].datetime);
        this.msgTime.string = time[0]+' '+time[1];
    },
    //显示上一条邮件
    showPreMsg(){
        //this.showLittleTip('pre');
        if(this.msgIndex<=0) return;
        this.msgIndex--;
        this.renderMsg();
    },
    //显示下一条邮件
    showNextMsg(){
        //this.showLittleTip('next');
        if(this.msgIndex>=this.msgLen-1) return;
        this.msgIndex++;
        this.renderMsg();
    },
    onDestroy(){

    },
    // update (dt) {},
});
