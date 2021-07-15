import React from "react";
import colours from "../colours";
import { StyleSheet, Text, ScrollView, Dimensions, View } from "react-native";

import Code from "./Code";
import { DisplayCode } from "../App";
import TOTP from "../crypto/totp";
import SHA1 from "../crypto/sha1";

interface CodeViewProps {
  codes: DisplayCode[],
  editing: boolean,
  editCallback: () => void,
  deletionCallback: (index: number) => void,
  shiftCallback: (index: number, direction: number) => void,
  copyCallback: (code: number) => void
}

class CodeView extends React.Component<CodeViewProps> {
  render() {
    if (this.props.codes.length > 0) {
      return (
        <ScrollView style={styles.codeView}>
          {this.props.codes.map((code, index) =>
            <Code
              key={code.totp.key.concat([index]).toString()}
              code={code}
              editing={this.props.editing}
              editCallback={this.props.editCallback}
              shiftCallback={(direction: number) => this.props.shiftCallback(index, direction)}
              deletionCallback={() => this.props.deletionCallback(index)}
              copyCallback={this.props.copyCallback} />
          )}
        </ScrollView>
      );
    } else {
      return (
        <View style={styles.codeView}>
          <Text style={styles.text}>Add an account to get started!</Text>
        </View>
      )
    }
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
  },
  text: {
    color: colours.text,
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Inter-Regular"
  }
});

export default CodeView;