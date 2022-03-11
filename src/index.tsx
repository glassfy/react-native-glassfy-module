import { NativeModules, Platform } from 'react-native';

export enum GLASSFY_ELEGGIBILITY {
  ELEGIBLE = 1,
  NON_ELEGIBLE = -1,
  UNKNOWN = 0,
}

export enum GLASSFY_LOGFLAG {
  FLAGERROR = 1 << 0,
  FLAGDEBUG = 1 << 1,
  FLAGINFO = 1 << 2,
}

export enum GLASSFY_LOGLEVEL {
  LOGLEVELOFF = 0,
  LOGLEVELERROR = LOGLEVELOFF | GLASSFY_LOGFLAG.FLAGERROR,
  LOGLEVELDEBUG = LOGLEVELERROR | GLASSFY_LOGFLAG.FLAGDEBUG,
  LOGLEVELINFO = LOGLEVELDEBUG | GLASSFY_LOGFLAG.FLAGINFO,
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

export interface GlassfySku {
  readonly skuId: string;
  readonly productId: string;
  readonly introductoryEligibility: GLASSFY_ELEGGIBILITY;
  readonly promotionalEligibility: GLASSFY_ELEGGIBILITY;
  readonly extravars: { [key: string]: string };
}

export interface GlassfyOffering {
  readonly identifier: string;
  readonly skus: [GlassfySku];
}

export interface GlassfyOfferings {
  readonly all: [GlassfyOffering];
}
export interface GlassfyPermission {
  readonly permissionIdentifier: string;
  readonly entitlement: GLASSFY_ENTITLEMENT;
  readonly isValid: boolean;
  readonly expireDate: string;
  readonly accountableSkus: [string];
}

export interface GlassfyPermissions {
  readonly installationId: string;
  readonly subscriberId: string;
  readonly originalApplicationVersion: string;
  readonly originalApplicationDate: string;
  readonly all: [GlassfyPermission];
}

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
    return GlassfyModule.initializeWithApiKey(apiKey, watcherMode);
  }
  public static async offerings(): Promise<GlassfyOfferings> {
    return GlassfyModule.offerings();
  }

  public static async skuWithIdentifier(
    identifier: string
  ): Promise<GlassfySku> {
    let skuobject = await GlassfyModule.skuWithIdentifier(identifier);
    console.log(skuobject);
    let sku = JSON.parse(skuobject);
    console.log(sku);
    return sku;
  }

  public static async login(userid: string): Promise<void> {
    return GlassfyModule.login(userid);
  }

  public static async logout(): Promise<void> {
    return GlassfyModule.logout();
  }

  public static async purchaseSku(sku: GlassfySku): Promise<GlassfySku> {
    return GlassfyModule.purchaseSku(sku.skuId);
  }

  public static async restorePurchases(): Promise<GlassfySku> {
    return GlassfyModule.restorePurchases();
  }
}
