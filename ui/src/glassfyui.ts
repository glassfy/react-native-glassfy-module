import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

import type { GlassfyPurchaseDelegate } from './models';

const EVENT_DID_PURCHASE_PRODUCT = 'gy_did_purchase_product';

const LINKING_ERROR =
  `The package 'react-native-glassfy-module' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const GlassfyUIModule = NativeModules.GlassfyUIModule ?? new Proxy(
  {},
  {
    get(): never {
      throw new Error(LINKING_ERROR);
    },
  }
);

export class GlassfyUI {
  public static setPurchaseDelegate(delegate: GlassfyPurchaseDelegate) {
    const eventEmitter = new NativeEventEmitter(GlassfyUIModule);
    eventEmitter.removeAllListeners(EVENT_DID_PURCHASE_PRODUCT);
    eventEmitter.addListener(EVENT_DID_PURCHASE_PRODUCT, (transaction) => {
      delegate.didPurchaseProduct(transaction);
    });
    GlassfyUIModule.subscribeOnPurchaseDelegate();
  }

  public static async _paywall(
    remoteConfig: String,
    preload: Boolean
  ): Promise<void> {
    await GlassfyUIModule._paywall(remoteConfig, preload);
  }

  public static async _closePaywall(): Promise<void> {
    await GlassfyUIModule._closePaywall();
  }

  public static async _openUrl(urlString: String): Promise<void> {
    await GlassfyUIModule._openUrl(urlString);
  }
}
