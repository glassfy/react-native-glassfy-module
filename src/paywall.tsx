import type { GlassfySku, GlassfyTransaction } from './models';
import { Glassfy } from './glassfy';
import { DeviceEventEmitter } from 'react-native';

export class GlassfyPaywall {
    public static async paywall(remoteConfig: String, listener: PaywallListener | null) {
        this.detachPreviousListeners();
        this.attachListener(listener);
        await Glassfy._paywall(remoteConfig);
    }

    public static async close() {
        await Glassfy._closePaywall();
    }

    private static detachPreviousListeners() {
        DeviceEventEmitter.removeAllListeners('paywallEvent');
    }

    private static attachListener(listener: PaywallListener | null) {
        const handler = GlassfyPaywall.buildHandler(listener);
        DeviceEventEmitter.addListener('paywallEvent', (event) => {
            handler(event);
        });
    }

    private static buildHandler(listener: PaywallListener | null) {
        return (payload: any) => {
            const { event, encodedData } = payload;
            const data = JSON.parse(encodedData);

            switch (event) {
                case "onClose":
                    const { transaction, error } = data;
                    GlassfyPaywall._onClose(listener, transaction, error);
                    break;
                case "onRestore":
                    GlassfyPaywall._onRestore(listener);
                    break;
                case "onLink":
                    const { url } = data;
                    GlassfyPaywall._onLink(listener, url);
                    break;
                case "onPurchase":
                    const { sku } = data;
                    GlassfyPaywall._onPurchase(listener, sku);
                    break;
                default:
                    console.log(`[GlassfyPaywall] Unhandled paywall event ${event}`);
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
        } else {
            GlassfyPaywall.close();
        }
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

    private static async _onPurchase(listener: PaywallListener | null, sku: GlassfySku) {
        if (listener && listener.onPurchase) {
            listener.onPurchase(sku);
        } else {
            try {
                const transaction = await Glassfy.purchaseSku(sku);
                GlassfyPaywall._onClose(listener, transaction, null);
            } catch (error) {
                GlassfyPaywall._onClose(listener, null, error);
            }
        }
    }

    private static async _onLink(listener: PaywallListener | null, url: String) {
        if (listener && listener.onLink) {
            listener.onLink(url);
        } else {
            await Glassfy._openUrl(url);
        }
    }
}

export interface PaywallListener {
    onClose?(transaction: GlassfyTransaction | null, error: any | null): void;
    onLink?(url: String): void;
    onRestore?(): void;
    onPurchase?(sku: GlassfySku): void;
}