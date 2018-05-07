var Net = require('Net');
var util = require('Util');
cc.Class({
    extends: cc.Component,

    properties: {
        greenEnergy:{//绿能
            default:null,
            type:cc.Node
        },
        status:0,//绿能状态
        countDown:null,//收取倒计时
        isTaking:false,//是否正在收取中
        greenPic:{
            default:null,
            type:cc.Sprite
        },
        //树的类型图片
        treeTypePic:{
            default:[],
            type:[cc.SpriteFrame]
        }
    },
    // use this for initialization
    onLoad: function () {
        this._interVal = null;
        this.thisPos = this.greenEnergy.getPosition();//得到绿能位置
        //normal
        //this.normalAction = cc.repeatForever(
        //    cc.sequence(
        //        cc.moveBy(1.8, 0, 15),
        //        cc.moveBy(1.8, 0, -15)
        //    )).easing(cc.easeIn(1.8));
        this.greenEnergy.on(cc.Node.EventType.TOUCH_END,this.takeGreenEnergy,this);
    },
    takeOk(){//收取完成
        var self = this;
        if(this.type==1){
            this.scheduleOnce(function() {
                this.greenEnergy.destroy();//销毁当前绿能
                Net.post('/game/pick',1,{greenId:self.id},(res)=>{
                    if(!res.success){
                        cc.find('PlantDetail').getComponent('PlantDetail').showLittleTip(res.msg);
                    }else{
                        cc.find('PlantDetail').getComponent('PlantDetail').showLittleTip('收取完成');
                        this.isTaking = false;
                    }
                },(err)=>{
                    cc.find('PlantDetail').getComponent('PlantDetail').showLittleTip('网络错误');
                    cc.director.getScene().getChildByName('ReqAni').active = false;
                });
            }, 2);
        }else{
            this.scheduleOnce(function() {//好友林场绿能
                this.greenEnergy.destroy();//销毁当前绿能
                Net.post('/game/pick',1,{greenId:self.id},(res)=>{
                    if(!res.success){
                        cc.find('PlantDetail').getComponent('PlantDetail').showLittleTip(res.msg);
                    }else{
                        cc.find('PlantDetail').getComponent('PlantDetail').showLittleTip('偷取成功');
                        this.isTaking = false;
                    }
                },(err)=>{
                    cc.find('PlantDetail').getComponent('PlantDetail').showLittleTip('网络错误');
                    cc.director.getScene().getChildByName('ReqAni').active = false;
                });
            }, 2);
        }

    },
    initGreenEnergy(status,countDown,treeBoxPos,type,treeType,id,isDis){//初始化绿能
        //take
        this.id = id;
        var finished = cc.callFunc(this.takeOk,this);
        this.takeAction = cc.spawn(cc.moveTo(2,treeBoxPos),cc.scaleTo(2,0.3),cc.fadeTo(2,0),finished);//收取自己绿能时动作
        this.takeFGAction = cc.spawn(cc.moveBy(2,0,200),cc.scaleTo(2,0.3),cc.fadeTo(2,0),finished);
        this.status = status;
        this.countDown = countDown;
        this.type = type;
        this.treeType = treeType;
        this.isDis = isDis;
        this.renderGreenEnergy(this.status,this.countDown,this.type,this.treeType,this.isDis);
        //this.greenEnergy.runAction(this.normalAction)
    },
    /**
    @param status 1-2-3  正在产出-产出完成-收取完成
    @param countDown->可收取时间倒数计时
    @param type 0-1 好友绿能-自己绿能
    @param treeType 绿能的类型 对应六种树木
    @param isDis 是否有灾害 如果有则显示绿能停产
    */
    renderGreenEnergy(status,countDown,type,treeType,isDis){//渲染绿能
        this.status = status;
        this.countDown = countDown;
        this.type = type;//绿能类型好友的或自己的0/1

        if(treeType<0){
            treeType = 6;
        }

        this.treeType = treeType;//绿能的种类
        this.isDis = isDis;

        this.greenPic.spriteFrame = this.treeTypePic[this.treeType];
        if(this.status==1){//正在产出
            if(!this.greenEnergy||!this.greenEnergy.name){
                return;
            }
            this.greenEnergy.opacity = 190;
            this.greenEnergy.getChildByName('greenDesc').getComponent(cc.Label).string = '生成中...';
        }else if(this.status==2){//产出完成
            this.greenEnergy.opacity = 255;
            if(!this.greenEnergy||!this.greenEnergy.name){
                return;
            }
            this.greenEnergy.getChildByName('greenDesc').getComponent(cc.Label).string = '可收取';
        }
        /*if(this.type==1){
            this.greenEnergy.getChildByName('greenDesc').getComponent(cc.Label).string = '自己绿能'
        }else{
            this.greenEnergy.getChildByName('greenDesc').getComponent(cc.Label).string = '好友绿能'
        }*/
        if(status==1&&isDis){//如果正在产出且有灾难则 停止成熟倒计时 显示绿能为停产中
            this.greenEnergy.getChildByName('greenDesc').getComponent(cc.Label).string = '停产中';
            return;
        }

        //调用定时刷新倒计时，当现在时间超过成熟时间标记为可收取状态，同时停止倒计时
        this._interVal = setInterval(()=>{
            this.freshCountDown();
            if(this.countDown<=new Date().getTime()){
                clearInterval(this._interVal);
                this.status = 2;
                if(!this.greenEnergy||!this.greenEnergy.name){
                    return;
                }
                this.greenEnergy.opacity = 255;
                this.greenEnergy.getChildByName('greenDesc').getComponent(cc.Label).string = '可收取';
            }
        },1000)
    },
    //刷新绿能成熟倒计时
    freshCountDown(){
      if(this.status==1){
          if(!this.greenEnergy||!this.greenEnergy.name){
              return;
          }
          this.greenEnergy.opacity = 190;
          this.greenEnergy.getChildByName('greenDesc').getComponent(cc.Label).string = util.getCountDown(this.countDown);
      }
    },
    takeGreenEnergy(){//收取绿能
        if(this.isTaking) return;
        this.isTaking = true;
        if(this.status==1&&this.type==1){
            cc.find('PlantDetail').getComponent('PlantDetail').showLittleTip('此时间段不可收取');
            this.isTaking = false;
            return;
        }
/*        else if(this.status==1&&this.type==0){//好友林场绿能
            cc.find('FriendPlantDetail').getComponent('FriendPlantDetail').showLittleTip('此时间段不可收取');
            this.isTaking = false;
            return;
        }*/
        if(this.type==1){
            this.greenEnergy.runAction(this.takeAction);
        }else{
            this.greenEnergy.runAction(this.takeFGAction);
        }
    },
    onDestroy(){
        if(this._interVal){
            clearInterval(this._interVal)
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },0
});
