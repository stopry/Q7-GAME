cc.Class({
    extends: cc.Component,

    properties: {
        //遮罩层
        boxLayer:{
            default:null,
            type:cc.Node
        },
        //治理框
        dealBox:{
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
        //toggleBtn
        toggleBtn:{
            default:null,
            type:cc.Node
        },
        //造纸厂动画
        facAni:{
            default:[],
            type:[cc.Animation]
        },
        //进度条
        prgBar:{
            default:[],
            type:[cc.ProgressBar]
        },
        //进度条数值
        prgNum:{
            default:[],
            type:[cc.Label]
        },
        //总盈利数值
        allProfit:{
            default:null,
            type:cc.RichText
        }
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.openHeaderFooter();
    },
    //进入场景动画
    inAni(){

    },
    //播放工厂动画
    playFacAni(){
        this.facAni[0].play('zhao_zhi_yancong');
        this.facAni[1].play('zhao_zhi_dao');
        this.facAni[2].play('zhao_zhi_deng_er');
        this.facAni[3].play('zhao_zhi_dengyi');
    },
    //展开头部底部
    openHeaderFooter(){
        this.showStatus = !this.showStatus;

        let timer = 1;

        let rotate_180 = cc.rotateTo(timer,180);

        let fade_in = cc.fadeTo(timer,255);
        let fade_in_2 = cc.fadeTo(timer,255);

        let movetopShow = cc.moveBy(timer, 0, -152);//头部显示
        let movetopShow2 = cc.moveBy(timer, 0, -102);//头部显示

        let movebotShow = cc.moveBy(timer, 0, 87);//底部显示

        this.toggleBtn.runAction(cc.spawn(rotate_180,movetopShow2));
        this.header.runAction(cc.spawn(fade_in,movetopShow));
        this.footer.runAction(cc.spawn(fade_in_2,movebotShow));

    },
    //打开治理弹框
    openDealBox(){
        this.boxLayer.active = true;
        this.dealBox.active = true;
    },
    //关闭治理框
    closeDealBox(){
        this.boxLayer.active = false;
        this.dealBox.active = false;
    },
    //治理环境
    dealEnv(){
        this.prgBar[0].progress = 0;
        this.prgBar[1].progress = 0;
        this.prgNum[0].string = "0/30";
        this.prgNum[1].string = "0/30";
        this.allProfit.string = "<outline color=#8A4B11 width=2>50金币</outline>";
        this.getComponent('LittleTip').setContent('治理环境成功!');
        this.playFacAni();
        this.closeDealBox();
    },
    //返回主场景
    backGame(){
        cc.director.loadScene('Game');
    },
    /*start () {

    },*/
    onDestroy(){

    }
    // update (dt) {},
});
