import React from "react";
import { Dimensions, Image, LayoutAnimation, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { IconButton } from "react-native-paper";
import { DisplayCode } from "../App";
import colours from "../colours";
import { getLogo } from "../logos/logos";

interface DrawerProps {
  codes: DisplayCode[],
  codeIndex: number
}

interface DrawerState {
  maximised: boolean
}

class Drawer extends React.Component<DrawerProps, DrawerState> {
  constructor(props: DrawerProps) {
    super(props);
    this.state = { maximised: false };
    this.toggleMaximised = this.toggleMaximised.bind(this);
  }

  toggleMaximised() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ maximised: !this.state.maximised });
  }

  render() {
    let containerStyle = this.state.maximised ? { top: 200, height: Dimensions.get("window").height - 200 } : { bottom: 0 };

    return (
      <View style={[styles.container, containerStyle]}>
        <TouchableWithoutFeedback onPress={this.toggleMaximised}>
          <View style={styles.header}>
            <Image source={getLogo(this.props.codes[this.props.codeIndex].issuer)} style={styles.logo} />
            <View style={{ flex: 1 }}>
              <Text style={styles.issuer}>{this.props.codes[this.props.codeIndex].issuer}</Text>
              <Text style={styles.label}>{this.props.codes[this.props.codeIndex].label}</Text>
            </View>
            <IconButton
              icon={this.state.maximised ? "chevron-down" : "chevron-up"}
              size={28}
              color={colours.text}
              style={{ marginRight: -4 }}
              onPress={this.toggleMaximised} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    backgroundColor: colours.background
  },
  header: {
    height: 100,
    width: "100%",
    backgroundColor: colours.backgroundHighlight,
    borderColor: colours.border,
    borderWidth: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    display: "flex",
    flexDirection: "row",
    padding: 24
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderColor: colours.border,
    borderWidth: 1,
    marginRight: 24
  },
  issuer: {
    fontFamily: "Roboto Slab",
    fontSize: 24,
    color: colours.text,
    marginTop: -2
  },
  label: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: colours.text,
    opacity: 0.5,
    overflow: "hidden",
    height: 20
  }
});

export default Drawer;