import React from "react";
import colours from "../colours";
import { StyleSheet, Text, ScrollView, Dimensions } from "react-native";

class CodeView extends React.Component {
  render() {
    return (
      <ScrollView style={styles.codeView}>
        <Text style={styles.text}>Code view will go here</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  codeView: {
    position: "absolute",
    top: 96,
    left: 0,
    width: "100%",
    height: Dimensions.get("window").height - 96,
    padding: 32
  },
  text: {
    color: colours.light,
    fontFamily: "Inter-Regular"
  }
});

export default CodeView;