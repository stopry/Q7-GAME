cc.Class({
    extends: cc.Component,

    properties: {
        msgBox:{//消息框
            default:null,
            type:cc.RichText
        },
        confirm:{//确定按钮
            default:null,
            type:cc.Node
        },
        cancel:{//取消按钮
            default:null,
            type:cc.Node
        },
        confirmDia:{
            default:null,
            type:cc.Node
        },
        //支付密码
        payPwd:{
            default:null,
            type:cc.EditBox
        },
    },
    // use this for initialization
    onLoad: function () {
        //this.setBoxFun('1111',function(){
        //    cc.log(1)
        //},function(){
        //    cc.log(2)
        //})
    },
    //点击确认或取消按钮都会关闭弹窗 调用closeWindow脚本 id 收入订单id
    setBoxFun(text,conFun,canFun){//设置弹框功能——消息内容-确认回调-取消回调
        this.msgBox.string = "<color=#B23214><outline color=#FFECB4 width=2>"+text+"</outline></color>";
        this.confirm.on(cc.Node.EventType.TOUCH_END,()=>{
            let pwd = (this.payPwd.string).trim();
            if(!pwd){
                this.showLittleTip('请输入支付密码');
            }else{
                conFun(pwd);
            }
        },this);
        this.cancel.on(cc.Node.EventType.TOUCH_END,canFun,this);
    },
    showThis(){//显示自己
        this.confirmDia.active = true;
        var seq = cc.sequence(cc.scaleTo(0.1, 1.2, 1.2),cc.scaleTo(0.1, 1, 1));
        this.confirmDia.runAction(seq);
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
