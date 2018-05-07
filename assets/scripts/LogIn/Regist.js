var Net = require('Net');
var Util = require('Util');
cc.Class({
    extends: cc.Component,

    properties: {
        //手机号
        mobile:{
          default:null,
          type:cc.EditBox
        },
        //验证码
        vCode:{
            default:null,
            type:cc.EditBox
        },
        //密码
        password:{
            default:null,
            type:cc.EditBox
        },
        //二级密码
        payPwd:{
          default:null,
          type:cc.EditBox
        },
        //推荐码
        supCode:{
            default:null,
            type:cc.EditBox
        },
        //推荐码 node
        supCodeNode:{
            default:null,
            type:cc.Node
        },

        /**用于隐藏推广码是使用*/
        //推荐码 label
        supCodeLabel:{
            default:null,
            type:cc.Label
        },
        //推荐码 label node
        supCodeNodeLabel:{
            default:null,
            type:cc.Node
        },
        /**用于隐藏推广码是使用*/
        //获取验证码按钮
        getCodeBtn:{
            default:null,
            type:cc.Button
        },
        //获取验证码按钮内的文字
        codeBtnText:{
            default:null,
            type:cc.Label
        },
        //用户须知复选框
        userLicense:{
            default:null,
            type:cc.Toggle
        },
        //boxLayer
        boxLayer:{
            default:null,
            type:cc.Node
        },
        //license框
        licenseBox:{
            default:null,
            type:cc.Node
        },
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        let channel = null;//渠道数据
        let field1 = null;
        let field2 = null;
        let field3 = null;
        let field4 = null;
        let field5 = null;
        if(!cc.sys.isNative){
            channel = Util.getQueryString('channel');
            field1 = Util.getQueryString('field1');
            field2 = Util.getQueryString('field2');
            field3 = Util.getQueryString('field3');
            field4 = Util.getQueryString('field4');
            field5 = Util.getQueryString('field5');
        }
        cc.director.getScene().getChildByName('ReqAni').active = false;
        this.promoteIpt();
        //是否可以获取验证码
        this.canGetMsgCode = true;
        //提交数据格式
        this.datas = {
            "captchaCode": "",//图形验证码
            "captchaValue": "",//
            "channel": "62",
            "code": "",
            "field1": field1,
            "field2": field2,
            "field3": field3,
            "field4": field4,
            "field5": field5,
            "mobile": "",
            "password": "",
            "superiorId": ""
        };
        //定时器
        this._interVal = null;
        //定时器事件
        this._timer = 60;

    },
    //浏览器平台接受推广码 自动填充推广码
    promoteIpt(){
        if(!cc.sys.isNative){
            let sid = Util.getQueryString('sid');
            if(sid){
                this.supCode.string = sid;
                this.supCodeNode.opacity  = 0;
                this.supCodeNode.active = false;

                this.supCodeLabel.string = sid;
                this.supCodeNodeLabel.opacity = 255;
            }
        }
    },
    //获取短信验证码
    getMsgCode(){
        if(!this.canGetMsgCode){
            this.showLittleTip('请稍后再试');
            return;
        }
        if(!(this.mobile.string).trim()){
            this.showLittleTip('请填写手机号')
            return;
        }else if(!Util.regMobile((this.mobile.string).trim())){
            this.showLittleTip('手机号码格式有误');
            return;
        }

        Net.post('/sms/sendRegSms',!1,{mobile:(this.mobile.string).trim()},(res)=>{
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
        this.supCode.string = '';//推荐码
        if(this._interVal){
            clearInterval(this._interVal);
        }
    },
    //提交数据赋值
    subDatasTran(){
        this.datas.mobile = (this.mobile.string).trim();
        this.datas.code = (this.vCode.string).trim();
        this.datas.password = (this.password.string).trim();
        this.datas.payPassword = (this.payPwd.string).trim();
        this.datas.superiorId = (this.supCode.string).trim()||"0";
    },
    //提交表单
    submitForm(){
        //this.showLittleTip(cc.sys.os);
        if(!(this.mobile.string).trim()){
            this.showLittleTip('请填写手机号');
            return;
        }else if(!(this.vCode.string).trim()){
            this.showLittleTip('请填写短信验证码');
            return;
        }else if(!(this.password.string).trim()){
            this.showLittleTip('请填写密码');
            return;
        }else if(!(this.payPwd.string).trim()){
            this.showLittleTip('请填写二级密码');
            return;
        }else if(!Util.regMobile((this.mobile.string).trim())){
            this.showLittleTip('手机号码格式有误');
            return;
        }else if(!this.userLicense.isChecked){
            this.showLittleTip('请勾选用户协议');
            return;
        }else{
            this.subDatasTran();
            this.subData(this.datas).then((res)=>{
                if(res){
                    this.showLittleTip('注册成功');
                    cocosAnalytics.CAAccount.createRole({
                        roleID:this.datas.mobile,
                        userName:this.datas.password,
                        race:'类型',
                        class:'类型',
                        gameServer : "Z家园"
                    });
                    this.resetForm();
                    setTimeout(()=>{
                        this.backLogin();
                    },1000);
                }
            });
        }
    },
    //提交数据接口
    subData(options){
        cc.director.getScene().getChildByName('ReqAni').active = true;
        let p = new Promise((resolve,reject)=>{
           Net.post('/reg/registerNoImg',!1,options,(data)=>{
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
    //显示弹框
    showLicenseBox(){
        this.boxLayer.active = true;
        this.licenseBox.active = true;
    },
    //关闭弹框
    hideLicenseBox(){
        this.boxLayer.active = false;
        this.licenseBox.active = false;


    },
    //返回登录
    backLogin(){
        cc.director.loadScene("LogIn",()=>{

        })
    },
    //显示提示
    showLittleTip:function(str){
        this.getComponent('LittleTip').setContent(str);
    },
    /*start () {

    },*/
    onDestroy(){
        if(this._interVal){
            clearInterval(this._interVal);
        }
    },
    // update (dt) {},
});
