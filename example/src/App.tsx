import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { Glassfy } from 'react-native-glassfy-module';

async function getGlassfy() {
  try {
    console.log('pre initialize +++++');

    await Glassfy.initialize(
      '8NOV6FQBHHRJ4F9N2HV0HUXOQ5LL0QA3/OBMVM0E1ZZQ77TZOQNOETSHHPQOZX6LQ',
      false
    );
    console.log('after initia++++');

    console.log('pre offerings +++++');

    let offerings = await Glassfy.offerings();
    console.log('post offerings +++++');
    console.log(offerings);
    let sku = await Glassfy.skuWithIdentifier('monthly_article_subscription');
    console.log(sku);
    console.log('pre purchase +++++');
    await Glassfy.purchaseSku(sku);
    console.log('post purchase +++++');
  } catch (e) {
    console.log('##############################################');
    console.log(e);
    console.log('##############################################');
  }
}

export default function App() {
  // const [result, setResult] = React.useState<number | undefined>();
  const [version, setVersion] = React.useState<string | undefined>();

  // Glassfy.sdkVersion().then((v) => {
  //   console.log('+++++++++++++');
  //   console.log(v);
  //   setVersion(v.version);
  // });

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
