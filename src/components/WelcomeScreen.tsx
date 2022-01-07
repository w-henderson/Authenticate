import React from "react";
import { Dimensions, StyleSheet, Text, View, StatusBar as NativeStatusBar, Image } from "react-native";
import colours from "../colours";

import Button from "./Button";

const welcome = require("../../assets/welcome.png");

interface WelcomeScreenProps {
  scanCallback: () => void
}

class WelcomeScreen extends React.Component<WelcomeScreenProps> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Image source={welcome} style={styles.image} resizeMode="contain" />
          <Text style={styles.header}>Welcome to Authenticate</Text>
          <Text style={styles.body}>
            To get started, add a code or import existing codes from Google Authenticator or another two-factor authentication app.
          </Text>
        </View>

        <View style={styles.buttons}>
          <Button text="Scan a Code" onPress={this.props.scanCallback} style={{ marginTop: 16 }} />
          <Button text="Import Multiple Codes" onPress={this.props.scanCallback} style={{ marginTop: 16 }} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 80 + (NativeStatusBar.currentHeight || 0),
    left: "10%",
    width: "80%",
    height: Dimensions.get("window").height - 140
  },
  content: {
    height: Dimensions.get("window").height - 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  buttons: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 160
  },
  image: {
    width: Dimensions.get("window").width * 0.8 * 0.8,
    height: Dimensions.get("window").width * 0.5725 * 0.8
  },
  header: {
    fontFamily: "Roboto Slab",
    fontSize: 32,
    textAlign: "center",
    color: colours.text,
    marginTop: 16
  },
  body: {
    marginTop: 16,
    fontSize: 20,
    textAlign: "center"
  }
});

export default WelcomeScreen;