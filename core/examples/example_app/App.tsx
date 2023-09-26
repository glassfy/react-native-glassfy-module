import * as React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableHighlight,
  Button,
  Alert,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/FontAwesome";
import { Glassfy, GlassfySku } from "react-native-glassfy-module";
import { Component } from "react";
import { getDeviceName } from "react-native-device-info";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    padding: 10,
    backgroundColor: "white",
  },
  inforow: {
    height: 80,
    padding: 10,
    backgroundColor: "white",
  },
  rowTextStyle: { fontSize: 18 },
  inforowTextStyle: { fontSize: 16, padding: 4 },

  rowAccessoryStyle: { position: "absolute", right: 10 },
});

function ItemDivider() {
  return (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: "#F6F6F6",
      }}
    />
  );
}

class InfoScreen extends React.Component<any, any> {
  private async getInfo() {
    var DeviceInfo = require("react-native-device-info");

    try {
      let permissions = await Glassfy.permissions();
      let info = [
        ["subscriberId", permissions.subscriberId],
        ["installatioId", permissions.installationId],
        ["bundle id", DeviceInfo.getBundleId()],
      ];
      console.log(info);
      this.setState({ info: info });
    } catch (error) {
      console.error("Problem", error);
    }
  }
  constructor(props: any) {
    super(props);
    this.props.navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => this.props.navigation.goBack()} title="Done" />
      ),
    });
    this.state = {
      info: [],
    };
    this.getInfo();
  }
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.info}
          renderItem={({ item }) => (
            <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD">
              <View style={styles.inforow}>
                <Text style={styles.inforowTextStyle}>{item[0]}</Text>
                <Text style={styles.inforowTextStyle}>{item[1]}</Text>
              </View>
            </TouchableHighlight>
          )}
          ItemSeparatorComponent={ItemDivider}
        />
      </View>
    );
  }
}
class PermissionScreen extends React.Component<any, any> {
  private async getPermissions() {
    try {
      let permissions = await Glassfy.permissions();
      this.setState({ permissions: permissions.all });
    } catch (error) {
      console.error("Problem", error);
    }
  }
  constructor(props: any) {
    super(props);

    this.props.navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => this.props.navigation.goBack()} title="Done" />
      ),
    });
    this.state = {
      permissions: [],
    };
    this.getPermissions();
  }
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.permissions}
          renderItem={({ item }) => (
            <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD">
              <View style={styles.row}>
                <Text style={styles.rowTextStyle}>{item.permissionId}</Text>
                {item.isValid && (
                  <Icon style={styles.rowAccessoryStyle} name="check" />
                )}
              </View>
            </TouchableHighlight>
          )}
          ItemSeparatorComponent={ItemDivider}
        />
      </View>
    );
  }
}

class MainGlassfyScreen extends React.Component<any, any> {
  private async initGlassfyAndDownloadOfferings() {
    try {
      await Glassfy.initialize("50af3c1afb6f473bbaf1ad0d5fb19b41", false);
      let offerings = await Glassfy.offerings();
      this.setState({ offerings: offerings.all });
    } catch (error: any) {
      Alert.alert(error.toString());
    }
  }
  constructor(props: any) {
    super(props);

    this.props.navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => this.props.navigation.navigate("Permissions")}
          title="Permissions"
        />
      ),
      headerLeft: () => (
        <Button
          onPress={() => this.props.navigation.navigate("Info")}
          title="Info"
        />
      ),
    });
    this.state = {
      offerings: [],
    };
    this.initGlassfyAndDownloadOfferings();
  }
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.offerings}
          renderItem={({ item }) => (
            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={() =>
                this.props.navigation.navigate("Details", { skus: item.skus })
              }
            >
              <View style={styles.row}>
                <Text style={styles.rowTextStyle}>{item.offeringId}</Text>
                <Icon style={styles.rowAccessoryStyle} name="chevron-right" />
              </View>
            </TouchableHighlight>
          )}
          ItemSeparatorComponent={ItemDivider}
        />
      </View>
    );
  }
}
class SkusScreen extends Component<any, any> {
  async purchaseSku(sku: GlassfySku) {
    try {
      await Glassfy.purchaseSku(sku);
    } catch (error: any) {
      Alert.alert(error.toString());
    }
  }
  render() {
    const { skus } = this.props.route.params;
    return (
      <View style={styles.container}>
        <FlatList
          data={skus}
          renderItem={({ item }) => (
            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={() => this.purchaseSku(item)}
            >
              <View style={styles.row}>
                <Text style={styles.rowTextStyle}>{item.skuId}</Text>
              </View>
            </TouchableHighlight>
          )}
          ItemSeparatorComponent={ItemDivider}
        />
      </View>
    );
  }
}

const Stack = createNativeStackNavigator();

export default class App extends Component<any, any> {
  private async getGlassfyVersion() {
    try {
      let version = await Glassfy.sdkVersion();
      this.setState({ SDKVersion: version.version });
    } catch (error: any) {
      Alert.alert(error.toString());
    }
  }

  constructor(props: any) {
    super(props);
    this.state = {
      SDKVersion: "---",
    };
    this.getGlassfyVersion();
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Group>
            <Stack.Screen
              name="Home"
              component={MainGlassfyScreen}
              options={{
                title: "Glassfy " + this.state.SDKVersion,
              }}
            />
            <Stack.Screen name="Details" component={SkusScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="Permissions" component={PermissionScreen} />
            <Stack.Screen name="Info" component={InfoScreen} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
