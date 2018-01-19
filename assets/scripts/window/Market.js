var Net = require('Net');
var Util = require('Util');
cc.Class({
    extends: cc.Component,
    properties: {
        root:{//根节点
            default:null,
            type:cc.Node
        },
        proItemPre:{//商品预制
            default:null,
            type:cc.Prefab
        },
        //木材图片列表
        woodPicList:{
            default:[],
            type:[cc.SpriteFrame]
        },
        //树苗图片列表
        treePicList:{
          default:[],
          type:[cc.SpriteFrame]
        },
        //绿能图片；
        greenPicList:{
            default:[],
            type:[cc.SpriteFrame]
        },
        itemBox:{//商品容器
            default:null,
            type:cc.Node
        },
        //交易来往预制
        tradeHisBox:{
            default:null,
            type:cc.Prefab
        },
        //赠送框预制
        giveBox:{
            default:null,
            type:cc.Prefab
        },
    },
    // use this for initialization
    onLoad: function () {
        this.createItemPool();
        this.interVal = null;
        this.redenrMarket();
    },
    createItemPool(){
        this.itemPool = new cc.NodePool();
    },

    //渲染市场
    redenrMarket(){
        this.proList = [];
        //box中的列表项数量
        var itemLen = this.itemBox.getChildren().length;
        //将列表项加入对象池
        for(let i = 0;i<itemLen;i++){
            this.itemPool.put(this.itemBox.getChildren()[0]);
        }
        Net.post('/showOverallMarket',1,null,(res)=>{
            var item = null;//列表项
            var img = null;//商品图片
            if(res.success){
                var proList = Util.assemMarketList(res.obj);//商品列表
                for(let j = 0;j<proList.length;j++){
                    if(this.itemPool.size()>0){
                        item = this.itemPool.get();
                    }else{
                        item = cc.instantiate(this.proItemPre);
                    }
                    this.itemBox.addChild(item);
                    this.proList.push(item);
                    var _pre = parseInt(((proList[j].proId).toString()).split('')[0]);
                    var _last = parseInt(((proList[j].proId).toString()).split('')[3]);
                    if(_pre==1){
                        img = this.woodPicList[_last-1]
                    }else if(_pre==2){
                        img = this.treePicList[_last-1]
                    }else if(_pre==4){//绿能
                        img = this.greenPicList[0];
                    }
                    item.getComponent('MarketProItem').setItem(
                        proList[j].proId,
                        proList[j].changePrice.toFixed(5),
                        proList[j].changeRate.toFixed(2)+'%',
                        img,
                        proList[j].proName
                    )
                }
            }
        },(err)=>{

        });
    },
    //去市场挂牌、
    toMarketListed(){
        if(!Global.tranActive.listed){
            this.showLittleTip('此功能暂未开放');
            return;
        }
        Util.toAppMarket('listed-market');
        /*
        let token = cc.sys.localStorage.getItem('token');
        token = encodeURI(token);
        cc.sys.openURL(Global.marketDomain+"/html/skip-page.html?token="+token+"&link=listed-market");
        */
        //cc.sys.openURL("http://localhost/html/skip-page.html?token="+token+"&link=listed-market");
        //cc.sys.openURL("http://wap.market.o2plan.cn/html/listed-market.html");
    },
    //更新市场
    updateMarket(){
        Net.post('/showOverallMarket',1,null,(res)=>{
            if(res.success){
                var proList = Util.assemMarketList(res.obj);//商品列表
                for(let j = 0;j<proList.length;j++){
                    this.proList[j].getComponent('MarketProItem').updateItem(
                        proList[j].changePrice.toFixed(5),
                        proList[j].changeRate.toFixed(2)+'%'
                    )
                }
            }
        },(err)=>{
            this.showLittleTip('网络错误');
            cc.director.getScene().getChildByName('ReqAni').active = false;
        });
    },
    //显示自己动画
    showThis(){
        this.root.active = true;
        this.root.runAction(Global.openAction);
        this.interVal = setInterval(()=>{
            this.updateMarket();
        },5000)
    },
    //停止定时更新
    hideThis(){
        clearInterval(this.interVal);
    },
    //打开赠送框
    openGievBox(){
        if(!Global.giveBox||!Global.giveBox.name){
            Global.giveBox = cc.instantiate(this.giveBox);
        }
        Global.giveBox.getComponent('GiveBox').openGiveBox();
        Global.giveBox.parent = cc.find('Canvas');
    },
    //打开交易历史
    openTradeHistory(){
        if(!Global.tradeHisBox||!Global.tradeHisBox.name){
            Global.tradeHisBox = cc.instantiate(this.tradeHisBox);
        }
        Global.tradeHisBox.getComponent('TradeHistory').openThis();
        Global.tradeHisBox.parent = cc.find('Canvas');
    },
    //小提示
    showLittleTip(str){
        this.getComponent('LittleTip').setContent(str);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
