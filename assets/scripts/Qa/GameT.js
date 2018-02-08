let Util = require('Util');
let QaUtil = require('QaUtil');
cc.Class({
    extends:cc.Component,
    properties:{
        /*头部相关s*/
        ourTeam:[cc.Node],//本方队伍
        anoTeam:[cc.Node],//敌方队伍
        ourName:cc.Label,//我方队伍姓名
        anoName:cc.Label,//敌方队伍姓名
        headPicList:[cc.SpriteFrame],//头像图片列表
        bubbleIcon:[cc.SpriteFrame],//气泡图片
        circleTimeBar:cc.ProgressBar,//倒计时进度条
        countNum:cc.Label,//倒计时label
        /*头部相关e*/

        /*题目相关s*/
        ourPrgBar:cc.ProgressBar,//我方进度条
        anoPrgBar:cc.ProgressBar,//敌方进度条
        optionBox:cc.Node,//四个选项的容器
        QesTitle:cc.Label,//题目标题
        QesTitleNode:cc.Node,//题目标题Node
        options:[cc.Node],//四个题目答案选项
        optionBgPic:[cc.SpriteFrame],//options背景图
        resultStatus:[cc.SpriteFrame],//错误失败icon图片
        /*题目相关e*/

        resultStamp:cc.Node,//每局得结局印章
        stampPic:[cc.SpriteFrame],//印章图片列表
        addScore:cc.Node,//分数+1图片
        boxLayer:cc.Node,//遮罩
        winDia:cc.Node,//win弹框
        failDia:cc.Node,//失败弹框

        winBoxHead:[cc.Node],//winBox头像
        failBoxHead:[cc.Node],//失败box头像
        winBoxScoreO:cc.Label,//winbox我方分数
        winBoxScoreE:cc.Label,//winbox对方分数

        failBoxScoreO:cc.Label,//failbox我方分数
        failBoxScoreE:cc.Label,//failbox对方分数

    },
    //更新队伍信息
    /*
    * oTeam 我方队伍信息
    * eTeam 对方队伍信息
    * */
    updateTeamInfo(oTeam,eTeam){
        this.teamInfo.o = [];
        this.teamInfo.e = [];
        for(let i = 0;i<oTeam.length;i++){
            this.teamInfo.o[i]={};
            this.teamInfo.o[i].head = isNaN(parseInt(oTeam[i].pic))?1:parseInt(oTeam[i].pic);
            this.teamInfo.o[i].id = oTeam[i].playerId;
            this.teamInfo.o[i].userName = oTeam[i].nickName;
        }
        for(let k = 0;k<eTeam.length;k++){
            this.teamInfo.e[k]={};
            this.teamInfo.e[k].head = isNaN(parseInt(eTeam[k].pic))?1:parseInt(eTeam[k].pic);
            this.teamInfo.e[k].id = eTeam[k].playerId;
            this.teamInfo.e[k].userName = eTeam[k].nickName;
        }
    },
    onLoad(){
        this.socket = Util.getPerNode('PersistNode').getComponent('PersistNode').mySocket;
        this.userSeledOption = '';//用户选择的答案
        this.time_Out = false;//是否超时
        this.selCanClick = false;//选项是否可以点击
        this.type = Global.Qa.playType;// 1->1v1  2->3v3 默认1v1
        this._interVal = null;
        //队伍信息
        this.teamInfo = {
            o:[//我方队伍
                //{
                //    head:3,//头像
                //    id:10089,//id,
                //    userName:'健康漆'
                //},
            ],
            e:[//敌方队伍
                //{
                //    head:4,
                //    id:10088,
                //    userName:'健康漆2'
                //},
            ]
        };
        let qaUserInfo = this.qaUserInfo = JSON.parse(cc.sys.localStorage.getItem('qaUserInfo'));
        for(let i = 0;i<qaUserInfo.teams.ourTeam.length;i++){
            this.teamInfo.o[i] = {};
            this.teamInfo.o[i].head = qaUserInfo.teams.ourTeam[i].head;
            this.teamInfo.o[i].id = qaUserInfo.teams.ourTeam[i].id;
            this.teamInfo.o[i].userName = qaUserInfo.teams.ourTeam[i].userName;

            this.teamInfo.e[i] = {};
            this.teamInfo.e[i].head = qaUserInfo.teams.anoTeam[i].head;
            this.teamInfo.e[i].id = qaUserInfo.teams.anoTeam[i].id;
            this.teamInfo.e[i].userName = qaUserInfo.teams.anoTeam[i].userName;
        }

        //options列表
        this.anwserList = [//回答列表
            {
                result:0,//错误
                anwser:'疑似地上霜1',//回答
                team:1,//1 2 我方 敌方
            },
            {
                result:0,//错误
                anwser:'疑似地上霜3',//回答
                team:2,//1 2 我方 敌方
            },
            {
                result:0,//错误
                anwser:'疑似地上霜3',//回答
                team:1,//1 2 我方 敌方
            },
            {
                result:1,//错误
                anwser:'疑似地上霜4',//回答
                team:1,//1 2 我方 敌方
            },
            {
                result:0,//错误
                anwser:'疑似地上霜3',//回答
                team:2,//1 2 我方 敌方
            },
            {
                result:1,//错误
                anwser:'疑似地上霜4',//回答
                team:2,//1 2 我方 敌方
            },
        ];

        //回答结果
        this.anwserResult = {
            o:[
                {
                    head:3,
                    id:10089,
                    userName:'***',
                    result:false
                }
            ],
            e:[
                {
                    head:4,
                    id:10088,
                    userName:'***',
                    result:true
                }
            ]
        };
        //结束信息
        this.overInfo = {
            winTeam:[//胜利队伍
                {
                    head:1,//用户头像
                },
                {
                    head:2,
                },
                {
                    head:3,
                }
            ],
            oScore:3,//我方得分
            eScore:2//对方得分
        }
    },
    //给回答列表赋值
    /**
     * oList 我方回答列表
     * eList 对方回答列表
     * rightAnwser 正确答案
     * */
    setAnwserList(oList,eList,rightAnwser){
        this.anwserList = [];
        let oArr = [];

        let AnwOR = [];//回答结果o

        for(let i = 0;i<oList.length;i++){
            oArr[i]={};
            oArr[i].result = oList[i].answer==rightAnwser?1:0;
            oArr[i].anwser = oList[i].answer;
            oArr[i].team = 1;

            AnwOR[i]={};
            AnwOR[i].head = isNaN(parseInt(oList[i].pic))?1:parseInt(oList[i].pic);
            AnwOR[i].id = oList[i].playerId;
            AnwOR[i].userName = oList[i].nickName;
            AnwOR[i].result = oList[i].answer==rightAnwser;
        }

        let eArr = [];

        let AnwER = [];//回答结果e
        for(let k = 0;k<eList.length;k++){
            eArr[k]={};
            eArr[k].result = eList[k].answer==rightAnwser?1:0;
            eArr[k].anwser = eList[k].answer;
            eArr[k].team = 2;

            AnwER[k]={};
            AnwER[k].head = isNaN(parseInt(eList[k].pic))?1:parseInt(eList[k].pic);
            AnwER[k].id = eList[k].playerId;
            AnwER[k].userName = eList[k].nickName;
            AnwER[k].result = eList[k].answer==rightAnwser;
        }
        this.anwserList = oArr.concat(eArr);

        this.anwserResult.o = AnwOR;
        this.anwserResult.e = AnwER;//敌方回答结果
    },
    //设置进度条
    setProgress(teamScore){
        let oS = parseInt(teamScore.split(':')[0]);
        let eS = parseInt(teamScore.split(':')[1]);
        let ob = this.ourPrgBar.progress;
        if(ob<0.3){
            ob = 0;
        }else if(ob>0.3&&ob<0.6){
            ob = 1;
        }else if(ob>0.6&&ob<1){
            ob = 2;
        }else{
            ob = 3;
        }
        let eb = this.ourPrgBar.progress;
        if(eb<0.3){
            eb = 0;
        }else if(eb>0.3&&eb<0.6){
            eb = 1;
        }else if(eb>0.6&&eb<1){
            eb = 2;
        }else{
            eb = 3;
        }
        QaUtil.addScoreProAni(this.ourPrgBar,ob,oS);
        QaUtil.addScoreProAni(this.anoPrgBar,eb,eS);
    },
    socketResolve(){
        this.socket.onmessage = (res)=>{
            res = JSON.parse(res.data);
            cc.log(res);
            if(res.cmd=='questions'&&res.code==0){//得到问题
                let datas = res.data;
                this.showOptions();
                this.fillQues(datas);
            };
            if(res.cmd=='answer'&&res.code==0){//得到答案

                this.selCanClick = false;//设置按钮不可点击
                clearInterval(this._interVal);//清除定时器
                let data = res.data;
                this.setProgress(data.team_score);

                let rightAns = data.right_answer;//正确答案
                let answer = data.answer;//我回答的答案
                let isTrue = rightAns==answer;//是否回答正确

                if(data.res=='draw'){
                    this.showResultStamp(1);
                }else if(data.res=='win'){
                    this.showResultStamp(0);
                    this.showAddScore();
                }else if(data.res=='loss'){
                    this.showResultStamp(2);
                }

                let meList = [
                    {
                        result:isTrue?1:0,
                        anwser:answer,
                        team:1
                    }
                ];
                let tempArr = [{}];
                tempArr[0].nickName = this.qaUserInfo.teams.ourTeam[0].userName;
                tempArr[0].pic = this.qaUserInfo.teams.ourTeam[0].head+'';
                tempArr[0].playerId = this.qaUserInfo.teams.ourTeam[0].id;
                let our_team = tempArr.concat(data.team);
                cc.log(our_team,0);
                cc.log(data.opponent,2);

                this.updateTeamInfo(our_team,data.opponent);
                this.setAnwserList(data.team,data.opponent,rightAns);
                //
                this.anwserList = meList.concat(this.anwserList);

                //将自己的回答加入到回答结果
                let meResList = [
                    {
                        head:this.qaUserInfo.teams.ourTeam[0].head,
                        id:this.qaUserInfo.teams.ourTeam[0].id,
                        userName:this.qaUserInfo.teams.ourTeam[0].userName,
                        result:isTrue
                    }
                ];

                this.anwserResult.o = meResList.concat(this.anwserResult.o);
                //使正确答案依附的那个按钮变为绿色
                //this.renderHeadPic();//重新头像
                QaUtil.setOptionClickStatus(QaUtil.getBtnByAws(rightAns,this.options),this.optionBgPic,1);
                this.quesResolve();

            };
            if(res.cmd=='result'&&res.code==0){//得到比赛结果
                cc.log(this.teamInfo,'teamInfo');
                let result = res.data;
                //存储到本地用于结束场景
                cc.sys.localStorage.setItem('qaResult',JSON.stringify(result));
                this.overInfo.oScore = parseInt((result.team_score).split(':')[0]);
                this.overInfo.eScore = parseInt((result.team_score).split(':')[1]);
                if(result.res == 'loss'){//失败
                    this.overInfo.winTeam = [];
                    for(let i = 0;i<this.teamInfo.e.length;i++){
                        this.overInfo.winTeam[i]={};
                        this.overInfo.winTeam[i].head = this.teamInfo.e[i].head;
                    }
                    this.showResultDia(!1);
                }
                if(result.res == 'win'){//胜利
                    this.overInfo.winTeam = [];
                    for(let k = 0;k<this.teamInfo.o.length;k++){
                        this.overInfo.winTeam[k]={};
                        this.overInfo.winTeam[k].head = this.teamInfo.o[k].head;
                    }
                    this.showResultDia(1);
                }
                //cc.log(this.overInfo,'overInfo');
            };
        };
        this.socket.onerror = (res)=>{
            Util.showConDia('连接出现错误',()=>{
                this.socket.close();
                cc.director.loadScene('Game');
            },()=>{
                this.socket.close();
                cc.director.loadScene('Game');
            });
        };
        this.socket.oneclose = (res)=>{
            Util.showConDia('连接出现错误',()=>{
                this.socket.close();
                cc.director.loadScene('Game');
            },()=>{
                this.socket.close();
                cc.director.loadScene('Game');
            });
        };
    },
    start(){
        Util.hideLoading();
        this.socketResolve();
        this.init();
    },
    init(){
        this.selOption();
        this.renderHeadPic();
        //this.quesResolve();
    },
    //开始答题
    startQa(){
        let i = 1;
        this.timer = 10;
        this.countNum.string = this.timer;
        this.circleTimeBar.progress = i;
        this._interVal = setInterval(()=>{
            i-=0.1;
            this.timer--;
            this.countNum.string = this.timer;
            this.circleTimeBar.progress = i;
            if(this.timer<=0){//如果超时
                clearInterval(this._interVal);
                this.time_Out = true;
                this.selCanClick = false;

                //let title = this.QesTitle.string;

                this.sendOption('');//超时提交空答案
            }
        },900);
        this.selCanClick = true;
    },
    //填充题目
    fillQues(data){
        this.QesTitle.string = data.title;
        for(let i = 0;i<data.options.length;i++){
            QaUtil.resetBtnStatus(this.options[i],this.optionBgPic,0);
            this.options[i].getChildByName('opText').getComponent(cc.Label).string = data.options[i];
        }
        this.startQa();
    },
    //显示选项
    showOptions(){
        this.QesTitleNode.active = true;
        this.optionBox.getComponent(cc.Animation).play('quesShow');
    },
    //隐藏选项
    hideOptions(){
        this.QesTitleNode.active = false;
        this.optionBox.getComponent(cc.Animation).play('quesHide');
    },
    //全部打完题目以后处理
    quesResolve(){
        //按钮状态改变
        for(let i = 0;i<this.anwserList.length;i++){
            QaUtil.showOptionStatus(this.optionBgPic,this.resultStatus,this.anwserList[i],this.options);
        };
        //用户头像正确错误icon显示
        this.renderHeadPic();
        for(let i = 0;i<this.anwserResult.o.length;i++){
            QaUtil.userAnwserShowBubble(this.ourTeam[i],this.bubbleIcon,this.anwserResult.o[i].result);
        }
        for(let j = 0;j<this.anwserResult.e.length;j++){
            QaUtil.userAnwserShowBubble(this.anoTeam[j],this.bubbleIcon,this.anwserResult.e[j].result);
        }
        //清楚定时器
        clearInterval(this._interVal);
    },
    //提交用户选择的答案
    sendOption(answer){
        var message = '{"cmd":"answer","data":"'+answer+'"}';
        this.socket.send(message);
    },
    //设置答案选项按钮点击事件
    //设置按钮选项选择状态
    selOption(){
        ![].forEach.call(this.options,(item)=>{
            item.on(cc.Node.EventType.TOUCH_END,(event)=>{
                if(!this.selCanClick) return;
                QaUtil.setOptionClickStatus(item,this.optionBgPic,1);//设置按钮为选中状态
                //给用户选择的答案赋值
                this.userSeldAws = item.getChildByName('opText').getComponent(cc.Label).string;
                this.selCanClick = false;

                let title = this.QesTitle.string;
                let answer = this.userSeldAws;
                this.sendOption(answer);
            });
        });
    },
    //头像填充'
    renderHeadPic(){
        this.ourName.string = '';
        this.anoName.string = '';
        if(this.type==1){
            if(this.teamInfo.o.length){
                this.ourName.string = this.teamInfo.o[0].userName;
            }
            if(this.teamInfo.e.length){
                this.anoName.string = this.teamInfo.e[0].userName;
            }
        }else{
        }
        //我方队伍
        for(let k = 0;k<3;k++){
            this.ourTeam[k].active = false;
            this.anoTeam[k].active = false;
        }
        for(let i = 0;i<this.teamInfo.o.length;i++){
            this.ourTeam[i].getComponent(cc.Sprite).spriteFrame = this.headPicList[this.teamInfo.o[i].head-1];
            this.ourTeam[i].active = true;
        }
        for(let j = 0;j<this.teamInfo.e.length;j++){
            this.anoTeam[j].getComponent(cc.Sprite).spriteFrame = this.headPicList[this.teamInfo.e[j].head-1];
            this.anoTeam[j].active = true;
        }
    },
    //显示加分
    showAddScore(){
        this.addScore.getComponent(cc.Animation).play('addScore');
    },
    //显示结局印章
    /**
     * 0 1 2 胜利 平局 失败
     * */
    showResultStamp(type){
        QaUtil.stampAni(this.resultStamp,this.stampPic,type);
    },
    //显示结局弹窗
    showResultDia(type){
        type = type||false;
        this.boxLayer.active = true;
        this.toDownTimeOut = setTimeout(_=>{
            this.showGameDone();
        },10*1000);
        this.socket.close();//答题结束关闭socket
        if(type){//显示胜利弹框
            for(let i = 0;i<this.overInfo.winTeam.length;i++){
                this.winBoxHead[i].getComponent(cc.Sprite).spriteFrame = this.headPicList[this.overInfo.winTeam[i].head-1];
                this.winBoxHead[i].active = true;
            }
            this.winBoxScoreO.string = this.overInfo.oScore;
            this.winBoxScoreE.string = this.overInfo.eScore;
            this.winDia.active = true;
        }else{//显示失败弹框
            for(let i = 0;i<this.overInfo.winTeam.length;i++){
                this.failBoxHead[i].getComponent(cc.Sprite).spriteFrame = this.headPicList[this.overInfo.winTeam[i].head-1];
                this.failBoxHead[i].active = true;
            }
            this.failBoxScoreO.string = this.overInfo.oScore;
            this.failBoxScoreE.string = this.overInfo.eScore;
            this.failDia.active = true;
        }
    },
    //返回游戏主界面
    backGame(){
        Util.showLoading();
        cc.director.loadScene('Game',()=>{

        });
    },
    //提示是否退出答题
    showBackGameDia(){
        Util.showConDia('退出将会给其他玩家带来不好的游戏体验，确定退出吗？',()=>{
            this.socket.close();
            this.backGame();
        },()=>{

        });
    },
    //显示结束界面
    showGameDone(){
        Util.showLoading();
        cc.director.loadScene('QaDown',_=>{

        });
    },
    //再来一次
    playAgain(){
        Global.Qa.playAgain = true;
        this.backGame();
    },
    //炫耀一下啊 分享
    shareGame(){
        Util.showTips('暂未开通,敬请期待!');
    },
    onDestroy(){
        if(this.toDownTimeOut){
            clearTimeout(this.toDownTimeOut);
        }
        if(this._interVal){
            clearInterval(this._interVal);
        }
    }
});