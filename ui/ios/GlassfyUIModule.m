#import "GlassfyUIModule.h"
#import <GlassfyGlue/GlassfyGlue.h>
#import <Glassfy/Glassfy.h>
#import "GlassfyPaywall.h"

static NSString *const kDidPurchaseProduct = @"gy_did_purchase_product";
static NSString *const kPaywallEvent = @"paywallEvent";

@interface GlassfyUIModule () <GlassfyGluePurchaseDelegate>
@property (nullable, nonatomic, strong) UIViewController *paywallViewController;
@property (nullable, nonatomic, strong) ReactPaywallListener *paywallListener;
@end

@implementation GlassfyUIModule

RCT_EXPORT_MODULE()


- (void (^)(NSDictionary *, NSError *))
responseFromGlassfyGluewithResolver:(RCTPromiseResolveBlock)resolve
withRejecter:(RCTPromiseRejectBlock)reject {
    return ^(NSDictionary *_Nullable responseDictionary,
             NSError *_Nullable error) {
        if (error != nil) {
            reject([@(error.code) stringValue], error.localizedDescription, error);
            return;
        }
        resolve(responseDictionary);
    };
}

RCT_REMAP_METHOD(_paywall, _paywall
                 : (NSString*)remoteConfig awaitLoading
                 : (BOOL)awaitLoading withResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject)  {
    [Glassfy paywallViewControllerWithRemoteConfigurationId:remoteConfig 
                                               awaitLoading:awaitLoading 
                                               completion:^(GYPaywallViewController * _Nullable viewController, NSError * _Nullable error) {
        if (error != nil) {
            reject([@(error.code) stringValue], error.localizedDescription, error);
            return;
        }
        self.paywallViewController = viewController;
            
        self.paywallListener = [[ReactPaywallListener alloc] initWithSendEvent:^(NSString * _Nullable eventName, NSDictionary * _Nullable payload) {
            NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
            [params setObject:eventName forKey:@"event"];
            [params setObject:[self convertToJsonString:payload] forKey:@"encodedData"];                
            [self sendEventWithName:kPaywallEvent body:params];
        }];
            
        dispatch_async(dispatch_get_main_queue(), ^{
            UIViewController *rootViewController = UIApplication.sharedApplication.delegate.window.rootViewController;
            [rootViewController presentViewController:viewController animated:YES completion:nil];
        });
            
        [viewController setCloseHandler:^(GYTransaction *transaction, NSError *error) {
            [self.paywallListener onCloseWithTransaction:transaction error:error];
        }];
        [viewController setLinkHandler:^(NSURL *link) {
            [self.paywallListener onLinkWithURL:link];
        }];
        [viewController setRestoreHandler:^{
            [self.paywallListener onRestore];
        }];
        [viewController setPurchaseHandler:^(GYSku *sku) {
            [self.paywallListener onPurchaseWithSKU:sku];
        }];
            
        resolve(@{@"result": @"success"});
    }];
}

- (NSString *)convertToJsonString:(NSDictionary *)dictionary {
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dictionary options:NSJSONWritingPrettyPrinted error:&error];
    if (!jsonData) {
        return @"";
    }
    return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
}

RCT_REMAP_METHOD(_openUrl, _openUrl
                 : (NSString*)urlString withResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject)  {
    dispatch_async(dispatch_get_main_queue(), ^{
        NSURL *url = [NSURL URLWithString:urlString];
        if (url != nil) {
            [[UIApplication sharedApplication] openURL:url options:@{} completionHandler:nil];
            resolve(@{@"result": @"success"});
        } else {
            reject(@"Invalid URL", @"Invalid URL", nil);
        }
    });
}

RCT_REMAP_METHOD(_closePaywall, _closePaywallWithResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject)  {
    dispatch_async(dispatch_get_main_queue(), ^{
        if (self.paywallViewController != nil) {
            [self.paywallViewController dismissViewControllerAnimated:YES completion:nil];
        }
        resolve(@{@"result": @"success"});
    });
}

#pragma mark - GlassfyGluePurchaseDelegate

- (void)didPurchaseProduct:(NSDictionary<NSString *, id> *)transaction {
    [self sendEventWithName:kDidPurchaseProduct body:transaction];
}

#pragma mark - Override RCTEventEmitter

- (NSArray<NSString *> *)supportedEvents {
    return @[kDidPurchaseProduct, kPaywallEvent];
}

@end
