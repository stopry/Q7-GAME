//工具模块
var Util = (function(util){
    util = util||function(){};
    var utl = util.prototype;
    //验证手机号格式
    utl.verMobileReg = function(mobile){
        let mobileNum = /^(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;//手机号正则
        return mobileNum.test(mobile);
    };
    //生成uuid
    utl.createUUID = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    };
    //时间戳生成日期
    utl.formatTimeForH5 = function (now) {
        var year = new Date(now).getFullYear();
        var month = new Date(now).getMonth() + 1 >= 10 ? new Date(now).getMonth() + 1 : '0' + (new Date(now).getMonth() + 1);
        var date = new Date(now).getDate() >= 10　? new Date(now).getDate() :　'0' + new Date(now).getDate();
        var hour = new Date(now).getHours();
        var minute = new Date(now).getMinutes();
        var second = new Date(now).getSeconds();

        return [year + "-" + month + "-" + date,(hour == '0' ? '00' : hour)
        + ":" + (minute == '0' ? '00' : minute)  + ":" + (second == '0' ? '00' : second)];
    };
    //得到时间戳是昨天还是今天time->指定时间戳
    utl.compareDay = function(time){
        var _now  = new Date().getTime();//当前时间戳
        var _nowYear = new Date().getFullYear();//当前年份
        var _nowMonth = new Date().getMonth()+1;//当前月份
        var _nowDay = new Date().getDate();//指定天

        var _year = new Date(time).getFullYear();//指定年份
        var _month = new Date(time).getMonth()+1;//指定月份
        var _day = new Date(time).getDate();//指定天

        if(_nowYear==_year&&_nowMonth==_month&&_nowDay==_day){//同一天
            return '今天';
        }else if(_nowYear==_year&&_nowMonth==_month&&_nowDay-1==_day){
            return '昨天';
        }else{
            var m =  _month>10?_month:'0'+_month;
            var d = _day>10?_day:'0'+_day;
            return m+'-'+d;
        }
    };
    utl.formatTime = function(){
        Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
    };
    //根据时间戳得到日期是今天或昨天
    utl.getDate = function(time){
        var d = this.compareDay(time);
        var hour = new Date(time).getHours();//得到小时
        var minute = new Date(time).getMinutes();//得到分钟
        var second = new Date(time).getSeconds();//得到秒数
        return{
            date:d,
            time:(hour+1 >10 ? hour :'0' + hour)
            + ":" + (minute+1 > 10 ? minute : '0' + minute)
            + ":" + (second+1 > 10 ? second :'0'+ second)
        }
    };
    //得到现在到未来某个时间点的倒计时
    utl.getCountDown = function(future){
        var now = new Date().getTime();
        var nextStatus = future
        var nextStatusText = (nextStatus-now)/1000;
        //console.log(nextStatusText);
        var days=Math.floor(nextStatusText/3600/24);
        var hours=Math.floor((nextStatusText-days*24*3600)/3600);
        var mins=Math.floor((nextStatusText-days*24*3600-hours*3600)/60);
        var secs=Math.floor((nextStatusText-days*24*3600-hours*3600-mins*60));

        //console.log(days,hours,mins,secs);
        if(hours<=0){
            hours = 0;
        }
        if(mins<=0){
            mins = 0;
        }
        if(secs<=0){
            secs = 0;
        }
        //var time = hours+"小时"+mins+"分钟"+secs+"秒";
        var time = hours+":"+mins+":"+secs;
        return time;
    };
    //得到某个范围内随机整数
    utl.getRandInt = function(n,m){
        var c = m-n+1;
        return Math.floor(Math.random() * c + n);
    };
    //得到当前土地的种植详情->有则返回种植详情否者返回false
    utl.getCurPlantDetail = function(pdId,allDetails){//传入当前土地pdId和全部种植详情
        //cc.log(pdId,allDetails);
        var curDetails = null;
        for(var i = 0;i<allDetails.length;i++){
            if(allDetails[i].id==pdId){
                curDetails = allDetails[i];
                break;
            }
        }
        return curDetails;
    };
    //通过当前土地id的到到当前土地pdId
    /**
    @param landId->当前土地id
    @param landArr->当前土地了列表
    */
    utl.getPdIdByLandId = function(landId,landArr){
        let pdId = 0;
        for(let i = 0;i<landArr.length;i++){
            if(landId==landArr[i].id){
                pdId = landArr[i].pdId;
                break;
            }
        }
        return pdId;
    };
    //通过wood_id得到玩家仓库中的对应木材数量
    //有则返回对应数量，没有就返回0
    utl.getCntByWoodId = function(woodList,id){
        var num = 0;
        for(var i = 0;i<woodList.length;i++){
            if(id==woodList[i].itemTypeId){
                num = woodList[i].cnt;
                break;
            }
        }
        return num;
    };
    //组合市场中的商品列表
    utl.assemMarketList = function(obj){
        var newArr = [];
        for(var item in obj){
            newArr.push(obj[item]);
        }
        return newArr;
    };
    //通过植物的下一次状态时间定时触发任务
    /**
     @param now->现在时间;
     @param future->下一个状态的时间;
     @param task->需要执行的函数;
     */
        //后台会给倒计时时间 未来时间减去现在时间()
    utl.updateStatusByNextStatusTime = function(now,future,task){
        //后台传递数据有问题 暂不解决
        var now = now||new Date().getTime();
        var future = future||new Date().getTime();
        if(now>=future) return;
        var time = future-now+1000;
        var timeOut = setTimeout(()=>{
            //alert(1);
            task();
            //alert(2);
        },time)
    };
    //倒计时更新工厂
    utl.updateFacTimeout = function(time,task){
        var timeOut = setTimeout(()=>{
            task();
        },time)
    };
    //得到一个Obj[]中所有的nextStsTime并压入数组
    /**
     * @arrList ->所有种植详情
     * */
    utl.getNextStsTimeFromArr = function(arrList){
        var arr = [];
        if(arrList.length>0){
            for(let i = 0;i<arrList.length;i++){
                if(arrList[i].nextStsTime){
                    arr.push(arrList[i].nextStsTime);
                }
            }
        };
        return arr;
    };
    //得到一个数组中所有大于某一个值的数值
    utl.getAllThatThanParam = function(param,arr){
        var arr = arr||[new Date().getTime()];
        var param = param||new Date().getTime();
        var newArr = [];
        if(arr.length>0){
            for(let i = 0;i<arr.length;i++){
                if(arr[i]>param){
                    newArr.push(arr[i]);
                }
            }
            if(newArr.length<1){
                return [new Date().getTime()];
            }
            return newArr;
        }
        return [new Date().getTime()];
    };
    //得到数组中最小的数
    utl.getMinFromArr = function(arr){
        if(arr.length>0){
           return Math.min(...arr);
           //Math.min.apply(null,arr);
        }
        return new Date().getTime();
    };

    //手机号正则
    utl.mobileReg = /^1[3-9][\d]{9}$/;
    //验证手机号码
    utl.regMobile = function(mobile){
        return this.mobileReg.test(mobile);
    };
    //拆分字符串
    utl.splitStr = function(str){
        return str.split('_')[1];
    };

    /*工厂*/
    // 根据工厂类型返回相对应的绿能类型
    utl.getGreenTypeByFacType = (type)=>{
        switch (type){
            case "1":
                return '柳树';
                break;
            case "2":
                return '松树';
                break;
            case "3":
                return '槐树';
                break;
            case "4":
                return '梧桐';
                break;
            case "5":
                return '杉树';
                break;
            case "6":
                return '银杏';
                break;
            default:
                break;
        }
    };
    utl.getGreenTypeByTree = (type)=>{
        switch (type){
            case "1":
                return '柳树林';
                break;
            case "2":
                return '松树林';
                break;
            case "3":
                return '槐树林';
                break;
            case "4":
                return '梧桐树林';
                break;
            case "5":
                return '杉树林';
                break;
            case "6":
                return '银杏树林';
                break;
            default:
                break;
        }
    };
    //根据工厂种类获取对应得绿能的数量
    /**
    * @type 工厂类型
     * @greenList 仓库绿能列表
    * */
    utl.getGreenAmtByFactype = (type,greenList)=>{
      for(let i = 0;i<greenList.length;i++ ){
          let id = (greenList[i].itemTypeId-4000);
          if(type==id){
              return greenList[i].cnt;
              break;
          }
      };
      return 0;
    };
    //得到种植详情里的所有绿能
    /**
    * @pdId 种植详情id
    * @greenList loadPlayer里的所有绿能
    * */
    utl.getPlantDetailGreen = function(pdId,greenList){
      let newGreenList = [];
      for(let i = 0;i<greenList.length;i++){
          if(greenList[i].pdId==pdId){
              newGreenList.push(greenList[i]);
          }
      };
      return newGreenList;
    };
    //通过树的状态值返回状态文本
    utl.getDescBystatus = function(status){
        if(status==0){
            return "种植期";
        }else if(status==1){
            return "成长期";
        }else if(status==2){
            return "成熟期";
        }else if(status==3){
            return "枯萎期";
        }
    };
    //听过灾害类型得到灾害文本
    utl.getDescByDis = function(dis){
        if(dis==0){
            return "健康";
        }else if(dis==1){
            return "虫灾";
        }else if(dis==2){
            return "草灾";
        }else if(dis==3){
            return "旱灾";
        }
    };
    //赠送选择绿能列表 绿能数据格式化
    utl.formatGiveGreenData = function(greenList){
        let temp = [
            {
                cnt:null,
                id:null,
                pId:4001,
                pName:null
            },
            {
                cnt:null,
                id:null,
                pId:4002,
                pName:null
            },
            {
                cnt:null,
                id:null,
                pId:4003,
                pName:null
            },
            {
                cnt:null,
                id:null,
                pId:4004,
                pName:null
            },
            {
                cnt:null,
                id:null,
                pId:4005,
                pName:null
            },
            {
                cnt:null,
                id:null,
                pId:4006,
                pName:null
            },
        ];
        for(let i = 0;i<greenList.length;i++){
            for(let k = 0;k<temp.length;k++){
                if(greenList[i].itemTypeId==temp[k].pId){
                    temp[k].cnt = greenList[i].cnt;
                    temp[k].id = greenList[i].itemTypeId;
                    temp[k].pName = greenList[i].name;
                }
            }
        }
        return temp;
    };
    //往市场跳转的方法
    /*
     * token token
     * link 需要跳转的页面链接
     * id商品的id  绿能id
     * */
    utl.toAppMarket = function(link,id){
        id = id || null;
        let token = cc.sys.localStorage.getItem('token');
        token = encodeURI(token);
        let para = "token="+token+"&link="+link;
        if(id){
            para+="&id="+id;
        }

        let isNative = cc.sys.isNative;
        console.log(isNative);
        //androis跳转
        if(isNative&&cc.sys.os == "Android"){
            jsb.reflection.callStaticMethod(
                "org/cocos2dx/javascript/AppActivity",
                "toMarketApp",
                "(Ljava/lang/String;)V",
                para
            );
        }
        //ios端跳转
        if(isNative&&cc.sys.os == "iOS"){
            jsb.reflection.callStaticMethod(
                "CallbackByJS",//类名
                "callAppWithJS:",//方法名
                para//参数
            );
        }
        //如果不是native端 直接浏览器跳转
        if(!isNative){
            cc.sys.openURL(Global.marketDomain+"/html/skip-page.html?"+para);
        }
    };
    utl.getQueryString = function(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return unescape(r[2]);
        return null;
    };
    //ApplePay
    /***
     * @para 银联后台流水号
     */
    utl.applePay = function(para){
        let isNative = cc.sys.isNative;
        if(isNative&&cc.sys.os == "iOS"){
            jsb.reflection.callStaticMethod(
                "ApplePayByJS",//类名
                "ApplePayWithJS:",//方法名
                para//参数
            );
        }
    };

    return new util;
})(Util);

module.exports = Util;
