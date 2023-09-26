#import <Foundation/Foundation.h>
#import <Glassfy/Glassfy.h>
#import <GlassfyGlue/GlassfyGlue.h>

@interface ReactPaywallListener : NSObject
@property (nonatomic, copy) void (^sendEvent)(NSString *, NSDictionary *);
@property (nonatomic, strong) NSString *eventName;

- (instancetype)initWithSendEvent:(void (^)(NSString *, NSDictionary *))sendEvent;
- (void)onCloseWithTransaction:(GYTransaction *)transaction error:(NSError *)error;
- (void)onLinkWithURL:(NSURL *)url;
- (void)onRestore;
- (void)onPurchaseWithSKU:(GYSku *)sku;
@end
