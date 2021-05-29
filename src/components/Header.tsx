import React from "react";
import colours from "../colours";
import { StyleSheet, Text, View } from "react-native";
import { IconButton } from "react-native-paper";

class Header extends React.Component {
  render() {
    return (
      <View style={styles.header}>
        <Text style={styles.text}>Authenticate</Text>
        <IconButton
          icon="dots-vertical"
          size={28}
          color="white"
          style={styles.icon}
          onPress={() => null} />
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
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 10,
    fontSize: 24,
    color: colours.text
  }
});

export default Header;