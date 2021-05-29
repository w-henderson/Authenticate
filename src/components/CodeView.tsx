import React from "react";
import colours from "../colours";
import { StyleSheet, Text, ScrollView, Dimensions } from "react-native";

import Code from "./Code";

import TOTP from "../crypto/totp";

interface CodeViewProps {
  codes: {
    title: string,
    totp: TOTP
  }[];
}

interface CodeViewState {
  codes: {
    title: string,
    code: string,
    timeRemaining: number
  }[];
}

class CodeView extends React.Component<CodeViewProps, CodeViewState> {
  updateInterval: NodeJS.Timeout | undefined;

  constructor(props: CodeViewProps) {
    super(props);
    this.updateValues = this.updateValues.bind(this);

    this.state = {
      codes: this.props.codes.map(code => {
        return {
          title: code.title,
          code: this.codeToString(code.totp.value()),
          timeRemaining: code.totp.timeUntilUpdate()
        }
      })
    };
  }

  componentDidMount() {
    let framerate = 30;
    this.updateInterval = setInterval(this.updateValues, 1000 / framerate);
  }

  updateValues() {
    this.setState({
      codes: this.props.codes.map(code => {
        return {
          title: code.title,
          code: this.codeToString(code.totp.value()),
          timeRemaining: code.totp.timeUntilUpdate()
        }
      })
    });
  }

  componentWillUnmount() {
    if (this.updateInterval) clearInterval(this.updateInterval);
  }

  codeToString(code: number): string {
    let str = code.toString().padStart(6, "0");
    let spacedStr = str.substr(0, 3) + " " + str.substr(3, 3);
    return spacedStr;
  }

  render() {
    return (
      <ScrollView style={styles.codeView}>
        {this.state.codes.map((code, index) =>
          <Code
            key={index}
            title={code.title}
            code={code.code}
            amountRemaining={code.timeRemaining / 30000} />
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  codeView: {
    position: "absolute",
    top: 72,
    left: 0,
    width: "100%",
    height: Dimensions.get("window").height - 96,
    paddingBottom: 8,
    paddingHorizontal: 32
  }
});

export default CodeView;