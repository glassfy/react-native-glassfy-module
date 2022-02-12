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
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{

    [GlassfyGlue sdkVersionWithCompletion:^(NSDictionary<NSString *,id> *dictionary , NSError *error ) {
        if ( error != nil ) {
            reject(@"-1111",error.localizedDescription,error);
        }
        resolve(dictionary);
    }];
}

@end
