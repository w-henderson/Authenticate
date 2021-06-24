import React, { memo } from "react";
import colours from "../colours";
import { StyleSheet, Text, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import { IconButton } from "react-native-paper";
import { DisplayCode } from "../App";
import CountdownAnimation from "./CountdownAnimation";

interface CodeProps {
  code: DisplayCode,
  editing: boolean,
  editCallback: () => void,
  shiftCallback: (direction: number) => void,
  deletionCallback: () => void
}

interface CodeState {
  code: string
}

class Code extends React.Component<CodeProps, CodeState> {
  updateInterval: NodeJS.Timeout | undefined;

  constructor(props: CodeProps) {
    super(props);
    this.updateCode = this.updateCode.bind(this);
    this.state = {
      code: this.codeToString(this.props.code.totp.value())
    }
  }

  componentDidMount() {
    this.updateCode();
  }

  updateCode() {
    this.setState({ code: this.codeToString(this.props.code.totp.value()) });
    this.updateInterval = setTimeout(this.updateCode, this.props.code.totp.timeUntilUpdate());
  }

  codeToString(code: number): string {
    let str = code.toString().padStart(6, "0");
    let spacedStr = str.substr(0, 3) + " " + str.substr(3, 3);
    return spacedStr;
  }

  componentWillUnmount() {
    if (this.updateInterval) clearTimeout(this.updateInterval);
  }

  render() {
    return (
      <TouchableWithoutFeedback onLongPress={this.props.editCallback}>
        <View style={styles.view}>
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

          <View style={{ width: "100%", paddingLeft: this.props.editing ? 32 : 0 }}>
            {this.props.code.issuer !== "" && <Text style={styles.title}>{this.props.code.issuer}</Text>}
            <Text style={this.props.code.issuer ? styles.label : styles.title}>{this.props.code.label}</Text>
            <Text style={styles.code}>{this.state.code}</Text>
          </View>

          <CountdownAnimation
            interval={this.props.code.totp.interval}
            calculateTimeUntilUpdate={this.props.code.totp.timeUntilUpdate} />
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

export default memo(Code);