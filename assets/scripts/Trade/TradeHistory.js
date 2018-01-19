var Net = require('Net');
cc.Class({
    extends: cc.Component,

    properties: {
        root:{
            default:null,
            type:cc.Node
        },
        /*切换类型相关s*/
        //收入按钮
        inBtn:{
            default:null,
            type:cc.Node
        },
        //赠出按钮
        outBtn:{
            default:null,
            type:cc.Node
        },
        //收入list框
        inListWrap:{
            default:null,
            type:cc.Node
        },
        //赠出list框
        outListWrap:{
            default:null,
            type:cc.Node
        },
        //收入分页框
        inPageWrap:{
            default:null,
            type:cc.Node
        },
        //赠出分页框
        outPageWrap:{
            default:null,
            type:cc.Node
        },
        //选中状态按钮背景图
        activeBtnPic:{
            default:null,
            type:cc.SpriteFrame
        },
        //未选中状态按钮背景图
        normalBtnPic:{
            default:null,
            type:cc.SpriteFrame
        },
        /*切换类型相关e*/
        //列表项预制
        listItem:{
            default:null,
            type:cc.Prefab
        },
        //列表容器
        listItemBox:{
            default:[],
            type:[cc.Node]
        },
        //页数字符
        pageString:{
            default:[],
            type:[cc.Label]
        }
    },
    onLoad () {
        this.pageString[0].string = "0/0";
        this.pageString[1].string = "0/0";
        //type默认为1->收入列表
        this.type = 1;

        this.createHisPool();
        //列表放入数组
        this.isLoading = false;//默认不在加载中
        this.inCurPage = 1;//收入默认当前页
        this.inAllPage = 1;//收入默认总页
        this.outCurPage = 1;//赠出默认当前页
        this.outAllPage = 1;//赠出默认总页
    },
    createHisPool(){
        this.hisPool = [
            new cc.NodePool(),//收入列表对象池
            new cc.NodePool()//赠出列表对象池
        ];
    },
    //初始化列表
    initList(type){
        type = type||this.type;
        let pageNum;
        let allPageNum;
        let url;
        if(type==1){//收入类型
            pageNum = this.inCurPage;
            allPageNum = this.inAllPage;
            url = '/game/giving/inList'
        }else{//赠出类型
            pageNum = this.outCurPage;
            allPageNum = this.outAllPage;
            url = '/game/giving/outList'
        }
        if(pageNum>allPageNum){
            pageNum = allPageNum;
        }
        console.log(url);
        cc.director.getScene().getChildByName('ReqAni').active = true;
        Net.get(url,1,{pageNum:pageNum},(res)=>{
            if(!res.success){
                this.showLittleTip(res.msg);
            }else{
                let _curPage = res.obj.current;
                let _allPage = res.obj.pages;
                if(type==1){
                    this.inAllPage = _allPage;
                }else{
                    this.outAllPage = _allPage;
                }

                this.pageString[type-1].string = _curPage+"/"+_allPage;

                let records = res.obj.records;
                if(!records.length){
                    this.pageString[type-1].string = "0/0";
                    cc.director.getScene().getChildByName('ReqAni').active = false;
                    return;
                };
                //得到当前类型列表的列表长度
                let itemLen = (this.listItemBox[type-1]).getChildren().length;
                //将列表里的子节点放入对应对象池
                for(let i = 0;i<itemLen;i++){
                    (this.hisPool[type-1]).put((this.listItemBox[type-1]).getChildren()[0]);
                }
                let tempItem = null;
                for(let k = 0;k<records.length;k++){
                    if(this.hisPool[type-1].size()>0){
                        tempItem = this.hisPool[type-1].get();
                    }else{
                        tempItem = cc.instantiate(this.listItem);
                    }
                    this.listItemBox[type-1].addChild(tempItem);
                    tempItem.getComponent('SetTradeListItem').setItem(
                        records[k].greenId-4001,
                        type==1?records[k].ownerId:records[k].targetId,
                        records[k].cnt,
                        records[k].gold,
                        type,
                        records[k].id,
                        records[k].status
                    );
                }
            }
            cc.director.getScene().getChildByName('ReqAni').active = false;
        },()=>{
            this.showLittleTip('网络错误');
            cc.director.getScene().getChildByName('ReqAni').active = false;
        });
    },
    //得到收入上一页
    getInPre(){
        if(this.inCurPage<=1){
            return;
        }
        this.inCurPage--;
        this.initList();
    },
    //得到收入下一页
    getInNext(){
        if(this.inCurPage>=this.inAllPage){
            return;
        }
        this.inCurPage++;
        this.initList();
    },
    //得到赠出上一页
    getOutPre(){
        if(this.outCurPage<=1){
            return;
        }
        this.outCurPage--;
        this.initList();
    },
    //得到赠出下一页
    getOutNext(){
        if(this.outCurPage>=this.outAllPage){
            return;
        }
        this.outCurPage++;
        this.initList();
    },
    //类型切换
    /**
     * @type 1收入 2赠出
     * */
    typeChange(event,type){
        type=type||"1";
        if(type=="1"){
            this.type = 1;
            this.inBtn.rotation = 180;
            this.inBtn.getChildByName('input_text').rotation = 180;
            this.inBtn.getComponent(cc.Sprite).spriteFrame = this.activeBtnPic;
            this.outBtn.rotation = 180;
            this.outBtn.getChildByName('out_text').rotation = 180;
            this.outBtn.getComponent(cc.Sprite).spriteFrame = this.normalBtnPic;
            this.inListWrap.active = true;
            this.inPageWrap.active = true;
            this.outListWrap.active = false;
            this.outPageWrap.active = false;
        }else{
            this.type = 2;
            this.inBtn.rotation = 0;
            this.inBtn.getChildByName('input_text').rotation = 0;
            this.inBtn.getComponent(cc.Sprite).spriteFrame = this.normalBtnPic;
            this.outBtn.rotation = 0;
            this.outBtn.getChildByName('out_text').rotation = 0;
            this.outBtn.getComponent(cc.Sprite).spriteFrame = this.activeBtnPic;
            this.inListWrap.active = false;
            this.inPageWrap.active = false;
            this.outListWrap.active = true;
            this.outPageWrap.active = true;
        }
        this.initList();
    },
    //打开自己
    openThis(){
        this.root.active = true;
        setTimeout(()=>{
            this.initList();
        },0);
    },
    //关闭自己
    closeThis(){
        this.root.active = false;
    },
    /*start () {

    },*/
    // update (dt) {},
});
