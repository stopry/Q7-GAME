var Net = require('Net');
var Util = require('Util');
cc.Class({
    extends: cc.Component,

    properties: {
        //确认框资源start
        conDia:{//确认对话框
            default:null,
            type:cc.Prefab
        },
        root:{//根节点
            default:null,
            type:cc.Node
        },
        alertLayer:{//遮罩层
            default:null,
            type:cc.Prefab
        },
        //确认框资源end
        emailItemBox:{//日志列表项容器
            default:null,
            type:cc.Node
        },
        emailItemPre:{//日志列表项预制
            default:null,
            type:cc.Prefab
        },
        nextBtn:{//下一页按钮
            default:null,
            type:cc.Node
        },
        preBtn:{//上一页按钮
            default:null,
            type:cc.Node
        },
        cuurentPage:{//当前页数
            default:null,
            type:cc.Label
        },
        allPage:{//总页数
            default:null,
            type:cc.Label
        },
        littleTip:{//小提示
            default:null,
            type:cc.Prefab
        },
        pageBtnBgList:{//分页按钮四张背景图
            default:[],
            type:[cc.SpriteFrame]
        },

        //详情背景
        detailLayer:cc.Node,
        //详情框
        detaiBox:cc.Node,
        detailCon:cc.Label,
        detaiTime:cc.Label

    },
    // use this for initialization
    onLoad: function () {
        this.creatNodePool();
        this.curPageNum = 1;//默认当前页
        this.allPageNum = 0;//默认总页数
        this.isLoading = false;//默认不在加载中
        this.nextBtn.on(cc.Node.EventType.TOUCH_END,function(){
            this.nextPage();
        },this);
        this.preBtn.on(cc.Node.EventType.TOUCH_END,function(){
            this.prePage();
        },this);
    },
    creatNodePool(){//创建日志item列表对象池
        this.emailItemArray = [];
    },
    renderLogList(){//渲染日志列表
        var itemLen = this.emailItemBox.getChildren().length;
        //for(var l = 0;l<itemLen;l++){
        //    this.emailItemArray.push(this.emailItemBox.getChildren()[l]);
        //}
        //cc.log(this.emailItemArray.length,"对象数组长度1");
        this.emailItemBox.removeAllChildren();
        this.getLogData();
    },
    getLogData(){//得到日志数据
        this.isLoading = true;
        var self = this;
        Net.get('/game/message/list',1,{pageNum:self.curPageNum},function(data){
            if(!data.success){
                this.showLittleTip(data.msg);
                this.allPageNum = 0;
                this.curPageNum = 0;
            }else if(!data.obj||!data.obj.records||data.obj.records.length<=0){
                this.preBtn.getComponent(cc.Sprite).spriteFrame = this.pageBtnBgList[0];
                this.nextBtn.getComponent(cc.Sprite).spriteFrame = this.pageBtnBgList[2];
                this.allPageNum = 0;
                this.curPageNum = 0;
            }else{
                var emailItem = null;
                var recs = data.obj.records;
                for(var i = 0;i<recs.length;i++){
                    //if(this.emailItemArray.length>0){
                    //    emailItem = this.emailItemArray.shift();
                    //}else{
                        emailItem = cc.instantiate(this.emailItemPre);
                    //}
                    this.emailItemBox.addChild(emailItem);
                    let time = recs[i].datetime;
                    emailItem.getComponent('EmailItem').setItem(
                        time,
                        recs[i].status,
                        recs[i].content,
                        recs[i].id
                    );
                }
                this.allPage.string = data.obj.pages;
                this.allPageNum = data.obj.pages;
                this.cuurentPage.string = data.obj.current;
            }
            this.isLoading = false;
            //this.getComponent('ReqAni').hideReqAni();//关闭加载动画
        }.bind(this),function(data){
            this.isLoading = false;
            this.showLittleTip('网络错误');
            cc.director.getScene().getChildByName('ReqAni').active = false;
        }.bind(this));
    },
    //显示邮件详情
    showDetail(con,date){
        this.detailLayer.active = true;
        this.detaiBox.active = true;
        this.detailCon.string = con;
        this.detaiTime.string = date;
    },
    //关闭详情
    closeDetail(){
        this.detailLayer.active = false;
        this.detaiBox.active = false;
    },
    nextPage(){
        if(this.allPageNum<=0){
            this.preBtn.getComponent(cc.Sprite).spriteFrame = this.pageBtnBgList[0];
            this.nextBtn.getComponent(cc.Sprite).spriteFrame = this.pageBtnBgList[2];
            return;
        }
        if(this.curPageNum>=this.allPageNum){
            //this.showLittleTip('没有下一页了');
            this.nextBtn.getComponent(cc.Sprite).spriteFrame = this.pageBtnBgList[2];
            this.preBtn.getComponent(cc.Sprite).spriteFrame = this.pageBtnBgList[1];
            return
        };
        this.nextBtn.getComponent(cc.Sprite).spriteFrame = this.pageBtnBgList[3];
        this.preBtn.getComponent(cc.Sprite).spriteFrame = this.pageBtnBgList[1];
        this.curPageNum++;
        if(this.curPageNum>=this.allPageNum){
            this.nextBtn.getComponent(cc.Sprite).spriteFrame = this.pageBtnBgList[2];
            this.preBtn.getComponent(cc.Sprite).spriteFrame = this.pageBtnBgList[1];
        }
        this.renderLogList();
    },
    prePage(){
        if(this.allPageNum<=0){
            this.preBtn.getComponent(cc.Sprite).spriteFrame = this.pageBtnBgList[0];
            this.nextBtn.getComponent(cc.Sprite).spriteFrame = this.pageBtnBgList[2];
            return;
        }
        if(this.curPageNum<=1){
            //this.showLittleTip('没有上一页了');
            this.nextBtn.getComponent(cc.Sprite).spriteFrame = this.pageBtnBgList[3];
            this.preBtn.getComponent(cc.Sprite).spriteFrame = this.pageBtnBgList[0];
            return
        };
        this.nextBtn.getComponent(cc.Sprite).spriteFrame = this.pageBtnBgList[3];
        this.preBtn.getComponent(cc.Sprite).spriteFrame = this.pageBtnBgList[1];
        this.curPageNum--;
        if(this.curPageNum<=1){
            this.nextBtn.getComponent(cc.Sprite).spriteFrame = this.pageBtnBgList[3];
            this.preBtn.getComponent(cc.Sprite).spriteFrame = this.pageBtnBgList[0];
        }
        this.renderLogList();
    },
    showThis(){
        this.root.active = true;
        this.root.runAction(Global.openAction);
        this.renderLogList()
    },
    showLittleTip:function(str){//显示提示
        this.getComponent('LittleTip').setContent(str);
    },
    showConDia(msg,fn1,fn2){//弹出确认对话框
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
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
