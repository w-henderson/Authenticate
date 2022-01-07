import React from "react";
import colours from "../colours";
import { Dimensions, StyleSheet, Text, View, Linking, Image, StatusBar } from "react-native";
import { Menu, IconButton } from "react-native-paper";
import images from "../images";

interface HeaderProps {
  importCallback: () => void,
  removeCodesCallback: () => void
}

interface HeaderState {
  menuActive: boolean
}

class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
    super(props);
    this.state = { menuActive: false };
  }

  render() {
    return (
      <View style={styles.header}>
        <Image source={images.icon} style={styles.logo} />
        <Text style={styles.text}>Authenticate</Text>
        <IconButton
          icon={"dots-vertical"}
          size={28}
          color={colours.text}
          style={styles.icon}
          onPress={() => { this.setState({ menuActive: true }) }} />

        <Menu
          visible={this.state.menuActive}
          onDismiss={() => this.setState({ menuActive: false })}
          anchor={{ x: Dimensions.get("screen").width - 16, y: StatusBar.currentHeight || 0 }}
          contentStyle={styles.menu}>

          <Menu.Item
            onPress={() => { this.props.importCallback(); this.setState({ menuActive: false }) }}
            title="Import Codes"
            titleStyle={styles.menuItem} />
          <Menu.Item
            onPress={() => { this.props.removeCodesCallback(); this.setState({ menuActive: false }) }}
            title="Remove All Codes"
            titleStyle={styles.menuItem} />
          <Menu.Item
            onPress={() => { Linking.openURL("https://github.com/w-henderson/Authenticate/issues") }}
            title="Report an Issue"
            titleStyle={styles.menuItem} />
        </Menu>
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
    paddingTop: StatusBar.currentHeight || 0,
    height: 80 + (StatusBar.currentHeight || 0),
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: colours.backgroundHighlight,
    borderBottomColor: colours.border,
    borderBottomWidth: 1
  },
  logo: {
    height: 36,
    width: 36,
    marginLeft: 24,
    marginRight: 20
  },
  text: {
    color: colours.text,
    fontSize: 28,
    fontFamily: "Roboto Slab"
  },
  icon: {
    position: "absolute",
    right: 13,
    top: 13 + (StatusBar.currentHeight || 0),
    fontSize: 24,
    color: colours.text
  },
  menu: {
    color: colours.text,
    backgroundColor: colours.background
  },
  menuItem: {
    color: colours.text
  }
});

export default Header;