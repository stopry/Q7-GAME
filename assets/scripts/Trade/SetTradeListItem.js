var Net = require('Net');
var util = require('Util');
cc.Class({
    extends: cc.Component,
    properties: {
        //绿能的六个文本图片
        greenPics:{
            default:[],
            type:[cc.SpriteFrame]
        },
        //绿能类型
        green:{
            default:null,
            type:cc.Sprite
        },
        //接收人手机号
        accepter:{
            default:null,
            type:cc.Label
        },
        //赠送数量
        giveNum:{
            default:null,
            type:cc.Label
        },
        //索取金币
        getGold:{
            default:null,
            type:cc.Label
        },
        //确定撤销按钮
        oprBtn:{
            default:[],
            type:[cc.Node]
        },
        //状态文字
        statusText:{
            default:null,
            type:cc.Label
        },
        /*确认对话框资源*/
        alertLayer:{
            default:null,
            type:cc.Prefab
        },
        conDia:{
            default:null,
            type:cc.Prefab
        },
        conDiaIpt:{
            default:null,
            type:cc.Prefab
        }
    },
    onLoad () {
        //默认类型为收入类型
        this.type = 1;
        //要交易商品的id
        this.id = null;
    },
    //设置列表
    //type 1 id 订单id
    setItem(green,accepter,giveNum,getGold,type,id,status){
        this.green.spriteFrame = this.greenPics[green];
        this.accepter.string = accepter;
        this.giveNum.string = giveNum;
        this.getGold.string = getGold;
        this.type = type;
        this.id = id;
        this.status = status;
        this.oprBtn[0].active = this.type==1;//确定按钮 in
        this.oprBtn[2].active = this.type==1;//拒绝按钮 in
        this.oprBtn[1].active = this.type==2;//撤销按钮 out
        this.statusText.string = '';
        if(status>1){
            this.oprBtn[0].active = false;//确定按钮 in
            this.oprBtn[2].active = false;//拒绝按钮 in
            this.oprBtn[1].active = false;//撤销按钮 out
            let _text = '';
            if(status==2){
                _text = '已接受';
            }else if(status==3){
                _text = '已拒绝';
            }else{
                _text = '已撤销';
            }
            this.statusText.string = _text;
        }
    },
    //确认当前列表收入订单
    confirmInOrder(){
        this.showConIpt('确认此订单?',(pwd)=>{
            //像后台发送确认订单请求
            cc.director.getScene().getChildByName('ReqAni').active = true;
            Net.get('/game/giving/accept',1,{id:this.id,payPassword:pwd},(res)=>{
                if(!res.success){
                    this.showLittleTip(res.msg);
                }else{
                    this.showLittleTip('交易成功');
                    this.updateTradeList();
                }
                this.closeInDia();
                cc.director.getScene().getChildByName('ReqAni').active = false;
            },()=>{
                this.closeInDia();
                this.showLittleTip('网络错误');
                cc.director.getScene().getChildByName('ReqAni').active = false;
            });
        },()=>{

        })
    },
    //拒绝当前列表收入订单
    refuseInOrder(){
        this.showConDia('拒绝此订单?',()=>{
            //像后台发送拒绝订单请求
            cc.director.getScene().getChildByName('ReqAni').active = true;
            Net.get('/game/giving/reject',1,{id:this.id},(res)=>{
                if(!res.success){
                    this.showLittleTip(res.msg);
                }else{
                    this.showLittleTip('拒绝成功');
                    this.updateTradeList();
                }
                cc.director.getScene().getChildByName('ReqAni').active = false;
            },()=>{
                this.showLittleTip('网络错误');
                cc.director.getScene().getChildByName('ReqAni').active = false;
            });
        },()=>{

        });
    },
    //更新交易记录列表
    updateTradeList(){//1 in 2 out
        if(Global.tradeHisBox&&Global.tradeHisBox.name){
            Global.tradeHisBox.getComponent('TradeHistory').initList();
        }
    },
    //关闭确认收入弹框
    closeInDia(){
        this.diaIpt.active = false;
        this.diaIpt.destroy();
        Global.conLayer.active = false;
    },
    //撤销当前列表赠出订单
    confirmOutOrder(){
        this.showConDia('确定撤销此订单吗?',()=>{
            //像后台发送确认订单请求
            cc.director.getScene().getChildByName('ReqAni').active = true;
            Net.get('/game/giving/cancel',1,{id:this.id},(res)=>{
                if(!res.success){
                    this.showLittleTip(res.msg);
                }else{
                    this.showLittleTip('撤销成功');
                    this.updateTradeList();
                }
                cc.director.getScene().getChildByName('ReqAni').active = false;
            },()=>{
                this.showLittleTip('网络错误');
                cc.director.getScene().getChildByName('ReqAni').active = false;
            });
        },()=>{})
    },
    showConDia(msg,fn1,fn2){//弹出确认对话框
        if(!Global.conLayer||!Global.conLayer.name){
            Global.conLayer = cc.instantiate(this.alertLayer);
        }
        Global.conLayer.parent = cc.find('Canvas');
        Global.conLayer.active = true;
        var dia = cc.instantiate(this.conDia);
        dia.parent = cc.find('Canvas');
        dia.getComponent('ConfirmDia').setBoxFun(msg,fn1,fn2);
        dia.getComponent('ConfirmDia').showThis();
    },
    showConIpt(msg,fn1,fn2){//确认收入订单（带输入交易密码） 弹出确认对话框
        if(!Global.conLayer||!Global.conLayer.name){
            Global.conLayer = cc.instantiate(this.alertLayer);
        }
        Global.conLayer.parent = cc.find('Canvas');
        Global.conLayer.active = true;
        var dia = cc.instantiate(this.conDiaIpt);
        this.diaIpt = dia;
        dia.parent = cc.find('Canvas');
        dia.getComponent('ConfirmDiaIpt').setBoxFun(msg,fn1,fn2);
        dia.getComponent('ConfirmDiaIpt').showThis();
    },
    onDestroy(){

    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    // update (dt) {},
});
