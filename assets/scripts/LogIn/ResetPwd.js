var Net = require('Net');
var Util = require('Util');
cc.Class({
    extends: cc.Component,
    properties: {
        root:{
            default:null,
            type:cc.Node
        },
       //手机号
        mobile:{
            default:null,
            type:cc.EditBox
        },
        //密码
        password:{
            default:null,
            type:cc.EditBox
        },
        //验证码
        vCode:{
            default:null,
            type:cc.EditBox
        },
        //获取验证码按钮
        getCodeBtn:{
            default:null,
            type:cc.Button
        },
        //获取验证码文字
        codeBtnText:{
            default:null,
            type:cc.Label
        }
    },
    onLoad () {
        //是否可以获取验证码
        this.canGetMsgCode = true;
        //定时器
        this._interVal = null;
        //定时器事件
        this._timer = 60;
        //提交数据
        this.datas = {
            "captchaCode": "",
            "captchaValue": "",
            "code": "",
            "mobile": "",
            "newLoginPwd": ""
        }
    },
    //获取短信验证码
    getMsgCode(){
        if(!this.canGetMsgCode){
            this.showLittleTip('请稍后再试');
            return;
        }
        if(!(this.mobile.string).trim()){
            this.showLittleTip('请填写手机号');
            return;
        }else if(!Util.regMobile((this.mobile.string).trim())){
            this.showLittleTip('手机号码格式有误');
            return;
        }
        cc.director.getScene().getChildByName('ReqAni').active = true;
        Net.post('/sms/sendRestLoginSms',!1,{mobile:(this.mobile.string).trim()},(res)=>{
            if(!res.success){
                this.showLittleTip(res.msg);
                cc.director.getScene().getChildByName('ReqAni').active = false;
            }else{
                cc.director.getScene().getChildByName('ReqAni').active = false;
                this.showLittleTip('验证码发送成功');
                this.canGetMsgCode = false;
                this.getCodeBtn.interactable = false;
                this.codeBtnText.string = '60';
                this._interVal = setInterval(()=>{
                    this._timer--;
                    this.codeBtnText.string = this._timer;
                    if(this._timer<=0){
                        clearInterval(this._interVal);
                        this.canGetMsgCode = true;
                        this.getCodeBtn.interactable = true;
                        this.codeBtnText.string = '重新获取';
                        this._timer = 60;
                    }
                },1000);
            }
        },(err)=>{
            this.showLittleTip('网络错误');
            cc.director.getScene().getChildByName('ReqAni').active = false;
        })
    },
    //重置form
    resetForm(){
        this.canGetMsgCode = true;
        this.codeBtnText.string = '获取验证码';
        this.getCodeBtn.interactable = true;
        this.mobile.string = '';//手机号
        this.vCode.string = '';//验证码
        this.password.string = '';//密码
        if(this._interVal){
            clearInterval(this._interVal);
        }
    },
    //提交数据赋值
    subDatasTran(){
        this.datas.mobile = (this.mobile.string).trim();
        this.datas.code = (this.vCode.string).trim();
        this.datas.newLoginPwd = (this.password.string).trim();
    },
    //提交表单
    submitForm(){
        if(!(this.mobile.string).trim()){
            this.showLittleTip('请填写手机号');
            return;
        }else if(!(this.vCode.string).trim()){
            this.showLittleTip('请填写短信验证码');
            return;
        }else if(!(this.password.string).trim()){
            this.showLittleTip('请填写密码');
            return;
        }else if(!Util.regMobile((this.mobile.string).trim())){
            this.showLittleTip('手机号码格式有误');
            return;
        }else{
            this.subDatasTran();
            this.subData(this.datas).then((res)=>{
                if(res){
                    this.showLittleTip('重置密码成功');
                    this.resetForm();
                    this.closeThis();
                }
            });
        }
    },
    //提交数据接口
    subData(options){
        cc.director.getScene().getChildByName('ReqAni').active = true;
        let p = new Promise((resolve,reject)=>{
            Net.post('/reg/resetLoginPwdNoImg',!1,options,(data)=>{
                if(!data.success){
                    this.showLittleTip(data.msg);
                    reject(data.msg);
                }else{
                    resolve(true);
                }
                cc.director.getScene().getChildByName('ReqAni').active = false;
            },(err)=>{
                this.showLittleTip('网络错误');
                cc.director.getScene().getChildByName('ReqAni').active = false;
                reject(false);
            })
        });
        return p;
    },
    closeThis(){
        this.getComponent('CloseWindow').close("1","1");
    },
    showThis(){
        this.root.active = true;
        this.root.runAction(Global.openAction);
    },
    /*start () {

    },*/
    //显示提示
    showLittleTip:function(str){
        this.getComponent('LittleTip').setContent(str);
    },
    onDestroy(){
        if(this._interVal){
            clearInterval(this._interVal);
        }
    },
    // update (dt) {},
});
