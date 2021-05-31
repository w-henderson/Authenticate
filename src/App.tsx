import React from "react";
import colours from "./colours";
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
  scanningCode: boolean
}

export interface DisplayCode {
  title: string,
  totp: TOTP
}

class App extends React.Component<{}, AppState> {
  demoCode: DisplayCode = {
    title: "Demo Code",
    totp: new TOTP([0x78, 0x64])
  };

  constructor(props: {}) {
    super(props);
    this.state = { loaded: false, scanningCode: false };
    this.addNewCode = this.addNewCode.bind(this);
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
  }

  addNewCode(code: DisplayCode) {
    if (this.state.scanningCode) this.setState({ scanningCode: false });
  }

  render() {
    if (this.state.loaded) {
      if (!this.state.scanningCode) {
        return (
          <Provider>
            <View style={styles.container}>
              <StatusBar style="light" translucent={false} backgroundColor={colours.background} />
              <Header />
              <CodeView codes={[this.demoCode]} />
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