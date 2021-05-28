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
    height: 96,
    padding: 32,
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: colours.dark // maybe remove
  },
  text: {
    color: colours.accentLight,
    fontSize: 32,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowRadius: 10,
    fontFamily: "Inter-ExtraBold"
  }
});

export default Header;