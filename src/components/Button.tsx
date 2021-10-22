import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, TouchableNativeFeedback, Text, View } from "react-native";

import colours from "../colours";

interface ButtonProps {
  text: string,
  style?: StyleProp<ViewStyle>,
  onPress: () => void
}

class Button extends React.Component<ButtonProps> {
  render() {
    return (
      <View style={this.props.style ? [styles.wrapper, this.props.style] : styles.wrapper}>
        <TouchableNativeFeedback
          onPress={this.props.onPress}
          background={TouchableNativeFeedback.Ripple("#eeccbb", true)}
          useForeground={true}
        >
          <View style={styles.button}>
            <Text style={styles.text}>{this.props.text}</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 4
  },
  button: {
    width: "100%",
    height: 64,
    borderRadius: 8,
    backgroundColor: colours.accent1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: colours.backgroundHighlight,
    fontFamily: "Roboto Slab",
    fontSize: 18
  }
});

export default Button;