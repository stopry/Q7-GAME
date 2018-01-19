var Net = require('Net');
var util = require('Util');
cc.Class({
    extends:cc.Component,
    properties:{
        /*弹框遮罩层*/
        boxLayer:{
            default:null,
            type:cc.Node
        },
        /*升级治理遮罩层*/
        upDealLayer:{
            default:null,
            type:cc.Node
        },
        //根节点
        root:{
            default:null,
            type:cc.Node
        },
        //确认操作对话框
        conDia:{
            default:null,
            type:cc.Prefab
        },
        //弹框遮罩层
        alertLayer:{
            default:null,
            type:cc.Prefab
        },
        /*主场景*/
        //营业证详细信息
        licenseDetailBox:{
            default:null,
            type:cc.Node
        },
        //工厂头部图片
        facPic:{
            default:null,
            type:cc.Sprite
        },
        //污染度进度条
        wrdPrg:{
            default:null,
            type:cc.ProgressBar
        },
        //污染度数值显示
        wrdNumText:{
            default:null,
            type:cc.Label
        },
        //排污量label
        pwlTxt:{
            default:null,
            type:cc.RichText
        },
        //产能label
        cnTxt:{
            default:null,
            type:cc.RichText
        },
        //已盈利
        yyl:{
            default:null,
            type:cc.RichText
        },
        //头部信息结束

        /*营业执照信息*/
        //法人代表label
        legalTxt:{
            default:null,
            type:cc.RichText
        },
        //工厂编号label
        facNumTxt:{
            default:null,
            type:cc.RichText
        },
        //营业范围label
        bniRngTxt:{
            default:null,
            type:cc.RichText
        },

        //工厂建筑
        facBud:{
            default:null,
            type:cc.Node
        },
        //工厂头像
        facHeadPics:{
          default:[],
          type:cc.SpriteFrame
        },
        //工厂背景图
        facPics:{
            default:[],
            type:[cc.SpriteFrame]
        },
        /*治理弹框*/
        //治理环境对话框
        dealEvnBox:{
            default:null,
            type:cc.Node
        },
        //污染度进度条
        ploPrg:{
            default:null,
            type:cc.ProgressBar
        },
        //污染度进度条数字
        ploNumText:{
            default:null,
            type:cc.Label
        },
        //绿能储备
        greenAmt:{
            default:null,
            type:cc.Label
        },
        //绿能储备量介绍标题
        greenAmtDesc:{
            default:null,
            type:cc.Label
        },
        /*展开关闭头部底部按钮*/
        topBotToggleBtn:{
            default:null,
            type:cc.Node
        },
        //头部
        header:{
            default:null,
            type:cc.Node
        },
        //底部
        footer:{
            default:null,
            type:cc.Node
        },
        //治理框中的治理按钮
        dealBtnInBox:{
            default:null,
            type:cc.Node
        },
        //工厂动画遮罩层
        facAniMask:{
            default:[],
            type:[cc.Node]
        },
        //六个工厂的动画parent Node
        facAniBox:{
            default:[],
            type:[cc.Node]
        },
        //倒计时label
        countDownLabel:{
            default:null,
            type:cc.RichText
        },
        //倒计时node节点
        countDownNode:{
            default:null,
            type:cc.Node
        }
    },
    onLoad(){
        // this._countdown = 7266760;//更新倒计时
        this._countdown = null;//更新倒计时
        //关闭加载动画
        cc.director.getScene().getChildByName('ReqAni').active = false;
        //设置是从工厂返回
        Global.isBackFromFac = true;
        //定时更新工厂定时器
        this.inter_val = null;
        //当前工厂id
        this.facId = cc.sys.localStorage.getItem('factoryId')||'none';
        //当前绿能数量
        this.greenCnt = 0;
        //头部底部展开状态
        this.showStatus = false;
        //当前工厂是否需要治理
        this.facShouldDeal = true;
        //初始化
        this.init();
        //定时更新
        let self = this;
  /*      this.inter_val = setInterval(()=>{
            self.renderScene(true);
        },1000*60);*/
        this.toggleTopBot();
        //定时跟新
        this.facInterval = null;

        // this.facInterval = setInterval(()=>{
        //     this.facCountDown();
        // },1000);
    },
    init(){
        this.renderScene(false);
    },
    //显示营业执照
    showLicense(){
        this.boxLayer.active = true;
        this.setPosIndex(this.licenseDetailBox);
    },
    //关闭营业执照
    closeLicense(){
        this.boxLayer.active = false;
        this.licenseDetailBox.active = false;
    },
    /*界面渲染*/
    //主场景渲染
    renderScene(bool){
        //bool为真渲染场景和治理框
        bool = bool||null;
        this.getFactoryInfo(this.facId).then((res)=>{
            if(res){
                this.wrdPrg.progress = res.pl/res.max;//头部污染度进度条
                this.wrdNumText.string = res.pl+"/"+res.max;//进度条数值显示
                this.pwlTxt.string = "<outline color=#5D1A0A width=1>"+res.plph+"吨/每天</outline>";//头部污染度
                this.cnTxt.string = "<outline color=#8A4B11 width=2>"+res.uph+"金币/每天</outline>";//头部产能
                this.yyl.string = "<outline color=#8A4B11 width=2>"+res.totalUph+"金币</outline>";//头部已盈利
                //营业执照信息
                if(this.getPerNode()){//法人信息
                    let name =  this.perNode.getComponent('PersistNode').userData.selfInfo.nickname;
                    this.legalTxt.string = "<outline color=#5D1A0A width=1>"+name+"</outline>";
                }
                this.facNumTxt.string = "<outline color=#5D1A0A width=1>"+res.no||'未激活'+"</outline>";//工厂编号
                this.bniRngTxt.string = "<outline color=#5D1A0A width=1>"+res.business+"</outline>";//营业范围
                //倒计时毫秒数
                this._countdown = res.countdown;
                this.countDownNode.active = res.status==1;
                if(this._countdown>0){
                    this.facInterval = setInterval(()=>{
                        this.facCountDown();
                    },1000);
                }
                this.facBgHeadPicSet(res.type);
                // this.facBgHeadPicSet(2);
                //根据工厂类型播放相关动画
                this.facAniCtr(res.type,res.status);
                // this.facAniCtr(2,1);

                if(bool){
                    this.renderDealBox(res);
                }
            }
        });
    },
    //工厂背景图和头像和动画框设置
    facBgHeadPicSet(type){
        type = parseInt(type);
        if(type===2){//锅炉厂
            this.facAniMask[0].active = true;
        }else if(type===4){//石化厂
            this.facAniMask[1].active = true;
        }else if(type===5){//水泥厂
            this.facAniMask[2].active = true;
        }else if(type===6){//冶金厂
            this.facAniMask[3].active = true;
        }
        this.facAniBox[type-1].active = true;

        this.facBud.getComponent(cc.Sprite).spriteFrame = this.facPics[type-1];//工厂背景图
        this.facPic.spriteFrame = this.facHeadPics[type-1];//工厂头像
    },
    //动画控制
    aniPlayCtr(status,aniBox){//status(012 未激活 生成 停产)为1播放动画 否者停止动画 aniBox->动画父容器
        status = status==1;
        let children = aniBox.getChildren();//父节点的所有children
        let len = children.length;//children的数量
        //循环children
        for(let i = 0;i<len;i++){
            let aniName;//clip的名字
            let isHasAni = children[i].getComponent(cc.Animation);//判断child是否有animation组件
            if(isHasAni&&status){//如果有动画组件且status为1则播放child上的动画
                aniName = isHasAni._clips[0].name;
                isHasAni.play(aniName);
            }else if(isHasAni&&!status){////如果有动画组件且status不为1则停止播放child上的动画
                aniName = isHasAni._clips[0].name;
                isHasAni.stop(aniName);
            }
        }
    },
    //工厂动画控制
    facAniCtr(type,status){

        this.aniPlayCtr(status,this.facAniBox[parseInt(type)-1])

        /*switch (type){
            case "1":
                if(status==1){
                    this.facBud.getComponent(cc.Animation).play('zaozhi');
                }else{
                    this.facBud.getComponent(cc.Animation).stop('zaozhi');
                }
                break;
            case "2":
                if(status==1){
                    this.facBud.getComponent(cc.Animation).play('guolu');
                }else{
                    this.facBud.getComponent(cc.Animation).stop('guolu');
                }
                break;
            case "3":
                if(status==1){
                    this.facBud.getComponent(cc.Animation).play('huagong');
                }else{
                    this.facBud.getComponent(cc.Animation).stop('huagong');
                }
                break;
            case "4":
                if(status==1){
                    this.facBud.getComponent(cc.Animation).play('shiyou');
                }else{
                    this.facBud.getComponent(cc.Animation).stop('shiyou');
                }
                break;
            case "5":
                if(status==1){
                    this.facBud.getComponent(cc.Animation).play('shuini');
                }else{
                    this.facBud.getComponent(cc.Animation).stop('shuini');
                }
                break;
            case "6":
                if(status==1){
                    this.facBud.getComponent(cc.Animation).play('yejin');
                }else{
                    this.facBud.getComponent(cc.Animation).stop('yejin');
                }
                break;
        }*/
    },
    getPerNode(){//得到常驻节点
        this.perNode = cc.director.getScene().getChildByName('PersistNode');
        return this.perNode;
    },
    //办公室渲染
    /*renderOfficeRoom(){
        let of = this.mockDatas().facInfo;
        this.facLv_o.string = of.license.level;
        this.legal_o.string = of.license.legal;
        this.facNum_o.string = of.license.num;
        this.bniRang_o.string = of.license.range;
        this.wrdPrg_o.progress = of.pl/100;
        this.wrdNumText_o.string = of.pl+"/100";
        this.pwl_o.string = of.plph+"吨/小时";
        this.cn_o.strig = of.uph+"金币/每小时";
        this.profit_o.string = of.profit+"金币";
        this.activeCndt_o.removeAllChildren();
        for(let i = 0;i<of.active.condition.length;i++){
            if(i!=of.active.condition.length-1){
                let needItem = cc.instantiate(this.needBoxPre);
                needItem.getComponent('SetNeedItem').setItem(
                    parseInt(((of.active.condition[i].itemId).toString()).split('')[3])-1,//图片
                    "5/"+of.active.condition[i].cnt
                );
                let add = cc.instantiate(this.addPre);
                this.activeCndt_o.addChild(needItem);
                this.activeCndt_o.addChild(add);
            }else{
                let needItems = cc.instantiate(this.needBoxPre);
                needItems.getComponent('SetNeedItem').setItem(
                    parseInt(((of.active.condition[i].itemId).toString()).split('')[3])-1,//图片
                    "5/"+of.active.condition[i].cnt
                );
                this.activeCndt_o.addChild(needItems);
            }
        }
        //升级工厂和治理环境按钮可用状态设置
        this.upGradeBtn.interactable = !(parseInt(this.mockDatas().facInfo.license.level)>9);
        this.dealEnvBtn.interactable = !(this.mockDatas().facInfo.pl<=0);
    },*/
    //升级框渲染
    /*renderUpBox(){
        this.upCndt.removeAllChildren();
        for(var i = 0;i<5;i++){
            if(i!=4){
                var needItem = cc.instantiate(this.needBoxPre);
                var add = cc.instantiate(this.addPre);
                this.upCndt.addChild(needItem);
                this.upCndt.addChild(add);
            }else{
                var needItems = cc.instantiate(this.needBoxPre);
                this.upCndt.addChild(needItems);
            }
        }
    },*/
    //治理环境框渲染
    renderDealBox(){
        this.getFactoryInfo(this.facId).then((res)=>{
            if(res){
                this.initDealBox(res);
            }
        });
    },
    //治理框渲染逻辑
    initDealBox(res){
        this.ploPrg.progress = res.pl/res.max;//治理框染度进度条
        this.ploNumText.string = res.pl+"/"+res.max;//治理框进度条数值显示
        //工厂的类型
        let facType = res.type;
        this.greenAmtDesc.string = util.getGreenTypeByFacType(facType)+"绿能储备量：";

        if(res.status==0||res.pl==0){//工厂未激活状态或者污染度为零 则禁用治理按钮
            this.dealBtnInBox.getComponent(cc.Button).interactable = false;
        }else{
            this.dealBtnInBox.getComponent(cc.Button).interactable = true;
        }

        this.getMyGreen().then((datas)=>{
            if(datas){
                if(datas.length<=0){
                    this.greenCnt = 0;
                }else {
                    this.greenCnt = util.getGreenAmtByFactype(res.type,datas);
                }
                this.greenAmt.string = this.greenCnt+"吨";
            }
        });
    },
    //打开治理弹框
    openDealBox(){
        this.upDealLayer.active = true;
        this.setPosIndex(this.dealEvnBox);
        this.renderDealBox();
    },
    //关闭治理弹框
    closeDealBox(){
        this.upDealLayer.active = false;
        this.closeAni(this.dealEvnBox);
    },
    /*治理环境绿能数量操作*/
    //显示提示
    showLittleTip(str){
        this.getComponent('LittleTip').setContent(str);
    },
    /*弹窗控制*/
    //激活工厂
    activeFactory(){
        this.showConDia('确认激活工厂吗？',()=>{
            this.showLittleTip('激活成功');
        },()=>{});
    },
    //确认治理工厂对话框
    confirmGovFac(){
        this.showConDia('确认治理工厂吗？',()=>{
            this.GovernFactory(this.facId).then((res)=>{
                if(res){
                    //渲染主场景和治理弹框
                    this.renderScene(true);
                }
            });
        },()=>{});
    },
    //弹出确认对话框
    showConDia(msg,fn1,fn2){
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
    //弹窗位置层级设置
    setPosIndex(node){
        node.parent = this.root;
        node.setPosition(cc.v2(0,0));
        node.active = true;
        node.runAction(Global.openAction);
    },
    //关闭弹窗动画
    closeAni(node){
        var scaleTo = cc.scaleTo(0.1,1.1,1.1);
        var scaleTo2 = cc.scaleTo(0.1,0,0);
        var finished = cc.callFunc(function () {
            node.active = false;
        }, this);
        var action = cc.sequence(scaleTo,scaleTo2, finished);
        node.runAction(action);
    },
    //展开收起头部底部
    toggleTopBot(){
        this.showStatus = !this.showStatus;

        let timer = 1;

        let rotate_0 = cc.rotateTo(timer,0);


        let rotate_180 = cc.rotateTo(timer,180);

        let fade_out = cc.fadeTo(timer,0);
        let fade_out_2 = cc.fadeTo(timer,0);
        let fade_in = cc.fadeTo(timer,255);
        let fade_in_2 = cc.fadeTo(timer,255);

        let movetopHide = cc.moveBy(timer, 0, 152);//头部隐藏
        let movetopHide2 = cc.moveBy(timer, 0, 102);//头部隐藏
        let movetopShow = cc.moveBy(timer, 0, -152);//头部显示
        let movetopShow2 = cc.moveBy(timer, 0, -102);//头部显示

        let movebotHide = cc.moveBy(timer, 0, -87);//底部隐藏
        let movebotShow = cc.moveBy(timer, 0, 87);//底部显示

        if(!this.showStatus) {
            this.topBotToggleBtn.runAction(cc.spawn(rotate_0,movetopHide2));
            this.header.runAction(cc.spawn(fade_out,movetopHide));
            this.footer.runAction(cc.spawn(fade_out_2,movebotHide));
        }else{
            this.topBotToggleBtn.runAction(cc.spawn(rotate_180,movetopShow2));
            this.header.runAction(cc.spawn(fade_in,movetopShow));
            this.footer.runAction(cc.spawn(fade_in_2,movebotShow));
        }
    },
    /*工厂接口*/
    //激活工厂
    //工厂id
    /*confirmActiveFactory(id){
      let pro = new Promise((resolve,reject)=>{
         Net.get('/game/factory/activate',1,{id:id},(data)=>{
             if(!data.success){
                 this.showLittleTip(data.msg);
                 reject(data.msg);
                 return;
             }else{
                 resolve(data.obj);
             }
         },(err)=>{
             reject(false);
         })
      });
      return pro;
    },*/
    //获取工厂
    //工厂id
    getFactoryInfo(id){
        let pro = new Promise((resolve,reject)=>{
            Net.get('/game/factory/getFactory',1,{id:id},(data)=>{
                if(!data.success){
                    this.showLittleTip(data.msg);
                    reject(data.msg);
                    return;
                }else{
                    resolve(data.obj);
                }
            },(err)=>{
                this.showLittleTip('网络错误');
                cc.director.getScene().getChildByName('ReqAni').active = false;
                reject(false);
            })
        });
        return pro;
    },
    //治理工厂
    //工厂id
    GovernFactory(id){
        let pro = new Promise((resolve,reject)=>{
            Net.get('/game/factory/govern',1,{id:id},(data)=>{
                if(!data.success){
                    this.showLittleTip(data.msg);
                    reject(data.msg);
                    return;
                }else{
                    this.showLittleTip('治理成功');
                    resolve(data.obj);
                }
            },(err)=>{
                this.showLittleTip('网络错误');
                cc.director.getScene().getChildByName('ReqAni').active = false;
                reject(false);
            })
        });
        return pro;
    },
    //获取仓库绿能
    getMyGreen(){
        let pro = new Promise((resolve,reject)=>{
            Net.get('/game/getPlayerItemList',1,{type:4},(data)=>{
                if(!data.success){
                    reject(data.msg);
                    return;
                }else{
                    resolve(data.obj);
                }
            },(err)=>{
                this.showLittleTip('网络错误');
                cc.director.getScene().getChildByName('ReqAni').active = false;
                reject(false);
            })
        });
        return pro;
    },
    //工厂倒计时格式化
   facCountDown(){
        if(!this._countdown){
            if(this.facInterval){
                clearInterval(this.facInterval);
            }
            return;
        }
        this._countdown-=1000;
        var nextStatusText = (this._countdown)/1000;
        if(this._countdown<=0){
            if(this.facInterval){
                clearInterval(this.facInterval);
            }
            this.renderScene(true);
        }
        var days=Math.floor(nextStatusText/3600/24);
        var hours=Math.floor((nextStatusText-days*24*3600)/3600);
        var mins=Math.floor((nextStatusText-days*24*3600-hours*3600)/60);
        var secs=Math.floor((nextStatusText-days*24*3600-hours*3600-mins*60));
        //console.log(days,hours,mins,secs);
        if(days<=0){
            days=0;
        }
        hours = hours<10?"0"+hours:hours;
        if(hours<=0){
            hours = '00';
        }
       mins = mins<10?"0"+mins:mins;
        if(mins<=0){
            mins = '00';
        }
       secs = secs<10?"0"+secs:secs;
        if(secs<=0){
            secs = '00';
        }
        var time =days+"天"+hours+"小时"+mins+"分"+secs+"秒";
        // var time = hours+":"+mins+":"+secs;
       //距下轮结算时间：106天5小时20分30秒
        this.countDownLabel.string = "<color=#f6f2ed><outline color=#7e450d width=2>距下轮结算时间："+time+"</outline></color>";
        return time;
    },
    //返回游戏场景
    backGame(){
        cc.director.loadScene("Game",()=>{//回调
            // cc.director.getScene().getChildByName('ReqAni').active = false;
        });
    },
    //组件销毁
    onDestroy(){
        if(this.inter_val){
            clearInterval(this.inter_val);
        };
        if(this.facInterval){
            clearInterval(this.facInterval);
        }
        /*this.facBud.getComponent(cc.Animation).stop('zaozhi');
        this.facBud.getComponent(cc.Animation).stop('guolu');
        this.facBud.getComponent(cc.Animation).stop('huagong');
        this.facBud.getComponent(cc.Animation).stop('shiyou');
        this.facBud.getComponent(cc.Animation).stop('shuini');
        this.facBud.getComponent(cc.Animation).stop('yejin');*/
    },
});