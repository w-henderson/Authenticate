import React from "react";
import colours from "../colours";
import { StyleSheet, Text, View } from "react-native";

class Header extends React.Component {
  render() {
    return (
      <View style={styles.header}>
        <Text style={styles.text}>Authenticate</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 72,
    paddingTop: 12,
    paddingBottom: 16,
    display: "flex",
    alignItems: "center",
    alignContent: "center"
  },
  text: {
    color: colours.accent1,
    fontSize: 32,
    fontFamily: "Inter-ExtraBold"
  }
});

export default Header;