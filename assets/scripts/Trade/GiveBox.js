var Net = require('Net');
var util = require('Util');
cc.Class({
    extends: cc.Component,

    properties: {
        //根节点
        root:{
            default:null,
            type:cc.Node
        },
        //绿能选择框
        greenSelBox:{
            default:null,
            type:cc.Node
        },
        //active图片节点
        activeNode:{
            default:null,
            type:cc.Node
        },
        //六个绿能节点
        greenItemNode:{
            default:[],
            type:[cc.Node]
        },
        /*form表单元素s*/
        //绿能类型label
        greenType:{
            default:null,
            type:cc.Label
        },
        //接收对象
        targetPerson:{
            default:null,
            type:cc.EditBox
        },
        //赠送数量
        giveCnt:{
            default:null,
            type:cc.EditBox
        },
        //索取金币
        getGold:{
            default:null,
            type:cc.EditBox
        },
        //支付密码
        payPwd:{
            default:null,
            type:cc.EditBox
        },
        /*form表单元素e*/
        //确认弹框
        alertLayer:{
            default:null,
            type:cc.Prefab
        },
        conDia:{
            default:null,
            type:cc.Prefab
        },
    },
    onLoad () {
        //是否第一次初始化
        this.onceInit = true;
        //指定交易提交参数
        //临时参数 未点击确定时
        /*this.tempPara = {
            itemId: null,//交易物品id
            receMobile: null,//接收人手机号
            cnt: null,//交易数量
            amt: null,//索取金币
            payPwd: null,//支付密码
            pName:null
        };*/
        this.tempPara = {
            "cnt": null,//交易数量
            "gold": null,//索取金币
            "greenId": null,//交易物品id
            "greenName": null,//绿能名字
            "mobile": null,//接收人手机号
            "paypwd": null//支付密码
        };
        //this.para = {
        //    itemId: null,//交易物品id
        //    receMobile: null,//接收人手机号
        //    cnt: null,//交易数量
        //    amt: null,//索取金币
        //    payPwd: null,//支付密码
        //    pName:null
        //};
        this.para = {
            "cnt": null,//交易数量
            "gold": null,//索取金币
            "greenId": null,//交易物品id
            "greenName": null,//绿能名字
            "mobile": null,//接收人手机号
            "paypwd": null//支付密码
        };
    },
    //显示赠送框
    openGiveBox(){
        this.root.active = true;
    },
    //关闭赠送框
    closeGiveBox(){
        this.root.active = false;
    },
    /**
     * @itemNode 绿能节点
     * @greenInfo 绿能信息 pName名称 id id cnt 数量
     *
     */
    initGreenContainer(itemNode,greenInfo){
        greenInfo = greenInfo || {};
        itemNode.opacity = greenInfo.cnt>0?255:50;
        if(greenInfo.cnt){
            itemNode.on(cc.Node.EventType.TOUCH_END,()=>{
                if(!greenInfo.cnt) return;
                let pos = itemNode.getPosition();
                this.activeNode.active = true;
                this.activeNode.setPosition(pos);
                this.tempPara.greenId = greenInfo.id;
                this.tempPara.greenName = greenInfo.pName;
                this.tempPara.cnt = greenInfo.cnt;
            },this);
        }
    },
    //初始化绿能选择框
    renderGreenBox(){
        //改为从仓库取绿能
        Net.get('/game/getPlayerItemList',1,{type:4},(res)=>{
            console.log(res);
            if(!res.success){
                this.showLittleTip(res.msg);
            }else{
                let list = res.obj;
                if(!list.length){
                    this.showLittleTip('您还没有绿能');
                }else{
                    let greenInfo = util.formatGiveGreenData(list);
                    for(let i = 0;i<greenInfo.length;i++){
                        this.initGreenContainer(this.greenItemNode[i],greenInfo[i]);
                    }
                    this.greenSelBox.active = true;
                }
            }
        },()=>{
            this.showLittleTip('网络错误');
        });
    },
    //确定选择绿能
    confirmSelGreen(){
        if(!this.tempPara.greenId){
            this.showLittleTip('您还没有选择绿能');
            return;
        }
        this.greenType.string = this.para.greenName = this.tempPara.greenName;
        this.para.greenId = this.tempPara.greenId;
        this.para.cnt = this.tempPara.cnt;
        this.closeSelGreenBox();
    },
    //给提交参数赋值
    assignValToPara(){
        this.para.mobile = (((this.targetPerson.string).trim()).replace(/\([^\)]*\)/g ,'')).trim();
        this.para.cnt = (this.giveCnt.string).trim();
        this.para.gold = (this.getGold.string).trim();
        this.para.paypwd = (this.payPwd.string).trim();
        this.para.greenName = (this.greenType.string).trim();
    },
    //接收对象输入完成后处理
    onEndedIptReceiver(){
        /*验证姓名 没接口*/
        //if((this.targetPerson.string).trim()=='') return;
        //if(!util.verMobileReg((this.targetPerson.string).trim())){
        //    this.targetPerson.string = ((this.targetPerson.string).trim()).replace(/\([^\)]*\)/g ,'')+'(用户不存在)';
        //}else{//向后台请求查询用户是否存在
        //    let mobile = ((this.targetPerson.string).trim()).replace(/\([^\)]*\)/g ,'');
        //    Net.get('/user/getUserRealName',1,{"mobile":mobile},(res)=>{
        //        console.log(res);
        //        if(res.obj){
        //            this.targetPerson.string = ((this.targetPerson.string).trim()).replace(/\([^\)]*\)/g ,'')+'('+res.obj+')';
        //        }else{
        //            this.targetPerson.string = ((this.targetPerson.string).trim()).replace(/\([^\)]*\)/g ,'')+'(用户不存在)';
        //        }
        //    },()=>{
        //        this.showLittleTip('网络错误');
        //    });
        //}
        //this.targetPerson.string = '';
    },
    //判断是否是数字 如果不是返回false
    myIsNaN(value) {
        return typeof value === 'number' && isNaN(value);
    },
//赠送数量输入完成后处理
    onEndedIptCnt(){
        let cnt = (this.giveCnt.string).trim();
        if(!cnt) return;
        if(this.myIsNaN(parseInt(cnt))){
            this.giveCnt.string = this.para.cnt;
            return;
        }
        if(this.para.cnt<parseInt(this.giveCnt.string)){
            this.giveCnt.string = this.para.cnt;
        }
    },
    //提交赠送表单
    subGiveForm(){
        this.assignValToPara();
        if(!this.para.greenId||!this.para.greenName){
            this.showLittleTip('请选择要赠送的绿能');
            return
        }else if(!this.para.mobile){
            this.showLittleTip('请填写接收人手机号');
            return
        }else if(!this.para.cnt){
            this.showLittleTip('请填写赠送数量');
            return
        }else if(!this.para.gold){
            this.showLittleTip('请填写索取金币');
            return
        }else if(!this.para.paypwd){
            this.showLittleTip('请填写支付密码');
            return
        }else if(!util.verMobileReg(this.para.mobile)){
            this.showLittleTip('输入手机号有误');
            return
        }else if(this.myIsNaN(parseInt(this.para.cnt))){
            this.showLittleTip('赠送数量有误');
            return
        }else if(this.myIsNaN(parseInt(this.para.gold))){
            this.showLittleTip('索取金币有误');
            return
        }
        this.showConDia(
            '绿能类型:'+this.para.greenName+'\n接收人:'+this.para.mobile+'\n数量:'+this.para.cnt+'\n索取金币:'+this.para.gold,
            ()=>{
                this.confirmSub();
            },
            ()=>{}
        )
    },
    //确认提交
    confirmSub(){
        cc.director.getScene().getChildByName('ReqAni').active = true;
        Net.post('/game/giving/giving',1,this.para,(res)=>{
            if(!res.success){
                this.showLittleTip(res.msg);
            }else{
                this.showLittleTip('提交成功');
                this.clearPara();
            }
            cc.director.getScene().getChildByName('ReqAni').active = false;
        },()=>{
            this.showLittleTip('网络错误');
            cc.director.getScene().getChildByName('ReqAni').active = false;
        })
    },
    //清空form 临时参数 提交参数
    clearPara(){
        this.greenType.string = '';
        this.targetPerson.string = '';
        this.giveCnt.string = '';
        this.getGold.string = '';
        this.payPwd.string = '';
        for(let key in this.tempPara){
            this.tempPara[key] = null;
        }
        for(let keys in this.para){
            this.para[keys] = null;
        }
    },
    //打开绿能选择框
    openSelGreenBox(){
        this.renderGreenBox();
    },
    //关闭绿能选择狂
    closeSelGreenBox(){
        this.greenSelBox.active = false;
        this.activeNode.active = false;
        //清空临时参数
        for(let key in this.tempPara){
            this.tempPara[key] = null;
        }
    },
    /*start () {

    },*/
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    showConDia(msg,fn1,fn2){//弹出确认对话框
        if(!Global.conLayer||!Global.conLayer.name){
            Global.conLayer = cc.instantiate(this.alertLayer);
        }
        Global.conLayer.parent = this.root;
        Global.conLayer.active = true;

        var dia = cc.instantiate(this.conDia);
        dia.parent = this.root;
        dia.getComponent('ConfirmDia').setBoxFun(msg,fn1,fn2);
        dia.getComponent('ConfirmDia').showThis();
    },
    onDestroy(){

    },
    // update (dt) {},
});
