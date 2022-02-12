import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { Glassfy } from 'react-native-glassfy-module';

async function getGlassfy() {
  try {
    let offerings = await Glassfy.offerings();
    console.log(offerings);
    let sku = await Glassfy.skuWithIdentifier(
      'newsreader_premium_weekly_3.99_7days_0'
    );
  } catch (e) {
    console.log('##############################################');
    console.log(e);
    console.log('##############################################');
  }
}

export default function App() {
  // const [result, setResult] = React.useState<number | undefined>();
  const [version, setVersion] = React.useState<string | undefined>();

  // React.useEffect(() => {
  //   multiply(3, 7).then(setResult);
  // }, []);

  // const gf = new Glassfy();

  Glassfy.sdkVersion().then((v) => {
    console.log(v);
    setVersion(v.version);
  });

  Glassfy.initialize('3410b08907ce4772a2825f1a71b3c0c0', false);

  getGlassfy();
  // try {
  //   Glassfy.offerings().then((offerings) => {
  //     console.log(offerings);
  //     Glassfy.skuWithIdentifier('newsreader_premium_weekly_3.99_7days_0').then(
  //       (sku) => {
  //         console.log(sku);
  //       }
  //     );
  //   });
  // } catch (error) {
  //   console.log(error);
  // }

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
