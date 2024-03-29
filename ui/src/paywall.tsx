import { GlassfyUI } from './glassfyui';
import {
  Glassfy,
  GlassfySku,
  GlassfyTransaction,
} from 'react-native-glassfy-module';

import {
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';

const PAYWALL_EVENT = 'paywallEvent';

export class GlassfyPaywall {
  static eventEmitter = new NativeEventEmitter(NativeModules.GlassfyUIModule);

  public static async paywall(
    remoteConfig: String,
    listener: PaywallListener | null,
    awaitLoading: Boolean = false
  ) {
    this.detachPreviousListeners();
    this.attachListener(listener);
    await GlassfyUI._paywall(remoteConfig, awaitLoading);
  }

  public static async close() {
    await GlassfyUI._closePaywall();
  }

  private static detachPreviousListeners() {
    DeviceEventEmitter.removeAllListeners(PAYWALL_EVENT);
    this.eventEmitter.removeAllListeners(PAYWALL_EVENT);
  }

  private static attachListener(listener: PaywallListener | null) {
    const handler = GlassfyPaywall.buildHandler(listener);
    if (Platform.OS === 'android') {
      DeviceEventEmitter.addListener(PAYWALL_EVENT, (event) => {
        handler(event);
      });
    } else {
      this.eventEmitter.addListener(PAYWALL_EVENT, (event) => {
        handler(event);
      });
    }
  }

  private static buildHandler(listener: PaywallListener | null) {
    return (payload: any) => {
      const { event, encodedData } = payload;
      const data = JSON.parse(encodedData);

      switch (event) {
        case 'onClose':
          const { transaction, error } = data;
          GlassfyPaywall._onClose(listener, transaction, error);
          break;
        case 'onRestore':
          GlassfyPaywall._onRestore(listener);
          break;
        case 'onLink':
          const { url } = data;
          GlassfyPaywall._onLink(listener, url);
          break;
        case 'onPurchase':
          const { sku } = data;
          GlassfyPaywall._onPurchase(listener, sku);
          break;
        default:
          console.log(
            `[GlassfyPaywall] Unhandled paywall event ${JSON.stringify(
              payload,
              null,
              2
            )}`
          );
          break;
      }
    };
  }

  private static async _onClose(
    listener: PaywallListener | null,
    transaction: GlassfyTransaction | null,
    error: any | null
  ) {
    if (listener && listener.onClose) {
      listener.onClose(transaction, error);
    }
    GlassfyPaywall.close();
  }

  private static async _onRestore(listener: PaywallListener | null) {
    if (listener && listener.onRestore) {
      listener.onRestore();
    } else {
      try {
        await Glassfy.restorePurchases();
        GlassfyPaywall._onClose(listener, null, null);
      } catch (error) {
        GlassfyPaywall._onClose(listener, null, error);
      }
    }
  }

  private static async _onPurchase(
    listener: PaywallListener | null,
    sku: GlassfySku
  ) {
    if (listener && listener.onPurchase) {
      listener.onPurchase(sku);
    } else {
      try {
        const transaction = await Glassfy.purchaseSku(sku);
        GlassfyPaywall._onClose(listener, transaction, null);
      } catch (error) {
        GlassfyPaywall._onClose(listener, null, error);
      }
      GlassfyPaywall.detachPreviousListeners();
      GlassfyPaywall.close();
    }
  }

  private static async _onLink(listener: PaywallListener | null, url: String) {
    if (listener && listener.onLink) {
      listener.onLink(url);
    } else {
      await GlassfyUI._openUrl(url);
    }
  }
}

export interface PaywallListener {
  onClose?(transaction: GlassfyTransaction | null, error: any | null): void;
  onLink?(url: String): void;
  onRestore?(): void;
  onPurchase?(sku: GlassfySku): void;
}
