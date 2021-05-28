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
    code: string
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
          code: code.totp.value().toString()
        }
      })
    };
  }

  componentDidMount() {
    this.updateInterval = setInterval(this.updateValues, 1000 / 60);
  }

  updateValues() {
    this.setState({
      codes: this.props.codes.map(code => {
        return {
          title: code.title,
          code: code.totp.value().toString()
        }
      })
    });
  }

  componentWillUnmount() {
    if (this.updateInterval) clearInterval(this.updateInterval);
  }

  render() {
    return (
      <ScrollView style={styles.codeView}>
        {this.props.codes.map((code, index) =>
          <Code
            key={index}
            title={code.title}
            code={code.totp.value().toString()}
            amountRemaining={code.totp.timeUntilUpdate() / 30000} />
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