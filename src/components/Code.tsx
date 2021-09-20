import React, { memo } from "react";
import colours from "../colours";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";
import { DisplayCode } from "../App";
import { AnimatedCircularProgress } from "react-native-circular-progress";

import { getLogo } from "../logos/logos";

interface CodeProps {
  code: DisplayCode
}

interface CodeState {
  code: string
}

class Code extends React.Component<CodeProps, CodeState> {
  updateInterval: NodeJS.Timeout | undefined;
  progressLine: any;

  constructor(props: CodeProps) {
    super(props);
    this.state = {
      code: this.codeToString(this.props.code.totp.value())
    }

    this.progressLine = React.createRef();
    this.updateCode = this.updateCode.bind(this);
  }

  componentDidMount() {
    this.updateCode();
  }

  updateCode() {
    this.setState({ code: this.codeToString(this.props.code.totp.value()) }, () => {
      let tuu = this.props.code.totp.timeUntilUpdate()
      let initialValue = tuu / (this.props.code.totp.interval * 10);
      this.progressLine.reAnimate(initialValue, 0, tuu, Easing.linear);
      this.updateInterval = setTimeout(this.updateCode, tuu);
    });
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
            fill={0}
            size={140}
            width={8}
            rotation={0}
            tintColor={colours.accent1}
            ref={(ref) => { this.progressLine = ref }} />
          <View style={styles.innerImageView}>
            <Image source={getLogo(this.props.code.issuer)} style={styles.logo} />
          </View>
        </View>
        <View style={styles.textView}>
          <Text style={styles.issuer}>{this.props.code.issuer}</Text>
          <Text style={styles.label}>{this.props.code.label}</Text>
        </View>
        <View style={styles.codeView}>
          <Text style={styles.code}>{this.state.code}</Text>
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
    position: "relative",
    marginBottom: 48
  },
  innerImageView: {
    position: "absolute",
    top: 6,
    left: 6,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "white",
    elevation: 32
  },
  logo: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderColor: "rgba(0, 0, 0, 0.15)",
    borderWidth: 1
  },
  textView: {
    marginBottom: 48
  },
  issuer: {
    fontFamily: "Roboto Slab",
    fontSize: 36,
    marginBottom: 12,
    color: colours.text,
    textAlign: "center"
  },
  label: {
    fontFamily: "Roboto",
    fontSize: 20,
    color: colours.text,
    opacity: 0.5,
    textAlign: "center"
  },
  codeView: {
    backgroundColor: colours.backgroundHighlight,
    borderRadius: 8,
    borderColor: colours.border,
    borderWidth: 1,
    elevation: 16
  },
  code: {
    fontFamily: "Roboto Slab",
    fontSize: 56,
    color: colours.text,
    marginHorizontal: 32
  }
});

export default memo(Code);