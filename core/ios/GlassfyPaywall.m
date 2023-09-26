#import <Foundation/Foundation.h>
#import <Glassfy/Glassfy.h>
#import <GlassfyGlue/GlassfyGlue.h>
#import <GlassfyGlue/GYSku+GGEncode.h>
#import <GlassfyGlue/GYTransaction+GGEncode.h>
#import "GlassfyPaywall.h"

@implementation ReactPaywallListener
- (instancetype)initWithSendEvent:(void (^)(NSString *, NSDictionary *))sendEvent {
    self = [super init];
    if (self) {
        _sendEvent = [sendEvent copy];
        _eventName = @"paywallEvent";
    }
    return self;
}

- (void)onCloseWithTransaction:(GYTransaction *)transaction
                         error:(NSError *)error {
    NSMutableDictionary *payload = [@{
        @"event": @"onClose"
    } mutableCopy];
    if (transaction) {
        payload[@"transaction"] = [transaction encodedDictionary];
    }
    if (error) {
        payload[@"error"] = error.localizedDescription;
    }
    self.sendEvent(@"onClose", payload);
}

- (void)onLinkWithURL:(NSURL *)url {
    NSMutableDictionary *payload = [@{
        @"event": @"onLink",
        @"url": url.absoluteString
    } mutableCopy];
    self.sendEvent(@"onLink", payload);
}

- (void)onRestore {
    NSMutableDictionary *payload = [@{
        @"event": @"onRestore"
    } mutableCopy];
    self.sendEvent(@"onRestore", payload);
}

- (void)onPurchaseWithSKU:(GYSku *)sku {
    NSMutableDictionary *payload = [@{
        @"event": @"onPurchase"
    } mutableCopy];
    if (sku) {
        payload[@"sku"] = [sku encodedDictionary];
    }
    self.sendEvent(@"onPurchase", payload);
}
@end
