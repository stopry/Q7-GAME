let Net = require('Net');
const QaUtil = (function(Qa){

    Qa = Qa||function(){};
    let qa = Qa.prototype;

    //获取用户答题次数信息
    let getQqNumUrl = '/question/index';
    qa.getQaNum = function(datas){
        datas = datas||null;
        let pr = new Promise((resolve,reject)=>{
            Net.get(getQqNumUrl,2,datas,(res)=>{
                resolve(res);
            },(err)=>{
                reject(false);
            });
        });
        return pr;
    };
    //获取Qa token
    qa.getQaToken = function(){

    };
    /*用户准备界面s*/

    //设置用户的状态
    /***
     * cardNode 卡片node
     * status 准备状态
     * headList 头像图片列表
     * headIndex 头像图片索引
     *
     */
    qa.setReadyStatus = (cardNode,status,headList,headIndex)=>{
        cardNode.getChildByName('role_box_border').active = status;
        cardNode.getChildByName('prepare_icon').active = status;
        cardNode.getChildByName('head_1').getComponent(cc.Sprite).spriteFrame = headList[headIndex-1];
    };
    /*用户准备界面e*/

    /*答题界面s*/

    //点击后显示按钮状态
    /**
     * @btn 选择的按钮
     * @btnStatusBg 背景状态图列表
     * @status 状态0
     *
     * */
    qa.setOptionClickStatus = (btn,btnStatusBg,status)=>{
        btn.getComponent(cc.Sprite).spriteFrame = btnStatusBg[status];
    };
    //重置按钮状态
    /**
     * @btn 选择的按钮
     * @btnStatusBg 背景状态图列表
     * @status 状态0
     *
     * */
    qa.resetBtnStatus = (btn,btnStatusBg,status)=>{
        btn.getComponent(cc.Sprite).spriteFrame = btnStatusBg[status];//设置为nor图片
        btn.getChildByName('opText').getComponent(cc.Label).string = '';//设置option为空
        btn.getChildByName('Ticon').active = false;//隐藏错误正确图标
        btn.getChildByName('Ficon').active = false;//隐藏错误正确图标
    };
    //给题目和选项赋值
    /**
     * quesInfo 题目信息
     *
     *  {
      * title:标题,
      * options:[答案列表
      *     1,
      *     2,
      *     3,
      *     4
      * ]
      * }
     *
     * titleLabel 题目标题
     * optionList 四个选项node
     * */
    qa.setData = (quesInfo,titleLabel,optionList)=>{
        titleLabel.string = quesInfo.title;
        for(let i = 0;i<quesInfo.options.length;i++){
            optionList[i].getChildByName('opText').getComponent(cc.Label).string = quesInfo.options[i];
        }
    };
    //options状态显示
    /**
     * @btnStatusBg 背景状态图列表
     * @iconPicList icon图片列表
     * @result (resultO,resultE)(我方结果-敌方结果) 结果数据{trueAnw:string,result:bool,anwser:string}
     * @optionsList //options列表
     * */
    qa.showOptionStatus = (btnStatusBg,iconPicList,result,optionsList)=>{
        let resultBtn = null;
        if(result.anwser=='') return;//如果回答为空
        for(let i = 0;i<4;i++){
            let text = optionsList[i].getChildByName('opText').getComponent(cc.Label).string;
            if(result.anwser==text){
                resultBtn = optionsList[i];
                break;
            }
        };
        if(result.team==1){//显示我方
            if(result.result){
                resultBtn.getComponent(cc.Sprite).spriteFrame = btnStatusBg[1];
                resultBtn.getChildByName('Ticon').getComponent(cc.Sprite).spriteFrame = iconPicList[0];
            }else{
                resultBtn.getComponent(cc.Sprite).spriteFrame = btnStatusBg[2];
                resultBtn.getChildByName('Ticon').getComponent(cc.Sprite).spriteFrame = iconPicList[1];
            }
            resultBtn.getChildByName('Ticon').active = true;
        }else{//敌方
            if(result.result){
                resultBtn.getComponent(cc.Sprite).spriteFrame = btnStatusBg[1];
                resultBtn.getChildByName('Ficon').getComponent(cc.Sprite).spriteFrame = iconPicList[0];
            }else{
                resultBtn.getComponent(cc.Sprite).spriteFrame = btnStatusBg[2];
                resultBtn.getChildByName('Ficon').getComponent(cc.Sprite).spriteFrame = iconPicList[1];
            }
            resultBtn.getChildByName('Ficon').active = true;
        }
    };
    //根据文本获取 文本依附的那个按钮
    qa.getBtnByAws = function(awsText,options){
        let resultBtn = null;
        for(let i = 0;i<4;i++){
            let text = options[i].getChildByName('opText').getComponent(cc.Label).string;
            if(awsText==text){
                resultBtn = options[i];
                break;
            }
        };
        return resultBtn||options[0];
    };
    //用户答题状态气泡显示
    /**
     * head 用户头像
     * bubbleIcon 气泡图片 0错误 1正确
     * bool true回答正确 false 回答错误
     * */
    qa.userAnwserShowBubble = (head,bubbleIcon,bool)=>{
        if(bool){
            head.getChildByName('succ_info').getComponent(cc.Sprite).spriteFrame = bubbleIcon[1];
        }else{
            head.getChildByName('succ_info').getComponent(cc.Sprite).spriteFrame = bubbleIcon[0];
        }
        head.getChildByName('succ_info').getComponent(cc.Animation).play('showUserAnwserStatus');
    };
    //印章动画
    /**
     * stamp node
     * stampPics 图片列表
     * status 0 1 2 胜利 平局 失败
     * */
    qa.stampAni = (stamp,stampPics,status)=>{
        stamp.getComponent(cc.Sprite).spriteFrame = stampPics[status];
        stamp.getComponent(cc.Animation).play('resultStamp');
    };
    //进度条增长动画
    /**
     * process 进度条
     * bScore 之前分数
     * eScore 之后分数
     *
     * */
    qa.addScoreProAni = function(process,bScore,eScore){
        if(eScore==bScore)return;
        var probNum = Global.Qa.playType==1?6:3;
        let interVal = setInterval(()=>{
            bScore+=0.01;
            if(bScore>=eScore){
                bScore = eScore;

                clearInterval(interVal);
            }
            process.progress = bScore/probNum;
        },10);
    };

    /*答题界面e*/

    return new Qa();
})(QaUtil);
module.exports = QaUtil;