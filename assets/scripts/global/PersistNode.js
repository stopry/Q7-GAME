//常驻节点挂载的脚本
cc.Class({
    extends: cc.Component,

    properties: {

        userData:{
            get: function () {
                return this._userData;
            },
            set: function (value) {
                this._userData = value;
            },
            type:cc.Object,
            tooltip: "常驻节点用于场景切换传参"
        },
        /*全局确认框 用来对服务器返回401做处理*/
        //确认框资源start
        conDia:{//确认对话框
            default:null,
            type:cc.Prefab
        },
        alertLayer:{//遮罩层
            default:null,
            type:cc.Prefab
        },
    },

    // use this for initialization
    onLoad: function () {
        var a = {
            name:'xiaom',
            age:'12',
            city:'hefei',
            sex:'male'
        };
        this.userData = a;
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
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
