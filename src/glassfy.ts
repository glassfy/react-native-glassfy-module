import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import type { GLASSFY_ATTRIBUTION_TYPE, GLASSFY_LOGLEVEL, GLASSFY_STORE, GlassfyAttributionItem, GlassfyExtraProperty, GlassfyOfferings, GlassfyPermissions, GlassfyPurchaseDelegate, GlassfyPurchasesHistory, GlassfySku, GlassfySkuBase, GlassfyTransaction, GlassfyUserProperties, GlassfyVersion } from './models';

const EVENT_DID_PURCHASE_PRODUCT = 'gy_did_purchase_product';

const LINKING_ERROR =
  `The package 'react-native-glassfy-module' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const GlassfyModule = NativeModules.GlassfyModule
  ? NativeModules.GlassfyModule
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

export class Glassfy {
  public static async sdkVersion(): Promise<GlassfyVersion> {
    return GlassfyModule.sdkVersion();
  }

  public static async initialize(
    apiKey: string,
    watcherMode: boolean
  ): Promise<void> {
    const version = '1.5.0';
    return GlassfyModule.initialize(apiKey, watcherMode, version);
  }

  public static async setLogLevel(level: GLASSFY_LOGLEVEL): Promise<void> {
    return GlassfyModule.setLogLevel(level);
  }

  public static async presentAppStoreCodeRedemptionSheet(): Promise<void> {
    return GlassfyModule.presentAppStoreCodeRedemptionSheet();
  }

  public static async offerings(): Promise<GlassfyOfferings> {
    return GlassfyModule.offerings();
  }

  public static async purchaseHistory(): Promise<GlassfyPurchasesHistory> {
    return GlassfyModule.purchaseHistory();
  }

  public static async permissions(): Promise<GlassfyPermissions> {
    return GlassfyModule.permissions();
  }

  public static async skuWithId(identifier: string): Promise<GlassfySku> {
    return GlassfyModule.skuWithId(identifier);
  }

  public static async skuWithIdAndStore(
    identifier: string,
    store: GLASSFY_STORE
  ): Promise<GlassfySkuBase> {
    return GlassfyModule.skuWithIdAndStore(identifier, store);
  }

  public static async connectCustomSubscriber(
    subscriberId: string
  ): Promise<void> {
    return GlassfyModule.connectCustomSubscriber(subscriberId);
  }

  public static async connectPaddleLicenseKey(
    licenseKey: string,
    force: boolean
  ): Promise<void> {
    return GlassfyModule.connectPaddleLicenseKey(licenseKey, force ? 1 : 0);
  }

  public static async connectGlassfyUniversalCode(
    universalCode: string,
    force: boolean
  ): Promise<void> {
    return GlassfyModule.connectGlassfyUniversalCode(universalCode, force ? 1 : 0);
  }

  public static async setEmailUserProperty(email: string): Promise<void> {
    return GlassfyModule.setEmailUserProperty(email);
  }

  public static async setExtraUserProperty(
    extraProp: GlassfyExtraProperty
  ): Promise<void> {
    return GlassfyModule.setExtraUserProperty(extraProp);
  }

  public static async getUserProperties(): Promise<GlassfyUserProperties> {
    return GlassfyModule.getUserProperties();
  }

  public static async purchaseSku(
    sku: GlassfySku
  ): Promise<GlassfyTransaction> {
    return GlassfyModule.purchaseSku(sku);
  }

  public static async restorePurchases(): Promise<GlassfyPermissions> {
    return GlassfyModule.restorePurchases();
  }

  public static async setAttribution(type: GLASSFY_ATTRIBUTION_TYPE, value: string): Promise<void> {
    return GlassfyModule.setAttribution(type, value);
  }

  public static async setAttributions(items: Array<GlassfyAttributionItem>): Promise<void> {
    return GlassfyModule.setAttributions(items);
  }

  public static setPurchaseDelegate(delegate: GlassfyPurchaseDelegate) {
    const eventEmitter = new NativeEventEmitter(GlassfyModule);
    eventEmitter.removeAllListeners(EVENT_DID_PURCHASE_PRODUCT);
    eventEmitter.addListener(EVENT_DID_PURCHASE_PRODUCT, (transaction) => {
      delegate.didPurchaseProduct(transaction);
    });
    GlassfyModule.subscribeOnPurchaseDelegate();
  }
  
  public static async _paywall(remoteConfig: String, preload: Boolean): Promise<void> {
    await GlassfyModule._paywall(remoteConfig, preload);
  }
  
  public static async _closePaywall(): Promise<void> {
    await GlassfyModule._closePaywall();
  }
  
  public static async _openUrl(urlString: String): Promise<void> {
    await GlassfyModule._openUrl(urlString);
  }
}