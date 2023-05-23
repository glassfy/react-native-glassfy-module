#import "GlassfyModule.h"
#import <GlassfyGlue/GlassfyGlue.h>
#import <Glassfy/Glassfy.h>
#import "GlassfyPaywall.h"

static NSString *const kDidPurchaseProduct = @"gy_did_purchase_product";
static NSString *const kPaywallEvent = @"paywallEvent";

@interface GlassfyModule () <GlassfyGluePurchaseDelegate>
@property (nullable, nonatomic, strong) UIViewController *paywallViewController;
@property (nullable, nonatomic, strong) ReactPaywallListener *paywallListener;
@end

@implementation GlassfyModule

RCT_EXPORT_MODULE()

RCT_REMAP_METHOD(sdkVersion, sdkVersionWithResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject) {
    
    [GlassfyGlue
     sdkVersionWithCompletion:[self
                               responseFromGlassfyGluewithResolver:resolve
                               withRejecter:reject]];
}

RCT_REMAP_METHOD(
                 initialize,
                 initializeWithApiKey: (NSString*)apiKey
                 watcherMode: (BOOL)watcherMode
                 version: (NSString*)version
                 withResolver: (RCTPromiseResolveBlock)resolve
                 withRejecter: (RCTPromiseRejectBlock)reject
                 ) {
    [GlassfyGlue initializeWithApiKey: apiKey
                          watcherMode: watcherMode
            crossPlatformSdkFramework: @"react-native"
              crossPlatformSdkVersion: version
                       withCompletion:[self responseFromGlassfyGluewithResolver: resolve
                                                                   withRejecter: reject]];
}

RCT_REMAP_METHOD(setLogLevel, setLogLevel
                 : (int)logLevel withResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject) {
    
    [GlassfyGlue setLogLevel:logLevel];
    resolve(nil);
}

RCT_REMAP_METHOD(presentAppStoreCodeRedemptionSheet,
                 presentAppStoreCodeRedemptionSheetwithResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject) {
    
    if (@available(iOS 14, *)) {
        [[SKPaymentQueue defaultQueue] presentCodeRedemptionSheet];
    }
    resolve(nil);
}

RCT_REMAP_METHOD(offerings, offeringsWithResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject) {
    
    [GlassfyGlue
     offeringsWithCompletion:[self
                              responseFromGlassfyGluewithResolver:resolve
                              withRejecter:reject]];
}

RCT_REMAP_METHOD(purchaseHistory, purchaseHistoryWithResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject) {
    
    [GlassfyGlue
     purchaseHistoryWithCompletion:[self
                                    responseFromGlassfyGluewithResolver:resolve
                                    withRejecter:reject]];
}

RCT_REMAP_METHOD(permissions, permissionsWithResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject) {
    
    [GlassfyGlue permissionsWithCompletion:
     [self responseFromGlassfyGluewithResolver:resolve
                                  withRejecter:reject]];
}

RCT_REMAP_METHOD(skuWithId, skuWithId
                 : (NSString *)identifier withResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject) {
    
    [GlassfyGlue skuWithId:identifier
            withCompletion:[self responseFromGlassfyGluewithResolver:resolve
                                                        withRejecter:reject]];
}

RCT_REMAP_METHOD(skuWithIdAndStore, skuWithIdAndStore
                 : (NSString *)identifier store
                 : (int)store withResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject) {
    
    [GlassfyGlue skuWithId:identifier
                     store:store
                completion:[self responseFromGlassfyGluewithResolver:resolve
                                                        withRejecter:reject]];
}

RCT_REMAP_METHOD(purchaseSku, purchaseSku
                 : (NSDictionary *)sku withResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject) {
    [GlassfyGlue purchaseSku:sku
              withCompletion:[self responseFromGlassfyGluewithResolver:resolve
                                                          withRejecter:reject]];
}

RCT_REMAP_METHOD(restorePurchases, restorePurchasesWithResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject) {
    [GlassfyGlue restorePurchasesWithCompletion:
     [self responseFromGlassfyGluewithResolver:resolve
                                  withRejecter:reject]];
}

RCT_REMAP_METHOD(setDeviceToken, setDeviceToken
                 : (NSString *)token withResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject) {
    [GlassfyGlue
     setDeviceToken:token
     withCompletion:[self responseFromGlassfyGluewithResolver:resolve
                                                 withRejecter:reject]];
}

RCT_REMAP_METHOD(setEmailUserProperty, setEmailUserProperty
                 : (NSString *_Nonnull)email withResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject) {
    [GlassfyGlue
     setEmailUserProperty:email
     withCompletion:[self responseFromGlassfyGluewithResolver:resolve
                                                 withRejecter:reject]];
}

RCT_REMAP_METHOD(setExtraUserProperty, setExtraUserProperty
                 : (NSDictionary *_Nonnull)extraProp withResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject) {
    [GlassfyGlue
     setExtraUserProperty:extraProp
     withCompletion:[self responseFromGlassfyGluewithResolver:resolve
                                                 withRejecter:reject]];
}

RCT_REMAP_METHOD(getUserProperties, getUserPropertiesWithResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject) {
    [GlassfyGlue getExtraUserPropertyWithCompletion:
     [self responseFromGlassfyGluewithResolver:resolve
                                  withRejecter:reject]];
}

RCT_REMAP_METHOD(connectPaddleLicenseKey, connectPaddleLicenseKey
                 : (NSString *)licenseKey force
                 : (int)force withResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject) {
    [GlassfyGlue
     connectPaddleLicenseKey:licenseKey
     force:force
     completion:[self
                 responseFromGlassfyGluewithResolver:resolve
                 withRejecter:reject]];
}

RCT_REMAP_METHOD(connectGlassfyUniversalCode, connectGlassfyUniversalCode
                 : (NSString *)licenseKey force
                 : (int)force withResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject) {
    [GlassfyGlue
     connectGlassfyUniversalCode:licenseKey
     force:force
     completion:[self
                 responseFromGlassfyGluewithResolver:resolve
                 withRejecter:reject]];
}

RCT_REMAP_METHOD(connectCustomSubscriber, connectCustomSubscriber
                 : (NSString *)subscriberId withResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject) {
    
    [GlassfyGlue
     connectCustomSubscriber:subscriberId
     completion:[self
                 responseFromGlassfyGluewithResolver:resolve
                 withRejecter:reject]];
}

RCT_REMAP_METHOD(storeInfo, storeInfoWithResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject) {
    
    [GlassfyGlue storeInfo:[self responseFromGlassfyGluewithResolver:resolve
                                                        withRejecter:reject]];
}

RCT_EXPORT_METHOD(subscribeOnPurchaseDelegate) {
    [GlassfyGlue setPurchaseDelegate:self];
}

RCT_REMAP_METHOD(setAttribution, setAttribution
                 : (int )type value
                 : (NSString*)value withResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject)  {
    
    [GlassfyGlue setAttributionType:@(type) value:value  completion:[self
                                                                     responseFromGlassfyGluewithResolver:resolve
                                                                     withRejecter:reject]];
}

RCT_REMAP_METHOD(setAttributions, setAttributions
                 : (NSArray*)items withResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject)  {
    
    [GlassfyGlue setAttributions:items completion:[self
                                                   responseFromGlassfyGluewithResolver:resolve
                                                   withRejecter:reject]];
}

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
                 : (NSString*)remoteConfig withResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject)  {
    [Glassfy paywallViewControllerWithId:remoteConfig completion:^(GYPaywallViewController * _Nullable viewController, NSError * _Nullable error) {
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
