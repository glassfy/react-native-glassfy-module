#import "GlassfyModule.h"
#import <GlassfyGlue/GlassfyGlue.h>

static NSString *const kDidPurchaseProduct = @"gy_did_purchase_product";

@interface GlassfyModule () <GlassfyGluePurchaseDelegate>
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

RCT_REMAP_METHOD(initialize, initializeWithApiKey
                 : (NSString *)apiKey watcherMode
                 : (BOOL)watcherMode withResolver
                 : (RCTPromiseResolveBlock)resolve withRejecter
                 : (RCTPromiseRejectBlock)reject) {

  [GlassfyGlue
      initializeWithApiKey:apiKey
               watcherMode:watcherMode
            withCompletion:[self responseFromGlassfyGluewithResolver:resolve
                                                        withRejecter:reject]];
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

#pragma mark - GlassfyGluePurchaseDelegate

- (void)didPurchaseProduct:(NSDictionary<NSString *, id> *)transaction {
  [self sendEventWithName:kDidPurchaseProduct body:transaction];
}

#pragma mark - Override RCTEventEmitter

- (NSArray<NSString *> *)supportedEvents {
  return @[ kDidPurchaseProduct ];
}

@end
