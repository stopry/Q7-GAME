//global
window.Global={
    marketDomain:"http://www.senchen.vip",//交易市场域名
    layer:null,//弹框遮罩层
    conLayer:null,//确认框遮罩层
    layerRecharge:null,//充值弹出层遮罩
    conDia:null,//确认对话框
    goodsDesc:null,//物品详细信息展示介绍
    openAction:cc.sequence(cc.scaleTo(0.1, 1.2, 1.2),cc.scaleTo(0.1, 1, 1)),//窗口打开动作
    openAudio:true,//是否打开音效
    openBgMusic:false,//是否打开背景音乐
    hasTreesProp:true,//是否有树苗
    hasWatersProp:true,//是否有甘露
    hasBugsProp:true,//是否有除虫剂
    hasGrassProp:true,//是否有除草剂
    isShowHeader:true,//是否显示头部
    /*游戏引导公共变量*/
    guideStep:1,//游戏引导当前的阶段
    cmpGuide:!1,//是否完成了新手引导
    isFirst:true,//是否第一次initGame() Game组件
    guiderPos:cc.v2(320,568),//新手引导组件的默认位置
    plantDetailDis:20,//新手引导 手指到 种植场景返回按钮的偏差
    /*游戏引导公共变量*/
    //游戏按钮功能开关
    tranActive:{
        market:'1',//市场
        users:'1',//用户中心
        exchange:'1',//兑换
        transact:'1',//交易
        listed:'1'//上市下架
    },
    //是否是从工厂返回游戏
    isBackFromFac:false,
    //是否是由推广链接打开
    isFromPromoteLink:false,
    //是否查看过新公告-公告牌
    isLookNewAno:true,
    //是否查看过新新邮件-邮件
    isLookMsg:true,
    /*Qa游戏相关*/
    Qa:{
        playAgain:false,//是否重新挑战
        playType:1,//答题类型 1v1 单人答题 其他是3v3
    }
};
