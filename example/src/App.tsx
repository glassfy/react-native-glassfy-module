import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { multiply, Glassfy } from 'react-native-glassfy-module';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();
  const [version, setVersion] = React.useState<string | undefined>();

  // React.useEffect(() => {
  //   multiply(3, 7).then(setResult);
  // }, []);

  const gf = new Glassfy();

  gf.sdkVersion().then((v) => {
    console.log(v);
    setVersion(v.version);
  });

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
