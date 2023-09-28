import { GlassfyTransaction } from 'react-native-glassfy-module';

export interface GlassfyPurchaseDelegate {
  didPurchaseProduct(transaction: GlassfyTransaction): void;
}
