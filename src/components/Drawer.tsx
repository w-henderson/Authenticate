import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { IconButton } from "react-native-paper";
import { DisplayCode } from "../App";
import colours from "../colours";
import { getLogo } from "../logos/logos";

interface DrawerProps {
  code: DisplayCode
}

class Drawer extends React.Component<DrawerProps> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={getLogo(this.props.code.issuer)} style={styles.logo} />
          <View style={{ flex: 1 }}>
            <Text style={styles.issuer}>{this.props.code.issuer}</Text>
            <Text style={styles.label}>{this.props.code.label}</Text>
          </View>
          <IconButton
            icon={"chevron-up"}
            size={28}
            color={colours.text}
            style={{ marginRight: -4 }}
            onPress={() => { }} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%"
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