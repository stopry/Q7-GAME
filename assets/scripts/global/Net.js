//网络接口
var Net = {
    api:{
        is89:!1,//是否是89服务
        //host:'http://192.168.19.89:8081',//host
        // host:'http://api.zjiayuan.com',//host
         host:'',//host
        //host:'',//host
        //host_85:'http://192.168.19.89:8085',
        // host_85:'http://api.zjiayuan.com',
         host_85:'',
        api:'/game',
        qa:'/qa',
        market:'/market'
    },
    timeOut:10000,
    //请求地址、请求头、发送数据、成功回调、失败回调
    get:function(url,header,data,succCallBack,errCallBack){//get请求
        var self = this;
        var host = self.api.host;
        //var host = 'http://101.132.109.119:9080';
        //var host = 'http://192.168.19.89:8081';//打包web版注释这行
        //var host = 'http://192.168.19.200:8081';
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            self.authVerify(xhr.responseText);
            if (xhr.readyState == 4&&(xhr.status >= 200 && xhr.status < 400)) {
                var response = JSON.parse(xhr.responseText);
                succCallBack&&succCallBack(response);
            }else{
               // errCallBack&&errCallBack();
            }
        };
        if(url=='/question/index'){//Qa接口
            host = self.api.host_85;

            url = self.api.qa+url
        }else{
            url = self.api.api+url;
        }
        //url = self.api.api+url;
        xhr.open("GET", host+url+(data?this.toUrlPar(data):''), true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding","gzip,deflate");
        }
        xhr.setRequestHeader("Content-Type","application/json;charset=utf-8");
        if(header){
            //Qa里的token
            if(header==2){
                xhr.setRequestHeader('Authorization',cc.sys.localStorage.getItem('token_qa'));
            }else{
                xhr.setRequestHeader('Authorization',cc.sys.localStorage.getItem('token'));
            }
        }
        xhr.timeout = this.timeOut;
        xhr.ontimeout = function (e) {
            errCallBack&&errCallBack();
        };
        xhr.onerror  = function () {
            errCallBack&&errCallBack();
        };
        xhr.send();
    },

    post:function(url,header,data,succCallBack,errCallBack){//post请求
        var self = this;
        var host = self.api.host;
        //var host = 'http://192.168.19.200:8081';
        //var host = 'http://101.132.109.119:9080';
        //var host = 'http://192.168.19.89:8081';
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            self.authVerify(xhr.responseText);
            if (xhr.readyState == 4&&(xhr.status >= 200 && xhr.status < 400)) {
                var response = JSON.parse(xhr.responseText);
                succCallBack&&succCallBack(response);
            }else{
                //errCallBack&&errCallBack();
            }
        };
        //url = self.api.api+url;
        let uri = "";
        //打包web版注释这段if语句
        if(self.api.is89){
            if(url=='/oauth/token'||url=='/showOverallMarket'||url=='/reg/registerNoImg'||url=='/sms/sendRegSms'||url=='/sms/sendRestLoginSms'||url=='/reg/resetLoginPwdNoImg'){
                uri = 'http://192.168.19.89:8080'+self.api.market+url
            }else{
                uri = self.api.host+self.api.api+url
            }
            if(url=='/login/userlogin'){//Qa接口
                uri = self.api.host_85+self.api.qa+url
            }
        }
        else if(url=='/oauth/token'||url=='/showOverallMarket'||url=='/reg/registerNoImg'||url=='/sms/sendRegSms'||url=='/sms/sendRestLoginSms'||url=='/reg/resetLoginPwdNoImg'){
            uri = self.api.host+self.api.market+url
        }
        else if(url=='/login/userlogin'){//Qa接口
            uri = self.api.host_85+self.api.qa+url
        }else{
            uri = self.api.host+self.api.api+url
        }
        xhr.open("POST", uri, true);
        xhr.setRequestHeader("Content-Type","application/json;charset=utf-8");
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding","gzip,deflate");
        }
        if(header){
            //xhr.setRequestHeader('Authorization','44');
            xhr.setRequestHeader('Authorization',cc.sys.localStorage.getItem('token'));
        }
        xhr.timeout = this.timeOut;
        xhr.ontimeout  = function (e) {
            errCallBack&&errCallBack();
        };
        xhr.onerror  = function () {
            errCallBack&&errCallBack();
        };
        xhr.send(JSON.stringify(data));
    },
    authVerify:function(res){
        if(res){
            if(JSON.parse(res).code=="401"){
                cc.director.getScene().getChildByName('ReqAni').active = false;
                cc.director.getScene().getChildByName('PersistNode').getComponent('PersistNode').showConDia(
                    '身份验证过期请重新登录',
                    ()=>{
                        cc.director.loadScene("LogIn")
                    },()=>{}
                );
            }
            if(JSON.parse(res).code=="402"){
                cc.director.getScene().getChildByName('ReqAni').active = false;
                cc.director.getScene().getChildByName('PersistNode').getComponent('PersistNode').showConDia(
                    JSON.parse(res).msg,
                    ()=>{
                        cc.director.loadScene("LogIn");
                    },()=>{
                        cc.director.loadScene("LogIn");
                    }
                );
            }
        }
    },
    ws:function(url,openCallBack,messageCallBack,errCallBack,closeCallBack){//WebSocket
        ws = new WebSocket(url);
        ws.onopen = function (event) {
            openCallBack&&openCallBack(event);
        };
        ws.onmessage = function (event) {
            messageCallBack&&messageCallBack(event);
        };
        ws.onerror = function (event) {
            errCallBack&&errCallBack(event);
        };
        ws.onclose = function (event) {
            closeCallBack&&closeCallBack(event);
        };
        //setTimeout(function () {//发送数据
        //    if (ws.readyState === WebSocket.OPEN) {
        //        ws.send("Hello WebSocket, I'm a text message.");
        //    }
        //    else {
        //        console.log("WebSocket instance wasn't ready...");
        //    }
        //}, 3);
    },
    //js对象字面量转化为url请求参数
    toUrlPar:function(obj) {
        var s = ""
        for (var itm in obj) {
            if (obj[itm] instanceof Array == true) {
                //是数组
                s += "&" + itm + "_count=" + obj[itm].length
                for (var i = 0; i < obj[itm].length; i++) {
                    if (obj[itm][i] instanceof Array == true) {
                        s += ergodicJson2(obj[itm][i]);
                    } else if (obj[itm][i] instanceof Object == true) {
                        s += ergodicJson2(obj[itm][i]);
                    } else {
                        s += "&" + encodeURI(obj[itm][i]) + "=" + encodeURI(obj[itm][i]);
                    }
                }
            } else if (obj[itm] instanceof Object == true) {
                //是json对象。
                s += ergodicJson2(obj[itm]);
            }
            else {
                //是简单数值
                s += "&" + encodeURI(itm) + "=" + encodeURI(obj[itm]);
            }
        }
        if(s){
            s = "?"+s.substring(1,s.length);
            return s;
        }else{
            return '';
        }

    },
};

module.exports = Net;