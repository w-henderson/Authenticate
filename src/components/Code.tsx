import React from "react";
import colours from "../colours";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

interface CodeProps {
  title: string,
  code: string,
  amountRemaining: number
}

class Code extends React.Component<CodeProps> {
  render() {
    let remainingStyle: ViewStyle = {
      width: `${this.props.amountRemaining * 100}%`,
      height: 8,
      backgroundColor: colours.backgroundHighlight2,
      position: "absolute",
      bottom: 0,
      borderRadius: 16
    };

    return (
      <View style={styles.view}>
        <Text style={styles.title}>{this.props.title}</Text>
        <Text style={styles.code}>{this.props.code}</Text>
        <View style={remainingStyle} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    width: "100%",
    height: 132,
    marginBottom: 28,
    backgroundColor: colours.backgroundHighlight,
    borderRadius: 16,
    overflow: "hidden"
  },
  title: {
    marginTop: 20,
    marginLeft: 28,
    color: colours.text,
    fontFamily: "Inter-Regular",
    fontSize: 20,
    opacity: 0.8
  },
  code: {
    marginLeft: 28,
    color: colours.accent2,
    fontFamily: "Inter-ExtraBold",
    fontSize: 48
  }
});

export default Code;