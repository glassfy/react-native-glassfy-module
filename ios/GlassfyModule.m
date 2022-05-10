#import "GlassfyModule.h"
#import <GlassfyGlue/GlassfyGlue.h>

@implementation GlassfyModule

RCT_EXPORT_MODULE()

// Example method
// See // https://reactnative.dev/docs/native-modules-ios
RCT_REMAP_METHOD(multiply,
                 multiplyWithA:(nonnull NSNumber*)a withB:(nonnull NSNumber*)b
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
  NSNumber *result = @([a floatValue] * [b floatValue]);

  resolve(result);
}

RCT_REMAP_METHOD(sdkVersion,
                 sdkVersionWithResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{

    [GlassfyGlue sdkVersionWithCompletion:[self responseFromGlassfyGluewithResolver:resolve withRejecter:reject]];
}

RCT_EXPORT_METHOD(initializeWithApiKey:(NSString *)apiKey
                  watcherMode:(BOOL)watcherMode
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject) {
    
    [GlassfyGlue initializeWithApiKey:apiKey
                          watcherMode:watcherMode
                       withCompletion:[self responseFromGlassfyGluewithResolver:resolve withRejecter:reject]];
}


RCT_REMAP_METHOD(offerings,
                 offeringsWithResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{

    [GlassfyGlue offeringsWithCompletion:[self responseFromGlassfyGluewithResolver:resolve withRejecter:reject]];
}

RCT_REMAP_METHOD(skuWithId,
                 skuWithId:(NSString*)identifier
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{

    
    [GlassfyGlue skuWithId:identifier withCompletion:[self responseFromGlassfyGluewithResolver:resolve withRejecter:reject]];
}

RCT_REMAP_METHOD(login,
                 login:(NSString*)userId
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    [GlassfyGlue loginUser:userId withCompletion:[self responseFromGlassfyGluewithResolver:resolve withRejecter:reject]];
}

RCT_REMAP_METHOD(logout,
                 logoutWithResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    [GlassfyGlue logoutUserWithCompletion:[self responseFromGlassfyGluewithResolver:resolve withRejecter:reject]];
}


RCT_REMAP_METHOD(purchaseSku,
                 purchaseSku:(NSDictionary*)sku
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    [GlassfyGlue purchaseSku:sku withCompletion:[self responseFromGlassfyGluewithResolver:resolve withRejecter:reject]];
}

RCT_REMAP_METHOD(restorePurchases,
                 restorePurchasesWithResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    [GlassfyGlue restorePurchasesWithCompletion:[self responseFromGlassfyGluewithResolver:resolve withRejecter:reject]];
}


- (void (^)(NSDictionary *, NSError *))responseFromGlassfyGluewithResolver:(RCTPromiseResolveBlock)resolve
                                                              withRejecter:(RCTPromiseRejectBlock)reject {
    return ^(NSDictionary *_Nullable responseDictionary, NSError *_Nullable error) {
        if ( error != nil ) {
            reject([@(error.code) stringValue],error.localizedDescription,error);
            return;
        }
        resolve(responseDictionary);
    };
}


@end
