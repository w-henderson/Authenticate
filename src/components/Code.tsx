import React from "react";
import colours from "../colours";
import { StyleSheet, Text, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import { IconButton } from "react-native-paper";
import { DisplayCode } from "../App";

interface CodeProps {
  code: DisplayCode,
  editing: boolean,
  editCallback: () => void,
  shiftCallback: (direction: number) => void,
  deletionCallback: () => void
}

interface CodeState {
  code: string,
  timeUntilUpdate: number
}

const FRAMERATE: number = 15;

class Code extends React.Component<CodeProps, CodeState> {
  updateInterval: NodeJS.Timeout | undefined;
  lastTimeUntilUpdate: number;
  lastSecret: number[];

  constructor(props: CodeProps) {
    super(props);
    this.updateCode = this.updateCode.bind(this);
    this.lastTimeUntilUpdate = -1;
    this.lastSecret = [];
    this.state = {
      code: this.codeToString(this.props.code.totp.value()),
      timeUntilUpdate: this.props.code.totp.timeUntilUpdate()
    }
  }

  componentDidMount() {
    this.updateInterval = setInterval(this.updateCode, 1000 / FRAMERATE)
  }

  updateCode() {
    let timeUntilUpdate = this.props.code.totp.timeUntilUpdate();

    if (this.lastTimeUntilUpdate < timeUntilUpdate || this.lastSecret !== this.props.code.totp.key) {
      this.setState({
        code: this.codeToString(this.props.code.totp.value()),
        timeUntilUpdate
      });
    } else this.setState({ timeUntilUpdate });

    this.lastTimeUntilUpdate = timeUntilUpdate;
    this.lastSecret = this.props.code.totp.key;
  }

  codeToString(code: number): string {
    let str = code.toString().padStart(6, "0");
    let spacedStr = str.substr(0, 3) + " " + str.substr(3, 3);
    return spacedStr;
  }

  componentWillUnmount() {
    if (this.updateInterval) clearInterval(this.updateInterval);
  }

  render() {
    let remainingStyle: ViewStyle = {
      width: `${(this.state.timeUntilUpdate / this.props.code.totp.interval) * 0.1}%`,
      height: 8,
      backgroundColor: colours.backgroundHighlight2,
      position: "absolute",
      bottom: 0,
      borderRadius: 16
    };

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