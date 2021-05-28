import React from "react";
import colours from "./colours";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { loadAsync } from "expo-font";

import Header from "./components/Header";
import CodeView from "./components/CodeView";

interface AppState {
  loaded: boolean
}

class App extends React.Component<{}, AppState> {
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
          <StatusBar style="light" />
          <Header />
          <CodeView />
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.darkest
  }
});

export default App;