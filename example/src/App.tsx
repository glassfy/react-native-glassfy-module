import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { Glassfy } from 'react-native-glassfy-module';

async function getGlassfy() {
  try {
    console.log('+++++');

    await Glassfy.initialize('3410b08907ce4772a2825f1a71b3c0c0', false);
    console.log('after initia+++++');

    console.log('pre offerings +++++');

    let offerings = await Glassfy.offerings();
    console.log('post offerings +++++');
    console.log(offerings);
    let sku = await Glassfy.skuWithIdentifier(
      'newsreader_premium_weekly_3.99_7days_0'
    );
    console.log(sku);
  } catch (e) {
    console.log('##############################################');
    console.log(e);
    console.log('##############################################');
  }
}

export default function App() {
  // const [result, setResult] = React.useState<number | undefined>();
  const [version, setVersion] = React.useState<string | undefined>();

  Glassfy.sdkVersion().then((v) => {
    console.log('+++++++++++++');
    console.log(v);
    setVersion(v.version);
  });

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
