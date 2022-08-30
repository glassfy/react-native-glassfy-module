import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import {
  Glassfy,
  GlassfyExtraProperty,
  GLASSFY_LOGLEVEL,
} from 'react-native-glassfy-module';

async function getGlassfy() {
  try {
    await Glassfy.initialize('50af3c1afb6f473bbaf1ad0d5fb19b41', false);
    console.log('pre connectCustomSubscriber++++');

    // set custom identifier (optional)
    await Glassfy.connectCustomSubscriber('my_custom_identifier');

    // set user email (optional)
    await Glassfy.setEmailUserProperty('my@email.com');

    const extraProp: GlassfyExtraProperty = {
      lastactivity: 'Bike',
      usage_count: '3',
    };
    console.log('pre setExtraUserProperty++++');

    await Glassfy.setExtraUserProperty(extraProp);

    // connect a paddle license key
    await Glassfy.connectPaddleLicenseKey('89bf4c748e4a45e5829e6ee6', true);

    // get subscriber current subscriptions
    let permissions = await Glassfy.permissions();
    console.log(JSON.stringify(permissions, null, 3));

    // fetch 'subscription_articles' offering
    let offerings = await Glassfy.offerings();
    console.log(JSON.stringify(offerings, null, 3));

    const offering = offerings.all.find(
      (o) => o.offeringId === 'subscription_articles'
    );

    const sku = offering?.skus[0];
    console.log(JSON.stringify(sku, null, 3));

    let transaction = await Glassfy.purchaseSku(sku!);
    console.log(JSON.stringify(transaction, null, 3));
  } catch (e: any) {
    console.log('##############################################');
    console.error(e);
    console.log('##############################################');
  }
}

export default function App() {
  // const [result, setResult] = React.useState<number | undefined>();
  const [version] = React.useState<string | undefined>();

  getGlassfy();

  return (
    <View style={styles.container}>
      <Text>SDK Version: {version}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
