let Util = require('Util');
let QaUtil = require('QaUtil');
cc.Class({
    extends: cc.Component,
    properties: {
        statusPic:cc.Sprite,//结果图片
        statusPicSrc:[cc.SpriteFrame],//图片路径
        fJf:cc.Label,//我方积分
        eJf:cc.Label,//敌方积分
        getWard:cc.Label,//获得奖励
        getGold:cc.Label,//获得金币
    },
    onLoad () {
        this.result = {
            status:0,//0 1 失败 胜利
            fJf:2,//我方积分
            eJf:3,//敌方积分
            getWard:0,//获得奖励
            getGold:0,//获得金币
        }
    },
    start () {
        Util.hideLoading();
        let result = JSON.parse(cc.sys.localStorage.getItem('qaResult'));
        this.result.status = result.res=='win'?1:0;
        this.result.fJf = parseInt((result.team_score).split(':')[0]);
        this.result.eJf = parseInt((result.team_score).split(':')[1]);
        this.init();
    },
    init(){
        this.statusPic.spriteFrame = this.statusPicSrc[this.result.status];
        this.fJf.string = this.result.fJf;
        this.eJf.string = this.result.eJf;
        this.getWard.string = this.result.getWard;
        this.getGold.string = this.result.getGold;
    },
    //返回游戏
    backGame(){
        Util.showLoading();
        cc.director.loadScene('Game',_=>{

        });
    },
    //再来一局 回到游戏重新匹配
    playAgain(){
        //先检查是否有答题次数

        //设置global变量Qa.playAgain = true;加载Game场景
        //let hasChance = true;
        //if(hasChance){
        //
        //}
        Global.Qa.playAgain = true;
        this.backGame();
    },
    onDestroy(){

    },
    // update (dt) {},
});
