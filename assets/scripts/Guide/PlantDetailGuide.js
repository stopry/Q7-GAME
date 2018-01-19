cc.Class({
    extends: cc.Component,

    properties: {
        //遮罩层
        layer:{
            default:null,
            type:cc.Node
        },
        //树苗选择框
        treeBox:{
            default:null,
            type:cc.Node
        },
        //树苗列表项
        treeListItem:{
            default:null,
            type:cc.Node
        },
        //树苗选中状态钩号
        treeItemSelIcon:{
            default:null,
            type:cc.Node
        },
        //林场树item
        treeItem:{
            default:[],
            type:[cc.Node]
        },
        //柳树成熟图片
        treeProPic:{
            default:null,
            type:cc.SpriteFrame
        },
        //飞机动画
        plane:{//飞机
            default:null,
            type:cc.Node
        },
        shed:{//喷洒物
            default:null,
            type:cc.Node
        },
        //地面水花列表
        sprayList:{
            default:[],
            type:[cc.Node]
        },
        //绿能节点
        greenNode:{
            default:null,
            type:cc.Node
        }
    },
    // use this for initialization
    onLoad(){
        //this.plantTree();
    },
    //返回主场景
    backGameSence(){
        cc.director.loadScene("Game",()=>{

        });
    },
    //打开树苗列表弹框
    openTreeBox(){
        this.layer.active = true;
        this.treeBox.active = true;
    },
    //选择树苗
    selTree(){
        this.treeItemSelIcon.active = true;
    },
    //种树过程
    playShed(aniName){//播放喷洒
        this.shed.getComponent(cc.Animation).play(aniName);
    },
    closeSpray(){//关闭水花
        for(let k = 0;k<this.sprayList.length;k++){
            this.sprayList[k].active = false;
        }
    },
    playSpray(){//播放水花
        for(let i = 0;i<this.sprayList.length;i++){
            this.scheduleOnce(function(){
                this.sprayList[i].active = true;
            },i*0.4);
        }
        this.scheduleOnce(function(){
            this.closeSpray();
        },15*0.4);
    },
    playPlane(){//播放飞机type:123 除虫 除草 浇水
        this.plane.getComponent(cc.Animation).play();
        this.playShed('planeWater');
        this.playSpray();//水花
        this.plane.getComponent(cc.Animation).on('finished',function(){
            this.plane.getComponent(cc.Animation).stop();
        },this);
    },
    plantTree(){
        this.playPlane();
        this.scheduleOnce(function(){
            for(let i = 0;i<15;i++){
                this.treeItem[i].getComponent(cc.Sprite).spriteFrame = this.treeProPic;
                this.showLittleTip('播种成功');
            }
        },15*0.4);
    },
    //this.createGreen();出现绿能
    //确定种植
    confirmPlant(){
        this.layer.active = false;
        this.treeBox.active = false;
        this.plantTree();
        //this.createGreen();
    },
    //生成绿能
    createGreen(){
        let timer = 0.8;
        let fadeIn = cc.fadeTo(timer,255);
        let scaleIn = cc.scaleTo(timer,1);
        this.greenNode.runAction(cc.spawn(fadeIn,scaleIn));
    },
    //收取绿能
    getGreen(){
        let moveTo = cc.moveTo(1, 0, 0);
        let scaleOut = cc.scaleTo(1,0);
        let fadeOut = cc.fadeTo(1,0);
        this.greenNode.runAction(cc.spawn(moveTo,scaleOut));
        this.scheduleOnce(function(){
            this.showLittleTip('收取成功');
        },1.2);
    },
    onDestroy(){

    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
