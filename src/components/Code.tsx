import React from "react";
import colours from "../colours";
import { StyleSheet, Text, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import { IconButton } from "react-native-paper";

interface CodeProps {
  issuer: string,
  label: string,
  code: string,
  amountRemaining: number,
  editing: boolean,
  editCallback: () => void,
  shiftCallback: (direction: number) => void,
  deletionCallback: () => void
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
      <TouchableWithoutFeedback onLongPress={this.props.editCallback}>
        <View style={this.props.editing ? [styles.view, { paddingLeft: 32 }] : styles.view}>
          {this.props.editing &&
            <View style={styles.buttons}>
              <IconButton
                icon="chevron-up"
                size={32}
                style={styles.button}
                color={colours.accent2}
                onPress={() => this.props.shiftCallback(-1)} />
              <IconButton
                icon="delete"
                size={32}
                style={styles.button}
                color={colours.accent1}
                onPress={this.props.deletionCallback} />
              <IconButton
                icon="chevron-down"
                size={32}
                style={styles.button}
                color={colours.accent2}
                onPress={() => this.props.shiftCallback(1)} />
            </View>
          }

          {this.props.issuer !== "" && <Text style={styles.title}>{this.props.issuer}</Text>}
          <Text style={this.props.issuer ? styles.label : styles.title}>{this.props.label}</Text>
          <Text style={styles.code}>{this.props.code}</Text>
          <View style={remainingStyle} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    width: "100%",
    marginBottom: 28,
    backgroundColor: colours.backgroundHighlight,
    borderRadius: 16,
    overflow: "hidden"
  },
  buttons: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    width: 32,
    height: "100%",
    zIndex: 1
  },
  button: {
    flex: 1,
    margin: 0,
    marginLeft: 8,
    padding: 0
  },
  title: {
    marginTop: 20,
    marginLeft: 28,
    color: colours.text,
    fontFamily: "Inter-Regular",
    fontSize: 20,
    opacity: 0.8
  },
  label: {
    fontSize: 12,
    marginLeft: 28,
    color: colours.text,
    fontFamily: "Inter-ExtraLight",
    opacity: 0.8
  },
  code: {
    marginLeft: 28,
    marginBottom: 20,
    color: colours.accent2,
    fontFamily: "Inter-ExtraBold",
    fontSize: 48
  }
});

export default Code;