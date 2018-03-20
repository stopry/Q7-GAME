var Net = require('Net');
cc.Class({
    extends: cc.Component,

    properties: {
        littleTip:{//小提示
            default:null,
            type:cc.Prefab
        },
        alertLayer:{//遮罩层
            default:null,
            type:cc.Prefab
        },
        conDia:{//确认对话框
            default:null,
            type:cc.Prefab
        },
        id:{//商品id
            default:0,
            type:cc.Integer
        },
        img:{//商品图片
            default:null,
            type:cc.Sprite
        },
        goodsName:{//商品名称
            default:null,
            type:cc.RichText
        },
        goodsDesc:{//商品描述
            default:null,
            type:cc.Label
        },
        goodsPrice:{//商品价格
            default:null,
            type:cc.RichText
        },
        goodsNum:{//商品输入框
            default:null,
            type:cc.EditBox
        },
        addBtn:{//增加按钮
            default:null,
            type:cc.Node
        },
        cutBtn:{//减少按钮
            default:null,
            type:cc.Node
        },
        buyBtn:{//购买按钮
            default:null,
            type:cc.Node
        },
        spriteList: {//树苗图片列表
            default: [],
            type: [cc.SpriteFrame]
        },
        propSpriteList:{//道具图片列表
            default:[],
            type:[cc.SpriteFrame]
        },
        //个子
        listItem:{
            default:null,
            type:cc.Node
        },
        //长按描述框
        descPrefab:{
            default:null,
            type:cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function () {
        //cc.log(this.buyBtn);
        if(this.buyBtn){
            this.buyBtn.on(cc.Node.EventType.TOUCH_END,this.buy,this);
        }
        if(this.cutBtn){
            this.cutBtn.on(cc.Node.EventType.TOUCH_END,this.cutNum,this);
        }
        if(this.addBtn){
            this.addBtn.on(cc.Node.EventType.TOUCH_END,this.addNum,this);
        }
    },
    setItem(img,goodsName,goodsDesc,goodsPrice,id,itemType){//设置日志item显示——图片商品名-商品描述-商品价格-id-商品类型
        if(itemType=="1"){
            this.img.spriteFrame = this.spriteList[img];
        }else{
            this.img.spriteFrame = this.propSpriteList[img];
        }
        this.goodsName.string = goodsName;
        this.goodsDesc.string = goodsDesc;
        this.goodsPrice.string = goodsPrice;
        this.id = id;

        this.listItem.off(cc.Node.EventType.TOUCH_START,this.touchStart,this);
        this.listItem.off(cc.Node.EventType.TOUCH_END,this.touchEnd,this);
        this.listItem.off(cc.Node.EventType.TOUCH_CANCEL,this.touchEnd,this);
        this.listItem.on(cc.Node.EventType.TOUCH_START,this.touchStart,this);
        this.listItem.on(cc.Node.EventType.TOUCH_END,this.touchEnd,this);
        this.listItem.on(cc.Node.EventType.TOUCH_CANCEL,this.touchEnd,this);
    },
    addNum(){//增加数量
        var _num = parseInt(this.goodsNum.string);
        if(!_num||_num<1||typeof(_num)!='number'){
            this.goodsNum.string = "1";
        }else{
            this.goodsNum.string = (_num + 1).toString();
        }
    },
    cutNum(){//减少数量
        var _num = parseInt(this.goodsNum.string);
        if(!_num||_num<=1||typeof(_num)!='number'){
            this.goodsNum.string = "1";
        }else{
            this.goodsNum.string = (_num - 1).toString();
        }
    },
    buy(){//购买商品
        var _num = parseInt(this.goodsNum.string);
        if(!_num||_num<1||typeof(_num)!='number'){
            this.showLittleTip('请输入正确数量');
            return;
        }else{
            this.showConDia('确定购买'+_num+'个'+this.goodsName.string+'吗？',function (){
                this.conformBuy();
            }.bind(this),function (){
                //this.showLittleTip('取消购买');
            }.bind(this));
        };
    },
    conformBuy(){//确认购买商品
        var self = this;
        var _num = parseInt(this.goodsNum.string);
        var buyParm = {
            itemId:self.id,
            num:_num,
            // type:1
        };
        this.getComponent('ReqAni').showReqAni();
        Net.get('/game/store/buy',1,buyParm,function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
                if(data.msg=='您的钻石不足'){
                    this.showConDia('您的钻石不足,是否去兑换钻石?',()=>{
                        cc.find('Game').getComponent('GameWindow').closeShop();
                        cc.find('Game').getComponent('GameWindow').openRechargeBox();
                    },()=>{});
                }
            }else{
                this.showLittleTip('购买成功');
                cc.find('Game').getComponent('UpdateUserInfo').refresh(1);
            }
            this.getComponent('ReqAni').hideReqAni();
        }.bind(this),function(err){
            this.showLittleTip('网络错误');
            cc.director.getScene().getChildByName('ReqAni').active = false;
        }.bind(this));
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    showConDia(msg,fn1,fn2){//弹出确认对话框
        if(!Global.conLayer||!Global.conLayer.name){
            Global.conLayer = cc.instantiate(this.alertLayer);
        }
        Global.conLayer.parent = cc.find('Canvas');
        Global.conLayer.active = true;

        var dia = cc.instantiate(this.conDia);
        dia.parent = cc.find('Canvas');
        dia.getComponent('ConfirmDia').setBoxFun(msg,fn1,fn2);
        dia.getComponent('ConfirmDia').showThis();
    },
    touchStart(){
        if(!Global.goodsDesc||!Global.goodsDesc.name){
            Global.goodsDesc = cc.instantiate(this.descPrefab);
        }
        let pos2 =  this.listItem.convertToWorldSpaceAR(cc.Vec2.ZERO);
        // let pos = this.listItem.getPosition();
        Global.goodsDesc.parent = cc.find('Canvas');
        Global.goodsDesc.setPosition(pos2.x-280,pos2.y-410);
        Global.goodsDesc.getComponent('GoodsInfo').showGoodInfo(
            this.img.spriteFrame,
            this.goodsName.string.split('>')[1].split('<')[0],
            this.goodsDesc.string
        );
    },
    touchEnd(){
        Global.goodsDesc.getComponent('GoodsInfo').hideGoodInfo();
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});