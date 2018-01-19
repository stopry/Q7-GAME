var util = require('Util');
cc.Class({
    extends: cc.Component,

    properties: {
        windList:{
            default:[],
            type:[cc.Node]
        },//风动画
    },

    // use this for initialization
    onLoad() {
        this.interVal = null;
        this.playWindAni();
    },
    //播放风动画
    playWindAni(){
        //生成一个随机秒数
        // var _time = util.getRandInt(2,5)*1000;
        //得到一个风动画的索引
        // let _index = util.getRandInt(0,2);
        let _index = 1;
        let self = this;
        this.interVal = setInterval(()=>{
            // _time = util.getRandInt(2,5)*1000;
            _index = util.getRandInt(0,2);
            self.windList[_index].active = true;
            self.windList[_index].getComponent(cc.Animation).play();
            // this.windList[_index].getComponent(cc.Animation).on('play',function(){
            //     this.windList[_index].active = true;
            // },this);
            self.windList[_index].getComponent(cc.Animation).on('finished',function(){
                self.windList[_index].active = false;
            },self);
        },5000);
    },
    onDestroy(){
        if(this.interVal){
            clearInterval(this.interVal);
        }
    },
    // update: function (dt) {
    //
    // },
});
