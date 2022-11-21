import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

export enum GLASSFY_ELEGGIBILITY {
  ELEGIBLE = 1,
  NON_ELEGIBLE = -1,
  UNKNOWN = 0,
}

export enum GLASSFY_STORE {
  AppStore = 1,
  PlayStore = 2,
  Paddle = 3,
}
export enum GLASSFY_LOGLEVEL {
  OFF = 0,
  ERROR = 1,
  DEBUG = 2,
  INFO = 3,
  ALL = 3,
}

export enum GLASSFY_ENTITLEMENT {
  NEVERBUY = -9,
  // The customer received a refund for the subscription.
  OTHERREFUND = -8,
  // The customer received a refund due to a perceived issue with the app.
  ISSUEREFUND = -7,
  // The system canceled the subscription because the customer upgraded.
  UPGRADED = -6,
  // The customer intentionally cancelled the subscription.
  EXPIREDVOLUNTARY = -5,
  // The product is no longer available.
  PRODUCTNOTAVAILABLE = -4,
  // The customer did not accept the price increase.
  FAILTOACCEPTINCREASE = -3,
  // The receipt is fully expired due to a billing issue.
  EXPIREDFROMBILLING = -2,
  // The receipt is expired but the subscription is still in a billing-retry state.
  // If grace period is enabled this state excludes subscriptions in grace period.
  INRETRY = -1,
  // The receipt is out of date or there is another purchase issue.
  MISSINGINFO = 0,
  // The subscription expired but is in grace period.
  EXPIREDINGRACE = 1,
  // The subscription is an off-platform subscription.
  OFFPLATFORM = 2,
  // The subscription is a non-renewing subscription.
  NONRENEWING = 3,
  // The subscription is active and auto-renew is off.
  AUTORENEWOFF = 4,
  // The subscription is active and auto-renew is on.
  AUTORENEWON = 5,
}

export interface GlassfyProductDiscount {
  readonly price: number;
  readonly period: string;
  readonly numberOfPeriods: number;
  readonly type: string;
}

export interface GlassfyProduct {
  readonly description: string;
  readonly currencyCode: string;
  readonly price: number;
  readonly introductoryPrice: GlassfyProductDiscount;
  readonly discounts: GlassfyProductDiscount[];
}

export interface GlassfySkuBase {
  readonly skuId: string;
  readonly productId: string;
  readonly store: GLASSFY_STORE;
}
export interface GlassfySku extends GlassfySkuBase {
  readonly introductoryEligibility: GLASSFY_ELEGGIBILITY;
  readonly promotionalEligibility: GLASSFY_ELEGGIBILITY;
  readonly extravars: { [key: string]: string };
  readonly product: GlassfyProduct;
}

export interface GlassfySkuPaddle extends GlassfySkuBase {
  readonly name: string;
  readonly initialPrice: number;
  readonly initialPriceCode: string;
  readonly recurringPrice: number;
  readonly recurringPriceCode: string;
  readonly extravars: { [key: string]: string };
}

export interface GlassfyAccountableSku extends GlassfySkuBase {
  readonly isInIntroOfferPeriod: boolean;
  readonly isInTrialPeriod: boolean;
}

export interface GlassfyOffering {
  readonly offeringId: string;
  readonly skus: GlassfySku[];
}

export interface GlassfyOfferings {
  readonly all: GlassfyOffering[];
}
export interface GlassfyPermission {
  readonly permissionId: string;
  readonly entitlement: GLASSFY_ENTITLEMENT;
  readonly isValid: boolean;
  readonly expireDate: string;
  readonly accountableSkus: GlassfyAccountableSku[];
}

export interface GlassfyPermissions {
  readonly installationId: string;
  readonly subscriberId: string;
  readonly originalApplicationVersion: string;
  readonly originalApplicationDate: string;
  readonly all: GlassfyPermission[];
}

export interface GlassfyTransaction {
  readonly productIdentifier: String;
  readonly receiptValidated: boolean;
  readonly permissions: GlassfyPermissions;
}
export interface GlassfyUserProperties {
  readonly email: String;
  readonly token: boolean;
  readonly extra: GlassfyExtraProperty;
}

export type GlassfyExtraProperty = { [key: string]: string };

export interface GlassfyPurchaseDelegate {
  didPurchaseProduct(transaction: GlassfyTransaction): void;
}

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

export function multiply(a: number, b: number): Promise<number> {
  return GlassfyModule.multiply(a, b);
}

export interface GlassfyVersion {
  readonly version: string;
}

export class Glassfy {
  public static async sdkVersion(): Promise<GlassfyVersion> {
    return GlassfyModule.sdkVersion();
  }
  public static async initialize(
    apiKey: string,
    watcherMode: boolean
  ): Promise<void> {
    return GlassfyModule.initialize(apiKey, watcherMode);
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

  public static async permissions(): Promise<GlassfyPermissions> {
    return GlassfyModule.permissions();
  }
  public static async skuWithId(identifier: string): Promise<GlassfySku> {
    let sku = GlassfyModule.skuWithId(identifier);
    return sku;
  }

  public static async skuWithIdAndStore(
    identifier: string,
    store: GLASSFY_STORE
  ): Promise<GlassfySkuBase> {
    let sku = GlassfyModule.skuWithIdAndStore(identifier, store);
    return sku;
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

  public static async setEmailUserProperty(email: string): Promise<GlassfySku> {
    let sku = GlassfyModule.setEmailUserProperty(email);
    return sku;
  }
  public static async setExtraUserProperty(
    extraProp: GlassfyExtraProperty
  ): Promise<void> {
    return GlassfyModule.setExtraUserProperty(extraProp);
  }

  public static async getUserProperties(): Promise<GlassfyUserProperties> {
    let userProp = GlassfyModule.getUserProperties();
    return userProp;
  }

  public static async purchaseSku(
    sku: GlassfySku
  ): Promise<GlassfyTransaction> {
    return GlassfyModule.purchaseSku(sku);
  }

  public static async restorePurchases(): Promise<GlassfySku> {
    return GlassfyModule.restorePurchases();
  }

  public static setPurchaseDelegate(delegate: GlassfyPurchaseDelegate) {
    const eventEmitter = new NativeEventEmitter(GlassfyModule);
    eventEmitter.removeAllListeners(EVENT_DID_PURCHASE_PRODUCT);
    eventEmitter.addListener(EVENT_DID_PURCHASE_PRODUCT, (transaction) => {
      delegate.didPurchaseProduct(transaction);
    });
    GlassfyModule.subscribeOnPurchaseDelegate();
  }
}
