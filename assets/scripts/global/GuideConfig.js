//游戏引导配置
const GuideConfig = [
    {
        step:1,
        pos:cc.v2(239, -49),//手指位置
        pPos:cc.v2(-211, 88),//人位置
        bPos:cc.v2(13, 9),//黑板位置
        tPos:cc.v2(85,-6),//文字位置
        text:"嗨,你好！我就是那个叱咤风云,手下工厂无数,日进斗金的马有才！"//黑板文字
    },
    {
        step:2,
        pos:cc.v2(50, 50),
        pPos:cc.v2(-216, 65),//人位置
        tPos:cc.v2(85,-6),//文字位置
        text:"你好！马先生,你的工厂污染已经严重超标，对环境损害严重，根据有关环境保护条例，现在将禁止你的工厂继续生产！"//黑板文字
    },
    {
        step:3,
        pos:cc.v2(-183, -93),
        pPos:cc.v2(248, 95),//人位置
        tPos:cc.v2(-74,-4),//文字位置
        text:"哎，污染环境确实是不对的，但工厂是我重要的资金来源啊。我该怎么才能继续生产啊？"
    },
    {
        step:4,
        pos:cc.v2(-183, -93),
        pPos:cc.v2(211, 70),//人位置
        tPos:cc.v2(-74,-4),//文字位置
        text:"如果你还想继续经营，根据环保条例我们要求你必须种树来抵消工厂造成的污染！"
    },
    {
        step:5,
        pos:cc.v2(133, -56),
        text:"恭喜你获得新手树苗*1，赶紧去绿化吧。"
    },
    {
        step:6,
        pos:cc.v2(172, -201),
        tPicPos:cc.v2(183,-92),//提示文字图片位置
    },
    {
        step:7,
        pos:cc.v2(-123, -494),
        tPicPos:cc.v2(-127,-380)
    },
    {
        step:8,
        pos:cc.v2(166, 269),
        tPicPos:cc.v2(156,403)
    },
    {
        step:9,
        pos:cc.v2(-117, -321),
        tPicPos:cc.v2(-116,-189)
    },
    {
        step:10,
        pos:cc.v2(29, 225),
        tPicPos:cc.v2(39,324),
    },
    {
        step:11,
        pos:cc.v2(-248, 496),
        pPos:cc.v2(-210, 87),//人位置
        bPos:cc.v2(13, 9),//黑板位置
        tPos:cc.v2(91,-4),//文字位置
        text:"哈哈哈~这下终于有绿能了！工厂又能继续生产了。快点击帮我治理工厂污染吧！",//黑板文字
        //tPicPos:cc.v2(-116,-189),

    },
    {
        step:12,
        pos:cc.v2(164, -382),
        tPicPos:cc.v2(162,-242),
    },
    {
        step:13,
        pos:cc.v2(191, 266),
        tPicPos:cc.v2(177,376)
    },
    {
        step:14,
        pos:cc.v2(0, -524),
        tPicPos:cc.v2(8,-396)
    },
    {
        step:15,
        pos:cc.v2(12, -102),
        tPicPos:cc.v2(5,24)
    },
    {
        step:16,
        pos:cc.v2(-25, -77),
        pPos:cc.v2(238,91),
        bPos:cc.v2(13,9),
        tPos:cc.v2(-75,-4),
        text:'哇，快看！工厂产出了10个金币！告诉你个小秘密，购买树苗可获得种树基金参与Z计划。'
    },
    {
        step:17,
        pos:cc.v2(245, -505),
        pPos:cc.v2(228, 95),//人位置
        tPicPos:cc.v2(216,-399),
        tPos:cc.v2(-68,-4),
        text:'进入用户中心完善资料进行提现，可获得一元奖励!'
    },
    {
        step:18,
    }
];
module.exports = GuideConfig;