import React from "react";
import colours from "./colours";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import { Provider, FAB } from "react-native-paper";
import { loadAsync } from "expo-font";

import Header from "./components/Header";
import CodeView from "./components/CodeView";
import CameraScreen from "./components/CameraScreen";

import TOTP from "./crypto/totp";

interface AppState {
  loaded: boolean,
  scanningCode: boolean,
  codes: DisplayCode[]
}

export interface DisplayCode {
  label: string,
  issuer: string,
  totp: TOTP
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = { loaded: false, scanningCode: false, codes: [] };
    this.addNewCode = this.addNewCode.bind(this);
    this.encodeSavedCodes = this.encodeSavedCodes.bind(this);
  }

  componentDidMount() {
    loadAsync({
      "Inter-ExtraLight": require("../assets/fonts/Inter-ExtraLight.ttf"),
      "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
      "Inter-ExtraBold": require("../assets/fonts/Inter-ExtraBold.ttf")
    }).then(() => {
      this.setState({ loaded: true });
    });

    BackHandler.addEventListener("hardwareBackPress", () => {
      if (this.state.scanningCode) {
        this.setState({ scanningCode: false });
        return true;
      } else {
        return false;
      }
    });

    this.decodeSavedCodes().then(codes => {
      this.setState({ codes });
    });
  }

  addNewCode(code: DisplayCode) {
    this.setState({ codes: this.state.codes.concat([code]) }, this.encodeSavedCodes);
    if (this.state.scanningCode) this.setState({ scanningCode: false });
  }

  encodeSavedCodes() {
    let encodedArray = this.state.codes.map(code => {
      return {
        label: code.label,
        issuer: code.issuer,
        secret: code.totp.key
      };
    });

    let encodedString = JSON.stringify(encodedArray);
    SecureStore.setItemAsync("AUTHENTICATE_KEYS", encodedString);
  }

  decodeSavedCodes(): Promise<DisplayCode[]> {
    return SecureStore.getItemAsync("AUTHENTICATE_KEYS").then(encodedString => {
      if (encodedString === null) return [];
      let encodedArray: any[] = JSON.parse(encodedString);
      return encodedArray.map(code => {
        return {
          label: code.label,
          issuer: code.issuer,
          totp: new TOTP(code.secret)
        };
      });
    });
  }

  render() {
    if (this.state.loaded) {
      if (!this.state.scanningCode) {
        return (
          <Provider>
            <View style={styles.container}>
              <StatusBar style="light" translucent={false} backgroundColor={colours.background} />
              <Header />
              <CodeView codes={this.state.codes} />
              <FAB
                style={styles.actionButton}
                icon="plus"
                onPress={() => this.setState({ scanningCode: true })}
                small />
            </View>
          </Provider>
        );
      } else {
        return (
          <CameraScreen successCallback={this.addNewCode} />
        )
      }
    } else {
      return <View style={styles.container} />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background
  },
  actionButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 40,
    transform: [{ "scale": 1.5 }],
    backgroundColor: colours.accent1
  }
});

export default App;