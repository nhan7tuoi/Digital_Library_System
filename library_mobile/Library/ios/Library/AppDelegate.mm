// #import "AppDelegate.h"
// #import <React/RCTBundleURLProvider.h>
// #import <React/RCTRootView.h>
// #import <React/RCTLinkingManager.h>
// #import "RNAppAuthAuthorizationFlowManager.h"


// @implementation AppDelegate

// - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
// {
//   // Khởi tạo RCTBridge và RCTRootView
//   RCTBridge *bridge = [self.reactDelegate createBridgeWithDelegate:self launchOptions:launchOptions];
//   RCTRootView *rootView = [self.reactDelegate createRootViewWithBridge:bridge moduleName:@"Library" initialProperties:nil];
  
//   // Tạo cửa sổ chính của ứng dụng
//   self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
//   self.window.rootViewController = [self.reactDelegate createRootViewController];
//   self.window.rootViewController.view = rootView;
//   [self.window makeKeyAndVisible];
  
//   [super application:application didFinishLaunchingWithOptions:launchOptions];
//   return YES;
// }

// - (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
// {
// #if DEBUG
//    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@".expo/.virtual-metro-entry"];
// #else
//   return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
// #endif
// }

// - (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
// {
//   return [RCTLinkingManager application:application openURL:url options:options];
// }

// @end
#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <Firebase.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  self.moduleName = @"Library";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@".expo/.virtual-metro-entry"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL) application: (UIApplication *)application
              openURL: (NSURL *)url
              options: (NSDictionary<UIApplicationOpenURLOptionsKey, id> *) options
 {
  if ([self.authorizationFlowManagerDelegate resumeExternalUserAgentFlowWithURL:url]) {
    return YES;
   }
   return [RCTLinkingManager application:application openURL:url options:options];
 }


@end