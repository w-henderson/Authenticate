import React, { memo } from "react";
import colours from "../colours";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { DisplayCode } from "../App";
import { AnimatedCircularProgress } from "react-native-circular-progress";

import images from "../images";

interface CodeProps {
  code: DisplayCode
}

interface CodeState {
  code: string
}

class Code extends React.Component<CodeProps, CodeState> {
  updateInterval: NodeJS.Timeout | undefined;

  constructor(props: CodeProps) {
    super(props);
    this.state = {
      code: this.codeToString(this.props.code.totp.value())
    }

    this.updateCode = this.updateCode.bind(this);
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
      <View style={styles.view}>
        <View style={styles.imageView}>
          <AnimatedCircularProgress
            fill={66}
            size={140}
            width={8}
            rotation={0}
            tintColor={colours.accent1} />
          <Image source={images.logos.google} style={styles.logo} />
        </View>
        <View>
          <Text>{this.props.code.issuer}</Text>
          <Text>{this.props.code.label}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    width: "100%",
    height: "100%",
    marginBottom: 28,
    borderRadius: 16,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  imageView: {
    width: 140,
    height: 140,
    position: "relative"
  },
  logo: {
    position: "absolute",
    top: 6,
    left: 6,
    width: 128,
    height: 128,
    borderRadius: 64,
    borderColor: "rgba(0, 0, 0, 0.15)",
    borderWidth: 1
  }
});

export default memo(Code);