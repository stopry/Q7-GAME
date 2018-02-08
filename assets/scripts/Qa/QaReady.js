let Util = require('Util');
let QaUtil = require('QaUtil');
cc.Class({
    extends: cc.Component,
    properties: {
        ownerTeam:[cc.Node],//本方队伍
        otherTeam:[cc.Node],//敌方队伍
        headPicList:[cc.SpriteFrame],//头像列表
        readyNum:cc.Label,//准备的人数
        allNum:cc.Label,//所有人数
        countDownNum:cc.Label,//倒计时label
        readyBtn:cc.Node,//准备按钮
        alReadyBtn:cc.Node,//已经准备按钮
    },
    onLoad () {
        this.socket = Util.getPerNode('PersistNode').getComponent('PersistNode').mySocket;
        this._interVal = null;//定时器
        //准备信息
        this.info = {
            type:Global.Qa.playType,//1 1v1 2 3v3
            readyNum:0,//已准备人数
            allNum:Global.Qa.playType==1?2:6,//所有人数
            isAllReady:false,//是否全部准备完
            //队伍信息
            teams:{
                //我方
                ourTeam:[
                    {
                        head:1,//用户头像
                        readyStatue:true,//0未准备 1 已准备
                        id:10086,
                        userName:'111',
                    },
                ],
                //对方
                anoTeam:[
                    {
                        head:4,//用户头像
                        readyStatue:0,//0未准备 1 已准备
                        id:10086,
                        userName:'111',
                    },
                ]
            }
        }
    },
    //给info team赋值
    setTeamData(team,isOur){
        if(isOur){
            this.info.teams.ourTeam = [];
        }else{
            this.info.teams.anoTeam = [];
        }
        for(let i = 0;i<team.length;i++){
            if(isOur){
                this.info.teams.ourTeam[i] = {};
                this.info.teams.ourTeam[i].head = isNaN(parseInt(team[i].pic))?1:parseInt(team[i].pic);
                this.info.teams.ourTeam[i].readyStatue = team[i].status=="readied";
                this.info.teams.ourTeam[i].id = team[i].playerId;
                this.info.teams.ourTeam[i].userName = team[i].nickName;
            }else{
                this.info.teams.anoTeam[i] = {};
                this.info.teams.anoTeam[i].head = isNaN(parseInt(team[i].pic))?1:parseInt(team[i].pic);
                this.info.teams.anoTeam[i].readyStatue = team[i].status=="readied";
                this.info.teams.anoTeam[i].id = team[i].playerId;
                this.info.teams.anoTeam[i].userName = team[i].nickName;
            }
        }
    },
    start () {
        //进入后预加载GameT
        cc.director.preloadScene("GameT",()=>{
        });
        this.socket.onmessage = (res)=>{
            res = JSON.parse(res.data);
            //console.log(res);
            if(res.cmd=='ready_info'&&res.code==0){//准备阶段
                //let arr = [];
                //arr[0] = {};
                //for(let k in res.data.owner){
                //    arr[0].k = res.data.owner.k
                //}
                //for(let k = 0;k<res.data.team.length;k++){
                //    arr.push(res.data.team[k]);
                //}
                res.data.team.unshift(res.data.owner);
                let ourTeam = res.data.team;//我方队伍
                let anoTeam = res.data.opponent;//敌方队伍
                this.setTeamData(ourTeam,1);
                this.setTeamData(anoTeam,!1);
                let allNums = this.info.teams.ourTeam.concat(this.info.teams.anoTeam);
                let readys = 0;
                for(let i = 0;i<allNums.length;i++){
                    if(allNums[i].readyStatue){
                        readys++;
                    }
                }

                this.info.readyNum = readys;

                this.init();
            }
            if(res.cmd=='ready_err'&&res.code==0){//准备失败-退回主界面
                this.socket.close();
                if(this.time_out){
                    clearTimeout(this.time_out)
                }
                Util.showConDia('有人中途退出准备或准备超时,或链接被断开,请重新回到主页',()=>{
                    cc.director.loadScene('Game');
                },()=>{
                    cc.director.loadScene('Game');
                })
            }
            if(res.cmd=='ready_succ'&&res.code==0){//准备成功-进入答题界面
                //console.log(res.data);

                //全部置为准备状态
                if(Global.Qa.playType==1){
                    this.ownerTeam[1].getChildByName('role_box_border').active = true;
                    this.ownerTeam[1].getChildByName('prepare_icon').active = true;
                    this.otherTeam[1].getChildByName('role_box_border').active = true;
                    this.otherTeam[1].getChildByName('prepare_icon').active = true;
                }else{
                    for(let l = 0;l<3;l++){
                        this.ownerTeam[l].getChildByName('role_box_border').active = true;
                        this.ownerTeam[l].getChildByName('prepare_icon').active = true;
                        this.otherTeam[l].getChildByName('role_box_border').active = true;
                        this.otherTeam[l].getChildByName('prepare_icon').active = true;
                    }
                }
                this.readyNum.string = this.info.allNum;

                cc.sys.localStorage.setItem('qaUserInfo',JSON.stringify(this.info));
                this.time_out = setTimeout(()=>{
                    Util.showLoading();
                    cc.director.loadScene('GameT',()=>{

                    });
                },3*1000);

            }
        };

        //20s倒计时
        let timerS = 20;
        this._interVal = setInterval(_=>{
            timerS--;
            if(timerS<=0){
                clearInterval(this._interVal);
                setTimeout(()=>{
                    //this.goToGame();
                },3000);
            }
            this.countDownNum.string = timerS;
        },1000);
    },
    init(){
        this.readyNum.string = this.info.readyNum;
        this.allNum.string = this.info.allNum;
        //1v1答题
        if(Global.Qa.playType==1){
            //只显示每队的中间头像
            this.ownerTeam[1].active = true;
            this.otherTeam[1].active = true;
            QaUtil.setReadyStatus(
                this.ownerTeam[1],
                this.info.teams.ourTeam[0].readyStatue,
                this.headPicList,
                this.info.teams.ourTeam[0].head
            );
            QaUtil.setReadyStatus(
                this.otherTeam[1],
                this.info.teams.anoTeam[0].readyStatue,
                this.headPicList,
                this.info.teams.anoTeam[0].head
            );
        }
        //3v3答题
        if(Global.Qa.playType==2){
            for(let i = 0;i<this.info.teams.ourTeam.length;i++){
                this.ownerTeam[i].active = true;
                this.otherTeam[i].active = true;
                QaUtil.setReadyStatus(
                    this.ownerTeam[i],
                    this.info.teams.ourTeam[i].readyStatue,
                    this.headPicList,
                    this.info.teams.ourTeam[i].head
                );
                QaUtil.setReadyStatus(
                    this.otherTeam[i],
                    this.info.teams.anoTeam[i].readyStatue,
                    this.headPicList,
                    this.info.teams.anoTeam[i].head
                );
            }
        }
    },
    //准备游戏
    readyGame(){
        this.readyBtn.active = false;
        this.alReadyBtn.active = true;
        let message = '{"cmd":"ready","data":""}';
        this.socket.send(message);
    },
    //进入游戏
    goToGame(){
       cc.director.loadScene('GameT',_=>{

       });
    },
    onDestroy(){
        if(this.time_out){
            clearTimeout(this.time_out)
        }
        if(this._interVal){
            clearInterval(this._interVal);
        }
    },
    // update (dt) {},
});
