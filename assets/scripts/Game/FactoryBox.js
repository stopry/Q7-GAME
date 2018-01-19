var Net = require('Net');
var Util = require('Util');
cc.Class({
    extends: cc.Component,

    properties: {
        //根节点
        root:{
            default:null,
            type:cc.Node
        },
        //工厂列表元素
        facItem:{
            default:[],
            type:[cc.Node]
        },
        //状态图片列表
        statusPic:{
            default:[],
            type:[cc.SpriteFrame]
        },
        //确认操作对话框
        conDia:{
            default:null,
            type:cc.Prefab
        },
        //确认框遮罩层
        alertLayer:{
            default:null,
            type:cc.Prefab
        }
    },
    // use this for initialization
    onLoad(){
        this.facId = 1;
        this.getFactoryList(true);
    },
    onDestroy(){

    },
    showThis(){
        this.root.active = true;
        //this.root.runAction(Global.openAction);
        this.root.scale = 1;
        this.getFactoryList(false);
    },
    //获取工厂列表
    getFactoryList(isbind){
        Net.get('/game/factory/list',1,null,(data)=>{
            if(!data.success){
                this.showLittleTip(data.msg);
                return;
            }
            let list = data.obj;
            for(let i = 0;i<list.length;i++){
                this.initFacListItem(this.facItem[i],list[i].id,list[i],isbind);
            }
        },(err)=>{
            this.showLittleTip('网络错误');
            cc.director.getScene().getChildByName('ReqAni').active = false;
        })
    },
    //初始化工厂列表item
    initFacListItem(facNode,id,list,isbind){
        this.facId = id;

        //facNode.getChildByName('lv').getComponent(cc.RichText).string =  "<outline color=#5D1A0A width=1>"+list.version +"</outline>";//等级

        facNode.getChildByName('wrd_prg').getComponent(cc.ProgressBar).progress = list.pl/list.max;//污染度
        // facNode.getChildByName('pwl').getComponent(cc.RichText).string = "<outline color=#5D1A0A width=1>"+list.plph+"吨/每小时</outline>";//排污量
        // facNode.getChildByName('cn').getComponent(cc.RichText).string = "<outline color=#8A4B11 width=2>"+list.uph+"金币/每小时</outline>";//产能
        facNode.getChildByName('status').getComponent(cc.Sprite).spriteFrame = this.statusPic[list.status];//状态
        facNode.getChildByName('yyl').getComponent(cc.RichText).string = "<outline color=#8A4B11 width=2>"+list.totalUph+"金币</outline>";//已盈利
        facNode.getChildByName('factoryActive').active = list.status=='0';//工厂未激活 显示激活按钮
        facNode.getChildByName('look_btn').active = list.status!='0';//工厂未激活 显示激活按钮
        if(isbind){
            let self = this;
            //点击激活按钮事件
            facNode.getChildByName('factoryActive').on(cc.Node.EventType.TOUCH_END,function (event) {
                event.stopPropagation();
                if(list.status=='0'){
                    self.showConDia('是否激活工厂?需要该工厂营业执照',()=>{
                        Net.get('/game/factory/activate',1,{id:list.id},(data)=>{
                            if(!data.success){
                                self.showLittleTip(data.msg);
                            }else{
                                self.showLittleTip('激活成功！');
                                self.getFactoryList(false);
                            }
                        },()=>{
                            this.showLittleTip('网络错误');
                            cc.director.getScene().getChildByName('ReqAni').active = false;
                        });
                    },()=>{});
                }
            }.bind(self),this);
            //点击进入工厂
            facNode.getChildByName('look_btn').on(cc.Node.EventType.TOUCH_END,function(){
                self.toFactory(list.id);
            }.bind(self),this);
            facNode.on(cc.Node.EventType.TOUCH_END,function(){
                self.toFactory(list.id);
            }.bind(self),this);
        }
    },
    //去工厂
    //工厂id
    toFactory(id){
        this.facId = id;
        cc.sys.localStorage.setItem('factoryId',this.facId);

        cc.director.getScene().getChildByName('ReqAni').active = true;
        cc.director.loadScene("Factory",()=>{//回调
            // cc.director.getScene().getChildByName('ReqAni').active = false;
        });
    },
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
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    // update: function (dt) {

    // },
});
// <outline color=#5D1A0A width=1>0.0吨/每小时</outline>  #AC0B0B
// <outline color=#8A4B11 width=2>0.0吨/每小时</outline>  #E8C60F