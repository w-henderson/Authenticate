import React from "react";
import colours from "./colours";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { loadAsync } from "expo-font";

import Header from "./components/Header";
import CodeView from "./components/CodeView";

import TOTP from "./crypto/totp";

interface AppState {
  loaded: boolean
}

class App extends React.Component<{}, AppState> {
  demoCode = {
    title: "Demo Code",
    totp: new TOTP([0x78, 0x64])
  };

  constructor(props: {}) {
    super(props);
    this.state = { loaded: false };
  }

  componentDidMount() {
    loadAsync({
      "Inter-ExtraLight": require("../assets/fonts/Inter-ExtraLight.ttf"),
      "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
      "Inter-ExtraBold": require("../assets/fonts/Inter-ExtraBold.ttf")
    }).then(() => {
      this.setState({ loaded: true });
    })
  }

  render() {
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <StatusBar style="light" translucent={false} backgroundColor={colours.background} />
          <Header />
          <CodeView codes={[this.demoCode]} />
        </View>
      );
    } else {
      return <View style={styles.container} />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background
  }
});

export default App;