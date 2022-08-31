import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Glassfy, GlassfyExtraProperty } from 'react-native-glassfy-module';

export default class App extends Component {
  private async getGlassfy() {
    try {
      let version = await Glassfy.sdkVersion();
      this.setState({ SDKVersion: version.version });
      this.setState({ currentOperation: 'initializing' });
      await Glassfy.initialize('50af3c1afb6f473bbaf1ad0d5fb19b41', false);

      // set custom identifier (optional)
      this.setState({ currentOperation: 'connectCustomSubscriber' });
      await Glassfy.connectCustomSubscriber('my_custom_identifier');
      // set user email (optional)
      this.setState({ currentOperation: 'setEmailUserProperty' });
      await Glassfy.setEmailUserProperty('my@email.com');
      const extraProp: GlassfyExtraProperty = {
        lastactivity: 'Bike',
        usage_count: '3',
      };
      this.setState({ currentOperation: 'setExtraUserProperty' });
      await Glassfy.setExtraUserProperty(extraProp);
      // connect a paddle license key
      this.setState({ currentOperation: 'connectPaddleLicenseKey' });
      await Glassfy.connectPaddleLicenseKey('89bf4c748e4a45e5829e6ee6', true);
      // get subscriber current subscriptions
      this.setState({ currentOperation: 'permissions' });
      let permissions = await Glassfy.permissions();
      console.log(JSON.stringify(permissions, null, 3));
      // fetch 'subscription_articles' offering
      this.setState({ currentOperation: 'offerings' });
      let offerings = await Glassfy.offerings();
      console.log(JSON.stringify(offerings, null, 3));
      const offering = offerings.all.find(
        (o) => o.offeringId === 'subscription_articles'
      );
      const sku = offering?.skus[0];
      console.log(JSON.stringify(sku, null, 3));
      this.setState({ currentOperation: 'purchaseSku' });
      let transaction = await Glassfy.purchaseSku(sku!);
      this.setState({ currentOperation: 'Done!' });

      console.log(JSON.stringify(transaction, null, 3));
    } catch (error) {
      console.error('Problem', error);
    } finally {
      console.log('end');
    }
  }
  constructor(props) {
    super(props);

    this.state = { SDKVersion: '---', currentOperation: '????' };
  }

  componentDidMount() {
    this.getGlassfy();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Glassfy SDK version:{this.state['SDKVersion']}</Text>
        <Text></Text>
        <Text>Current SDK Call: {this.state['currentOperation']} </Text>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
