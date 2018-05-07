var Util = require('Util');
var Net = require('Net');
cc.Class({
    extends:cc.Component,
    properties:{
        timeLabel:cc.Label,//时间
        titleLabel:cc.Label,//标题
        statusIcon:cc.Node,//状态图标
        rootNode:cc.Node,//根节点
    },
    onLoad(){
        this.date = ' ';
        this.status = ' ';
        this.title = ' ';
        this.con = ' ';
        this.id = '';
    },
    start(){
        this.rootNode.on(cc.Node.EventType.TOUCH_END,this.showDetail,this);
    },
    //date status con 时间 状态 内容
    /**
    * @status 0未读 1已读
    * */
    setItem(date,status,con,id){
        date = Util.formatTimeForH5(date)[0]+' '+Util.formatTimeForH5(date)[1];
        let dateSimle = Util.formatTimeForH5(date)[1];
        let title = '';
        if(con.length>9){
            title = (con.substr(0,9))+'...';
            let reg = /(\n|\t)/;
            title = title.replace(reg,'');
        }else{
            title = con+'...'
        }
        this.titleLabel.string = title;
        this.timeLabel.string = dateSimle;
        this.statusIcon.active = status=='0';

        this.date = date;
        this.status = status;
        this.title = title;
        this.con = con;
        this.id = id;
    },
    //显示邮件详情
    showDetail(){
        Global.EmailList.getComponent('EmailList').showDetail(this.con,this.date);
        if(this.status==0){
            this.status = 1;
            this.statusIcon.active = false;
            Net.get('/game/message/update',1,{id:this.id},(res)=>{
                if(res.success){

                }
            })
        }
    }
});
