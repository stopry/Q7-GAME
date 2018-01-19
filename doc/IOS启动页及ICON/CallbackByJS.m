//
//  CallbackByJS.m
//  ZHome-mobile
//
//  Created by 刘贤 on 2018/1/5.
//

#import <Foundation/Foundation.h>
#import "CallbackByJS.h"


@implementation CallbackByJS : NSObject

+(BOOL) callAppWithJS:(NSString *) para{
    NSURL *fansPageUrl;
    if([CallbackByJS isInstagramInstalled]){
        NSLog(@"已安装应用");
        fansPageUrl = [NSURL URLWithString:[NSString stringWithFormat:@"vip.senchen.market://%@",para]];
    }else{
        NSLog(@"未安装应用");
        fansPageUrl = [NSURL URLWithString:[NSString stringWithFormat:@"http://www.senchen.vip"]];
    }
    [[UIApplication sharedApplication] openURL:fansPageUrl];
    return true;
}

//判断本机是否安装有vip.senchen.market这个APP
+(BOOL) isInstagramInstalled
{
    NSURL *instagramURL = [NSURL URLWithString:@"vip.senchen.market:"];
    return [[UIApplication sharedApplication] canOpenURL:instagramURL];
}
@end

