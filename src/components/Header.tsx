import React from "react";
import colours from "../colours";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Menu, IconButton } from "react-native-paper";

interface HeaderProps {
  editing: boolean,
  stopEditingCallback: () => void,
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
        <Text style={styles.text}>Authenticate</Text>
        <IconButton
          icon={this.props.editing ? "close" : "dots-vertical"}
          size={28}
          color="white"
          style={styles.icon}
          onPress={() => {
            if (this.props.editing) this.props.stopEditingCallback();
            else this.setState({ menuActive: true })
          }} />

        <Menu
          visible={this.state.menuActive}
          onDismiss={() => this.setState({ menuActive: false })}
          anchor={{ x: Dimensions.get("screen").width - 16, y: 0 }}
          contentStyle={styles.menu}>

          <Menu.Item
            onPress={() => { }}
            title="About"
            titleStyle={styles.menuItem} />
          <Menu.Item
            onPress={() => { this.props.removeCodesCallback(); this.setState({ menuActive: false }) }}
            title="Remove All Codes"
            titleStyle={styles.menuItem} />
          <Menu.Item
            onPress={() => { }}
            title="Report an Issue"
            titleStyle={styles.menuItem} />
          <Menu.Item
            onPress={() => { }}
            title="Settings"
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
  },
  menu: {
    color: colours.text,
    backgroundColor: colours.backgroundHighlight2
  },
  menuItem: {
    color: colours.text
  }
});

export default Header;