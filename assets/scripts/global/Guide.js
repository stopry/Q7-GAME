//var util = require('Util');
var Net = require('Net');
var Util = require('Util');
var config = require('GuideConfig');//游戏引导配置
cc.Class({
    extends: cc.Component,

    properties: {
        //点击音效
        clickAudio:{
            default:null,
            url:cc.AudioClip
        },
        //遮罩层
        masker:{
            default:null,
            type:cc.Node
        },
        //点击区域
        clicker:{
            default:null,
            type:cc.Node
        },
        //黑板
        blackBoard:{
            default:null,
            type:cc.Node
        },
        //人
        person:{
            default:null,
            type:cc.Node
        },
        //文字-话板上的文字
        textWord:{
            default:null,
            type:cc.Node
        },
        //提示文字-高光文字
        tipsText:{
            default:null,
            type:cc.Node
        },
        //小提示板
        littleTipsBoard:{
            default:null,
            type:cc.Node
        },
        //四个人物图片
        personPic:{
            default:[],
            type:[cc.SpriteFrame]
        },
        //文字提示图片-10张
        textTipPic:{
            default:[],
            type:[cc.SpriteFrame]
        },
        //时间提示图片
        timeClock:{
            default:null,
            type:cc.Node
        }
    },
    // use this for initialization
    onLoad: function () {
        this.initGuide();
        this.action();
    },
    initGuide(){
        //阻止mask向下传递事件
        this.node.on('touchstart', function(event){
            event.stopPropagation();
        }, this);
    },
    //设置masker和clicker的位置
    setPos(obj){
      this.masker.setPosition(obj);
      this.clicker.setPosition(obj);
    },
    //新手引导开始
    action(){
        //this.step_1();
        this.clicker.on('touchstart', function(event){
            this["step_"+Global.guideStep]();
            if(this.clickAudio){
                cc.audioEngine.playEffect(this.clickAudio, false);
            }
            /*switch (Global.guideStep){
                case 1:
                    this.step_1();
                    break;
                case 2:
                    this.step_2();
                    break;
                case 3:
                    this.step_3();
                    break;
                case 4:
                    this.step_1();
                    break;
            }*/
        }, this);
    },
    //步骤1
    /*
    * 显示人和话板
    * 隐藏提示板提示文字
    *
    * */
    step_1(){
        this.setPos(config[0].pos);
        //cc.find('Game').getComponent('Game').toggleHeader();
        this.person.setPosition(config[0].pPos);
        this.person.active = true;
        this.blackBoard.setPosition(config[0].bPos);
        this.blackBoard.active = true;
        this.littleTipsBoard.active = false;
        this.tipsText.active = false;
        this.person.scaleX = -1;
        this.person.getComponent(cc.Sprite).spriteFrame = this.personPic[1];
        this.textWord.setPosition(config[0].tPos);
        this.textWord.getComponent(cc.Label).string = config[0].text;
        Global.guideStep = 2;
    },
    //步骤2
    step_2(){
        //this.setPos(config[1].pos);
        this.person.scaleX = 1;
        this.person.setPosition(config[1].pPos);
        this.person.getComponent(cc.Sprite).spriteFrame = this.personPic[2];
        this.textWord.setPosition(config[1].tPos);
        this.textWord.getComponent(cc.Label).string = config[1].text;
        Global.guideStep = 3;
    },
    //步骤3
    step_3(){
        this.setPos(config[2].pos);
        this.person.scaleX = -1;
        this.person.setPosition(config[2].pPos);
        this.person.getComponent(cc.Sprite).spriteFrame = this.personPic[0];
        this.textWord.setPosition(config[2].tPos);
        this.textWord.getComponent(cc.Label).string = config[2].text;
        Global.guideStep = 4;
    },
    //步骤4
    step_4(){
        this.setPos(config[3].pos);
        this.person.scaleX = -1;
        this.person.setPosition(config[3].pPos);
        this.person.getComponent(cc.Sprite).spriteFrame = this.personPic[2];
        this.textWord.setPosition(config[3].tPos);
        this.textWord.getComponent(cc.Label).string = config[3].text;
        Global.guideStep = 5;
    },
    //步骤5
    /*
    给出获得树苗提示 去绿化
    隐藏人和话板
    显示提示
     */
    step_5(){
        this.blackBoard.active = false;
        this.person.active = false;
        this.littleTipsBoard.active = true;
        this.setPos(config[4].pos);
        Global.guideStep = 6;
    },
    //步骤6
    /*
    * 提示点击土地进入种植场景
    * 隐藏人和话板
    * 显示提示文字图片
    * 隐藏小提示
    *
    * */
    step_6(){
        this.setPos(config[5].pos);
        this.littleTipsBoard.active = false;
        this.blackBoard.active = false;
        this.person.active = false;

        this.tipsText.active = true;
        this.tipsText.getComponent(cc.Sprite).spriteFrame = this.textTipPic[0];
        this.tipsText.setPosition(config[5].tPicPos);

        Global.guideStep = 7;
    },
    //步骤7
    /*
    * 进入种植详情场景 提示点击播种按钮
    *隐藏人和话板小提示
    * 显示文字提示
    * */
    step_7(){
        cc.director.loadScene('PlantDetailGuide',()=>{

            //设置guider位置 拉回底部weight偏差
            this.node.setPosition(cc.v2(320,568));

            this.setPos(config[6].pos);

            this.littleTipsBoard.active = false;
            this.blackBoard.active = false;
            this.person.active = false;

            this.tipsText.active = true;
            this.tipsText.getComponent(cc.Sprite).spriteFrame = this.textTipPic[1];
            this.tipsText.setPosition(config[6].tPicPos);
            Global.guideStep = 8;

        });

    },
    //步骤8
    /*
     * 弹出树苗选择框
     * 提示点击选择树苗
     * 隐藏人和话板小提示
     * 显示提示文字图片
     * */
    step_8(){
        this.node.setPosition(Global.guiderPos);
        this.setPos(config[7].pos);

        //弹出树苗选择框
        cc.find('PlantDetailGuide').getComponent('PlantDetailGuide').openTreeBox();

        this.littleTipsBoard.active = false;
        this.blackBoard.active = false;
        this.person.active = false;

        this.tipsText.active = true;
        this.tipsText.getComponent(cc.Sprite).spriteFrame = this.textTipPic[2];
        this.tipsText.setPosition(config[7].tPicPos);

        Global.guideStep = 9;
    },
    //步骤9
    /*
     * 树苗为选中状态
     * 提示点击确定种植按钮
     * 隐藏人和话板小提示
     * 显示提示文字图片
     * */
    step_9(){
        this.node.setPosition(Global.guiderPos);
        this.setPos(config[8].pos);
        //选中树苗
        cc.find('PlantDetailGuide').getComponent('PlantDetailGuide').selTree();
        this.littleTipsBoard.active = false;
        this.blackBoard.active = false;
        this.person.active = false;

        this.tipsText.active = true;
        this.tipsText.getComponent(cc.Sprite).spriteFrame = this.textTipPic[3];
        this.tipsText.setPosition(config[8].tPicPos);

        Global.guideStep = 10;
    },
    //步骤10
    /*
     * 播放种树动画
     * 隐藏人、话板、小提示、文字提示，手指、mask
     * 显示时间提示
     *
     * 一段时间后显示绿能、手指、文字提示
     * */
    step_10(){
        this.node.setPosition(Global.guiderPos);
        this.setPos(config[9].pos);
        //种树过程
        cc.find('PlantDetailGuide').getComponent('PlantDetailGuide').confirmPlant();
        this.littleTipsBoard.active = false;
        this.blackBoard.active = false;
        this.person.active = false;
        this.tipsText.active = false;
        this.masker.active = false;
        this.clicker.active = false;
        //显示时间图片
        setTimeout(()=>{
            this.timeClock.active = true;
        },7500);
        //出现绿能
        setTimeout(()=>{
            cc.find('PlantDetailGuide').getComponent('PlantDetailGuide').createGreen();
        },9000);
        //显示手指遮罩层 提示文字 和绿能 隐藏时间图片
        setTimeout(()=>{
            this.timeClock.active = false;
            this.tipsText.active = true;
            this.masker.active = true;
            this.clicker.active = true;
            this.setPos(config[9].pos);
            this.tipsText.getComponent(cc.Sprite).spriteFrame = this.textTipPic[4];
            this.tipsText.setPosition(config[9].tPicPos);
            this.sendStep(1);//发送种植成功步骤
        },11000);
        Global.guideStep = 11;
    },
    //步骤11
    /*
    * 隐藏提示文字
    * 提示返回主界面
    * 显示人和话框
    * 先隐藏手指和mask
    * 收取绿能完成后显示手指和mask
    * */
    step_11(){
        //手指指向种植详情场景的带有weight组件的返回按钮 会向上偏移
        //重新设置guider位置
        this.node.setPosition(cc.v2(320,568-Global.plantDetailDis));
        this.tipsText.active = false;
        //收取绿能
        cc.find('PlantDetailGuide').getComponent('PlantDetailGuide').getGreen();

        this.clicker.active = false;
        this.masker.active = false;

        setTimeout(()=>{
            this.blackBoard.active = true;
            this.blackBoard.setPosition(config[10].bPos);
            this.textWord.setPosition(config[10].tPos);
            this.textWord.getComponent(cc.Label).string = config[10].text;
            this.person.active = true;
            this.person.setPosition(config[10].pPos);
            this.person.scaleX = -1;
            this.person.getComponent(cc.Sprite).spriteFrame = this.personPic[1];
            this.clicker.active = true;
            this.masker.active = true;
            this.setPos(config[10].pos);
            this.sendStep(2);//发送收取绿能成功步骤
        },3000);

        Global.guideStep = 12;
    },
    //步骤12
    /*
    *跳转至主场景
    * 隐藏小提示、话板、人
    *显示提示文字图片
    *提示点击工厂建筑
    * */
    step_12(){
        this.node.setPosition(Global.guiderPos);
        cc.director.loadScene('Game',()=>{

            this.littleTipsBoard.active = false;
            this.blackBoard.active = false;
            this.person.active = false;

            this.tipsText.active = true;
            this.tipsText.getComponent(cc.Sprite).spriteFrame = this.textTipPic[5];
            this.setPos(config[11].pos);
            this.tipsText.setPosition(config[11].tPicPos);

        });

        Global.guideStep = 13;
    },
    //步骤13
    /*
    * 弹出工厂弹框
    *提示点击进入工厂场景
    * */
    step_13(){
        this.node.setPosition(Global.guiderPos);
        cc.find('Game').getComponent('GameWindow').openFactoryBox();

        this.setPos(config[12].pos);
        this.tipsText.setPosition(config[12].tPicPos);
        this.tipsText.getComponent(cc.Sprite).spriteFrame = this.textTipPic[6];

        Global.guideStep = 14;

    },
    //步骤14
    /*
    * 进入工厂场景
    * 显示提示文字-提示点击环境治理按钮
    * 隐藏 人、话板、小提示
    *
    * */
    step_14(){
        this.node.setPosition(cc.v2(320,568));
        this.clicker.active = false;
        this.masker.active = false;
        this.tipsText.active = false;
        cc.director.loadScene('FactoryGuide',()=>{
            setTimeout(()=>{
                this.clicker.active = true;
                this.masker.active = true;

                this.person.active = false;
                this.blackBoard.active = false;
                this.littleTipsBoard.active = false;

                this.tipsText.active = true;
                this.setPos(config[13].pos);
                this.tipsText.setPosition(config[13].tPicPos);
                this.tipsText.getComponent(cc.Sprite).spriteFrame = this.textTipPic[7];
            },2000);

        });

        Global.guideStep = 15;
    },
    //步骤15
    /*
    * 弹出环境治理框
    * 提示点击治理污染
    * */
    step_15(){

        this.node.setPosition(Global.guiderPos);
        //打开治理框
        cc.find('FactoryGuide').getComponent('FactoryGuide').openDealBox();
        this.tipsText.setPosition(config[14].tPicPos);
        this.tipsText.getComponent(cc.Sprite).spriteFrame = this.textTipPic[8];
        this.setPos(config[14].pos);

        Global.guideStep = 16;
    },
    //步骤16
    /*
    * 隐藏提示文字
    * 显示人和话框
    * 关闭治理框
    * 播放工厂动画
    * */
    step_16(){

        this.node.setPosition(Global.guiderPos);
        //治理环境
        cc.find('FactoryGuide').getComponent('FactoryGuide').dealEnv();

        this.masker.active = false;
        this.clicker.active = false;
        this.tipsText.active = false;

        setTimeout(()=>{

            this.masker.active = true;
            this.clicker.active = true;
            this.person.active = true;
            this.blackBoard.active = true;
            this.person.scaleX = 1;
            this.person.getComponent(cc.Sprite).spriteFrame = this.personPic[1];
            this.textWord.getComponent(cc.Label).string = config[15].text;
            this.person.setPosition(config[15].pPos);
            this.blackBoard.setPosition(config[15].bPos);
            this.textWord.setPosition(config[15].tPos);
            this.setPos(config[15].pos);
            this.sendStep(3);//发送治理成功步骤
        },2800);

        Global.guideStep = 17;
    },
    //步骤17
    /*
    * 返回游戏场景
    * 隐藏话板和人
    * 显示文字提示图片
    * 提示进入用户中心
    * */
    step_17(){

        this.node.setPosition(cc.v2(320,568));
        this.person.active = false;
        this.blackBoard.active = false;
        this.clicker.active = false;
        this.tipsText.active = false;

        cc.director.loadScene('Game',()=>{
            this.clicker.active = true;
            this.setPos(config[16].pos);
            this.tipsText.getComponent(cc.Sprite).spriteFrame = this.textTipPic[9];
            this.tipsText.setPosition(config[16].tPicPos);
            this.textWord.getComponent(cc.Label).string = config[16].text;
            this.textWord.setPosition(config[16].tPos);
            this.person.setPosition(config[16].pPos);
            this.person.getComponent(cc.Sprite).spriteFrame = this.personPic[1];
            this.person.scaleX = 1;
            this.person.active = true;
            this.blackBoard.active = true;
        });
        Global.guideStep = 18;
    },
    //步骤18
    /*
    * 关闭引导常驻节点
    * 设置全局变量 新手指导完成状态为true
    *
    * */
    step_18(){
        cc.find('Game').getComponent('Game').showLittleTip('已完成新手引导！正在跳转至用户中心...');
        cc.director.getScene().getChildByName('Guider').active = false;
        Global.cmpGuide = true;
        Global.guideStep = 19;
        setTimeout(()=>{
            //let token = cc.sys.localStorage.getItem('token');
            //token = encodeURI(token);
            Util.toAppMarket("user-center");
            //cc.sys.openURL(Global.marketDomain+"/html/skip-page.html?token="+token+"&link=user-center");
        },3000);
        this.sendStep(4);//发送完成所有新手引导步骤
    },
    //步骤19
    step_19(){

    },
    /*
    * 向后台发送步骤进度
    * */
    sendStep(step){
        //step当前进度
        //(1:种植 2:绿能 3:治理 4:结束)
        Net.get('/game/guiding',1,{newStep:step},()=>{

        },()=>{});
    },
    onDestroy(){

    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
