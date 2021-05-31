import React from "react";
import { Dimensions, StyleSheet, Text, View, Button } from "react-native";
import { BarCodeScanningResult, Camera } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { DisplayCode } from "../App";
import colours from "../colours";

import TOTP from "../crypto/totp";

interface CameraScreenState {
  cameraAllowed: CameraPermission
}

interface CameraScreenProps {
  successCallback: (code: DisplayCode) => void;
}

enum CameraPermission {
  Allowed,
  Denied,
  PassiveDenied,
  Unset
}

class CameraScreen extends React.Component<CameraScreenProps, CameraScreenState> {
  constructor(props: CameraScreenProps) {
    super(props);
    this.state = { cameraAllowed: CameraPermission.Unset };
    this.requestCamera = this.requestCamera.bind(this);
    this.codeScanned = this.codeScanned.bind(this);
  }

  componentDidMount() {
    this.requestCamera();
  }

  requestCamera() {
    Camera.requestPermissionsAsync().then(response => {
      this.setState({
        cameraAllowed: response.granted ? CameraPermission.Allowed : response.canAskAgain ? CameraPermission.PassiveDenied : CameraPermission.Denied
      });
    });
  }

  codeScanned(code: BarCodeScanningResult) {
    this.props.successCallback({
      title: "fix me",
      totp: new TOTP([])
    });
  }

  render() {
    if (this.state.cameraAllowed === CameraPermission.Allowed) {
      return (
        <View style={styles.view}>
          <StatusBar style="light" translucent={false} backgroundColor={colours.background} />
          <Camera
            ratio="16:9"
            style={styles.scanner}
            onBarCodeScanned={this.codeScanned} />
        </View>
      )
    } else if (this.state.cameraAllowed !== CameraPermission.Unset) {
      return (
        <View style={styles.view}>
          <StatusBar style="light" translucent={false} backgroundColor={colours.background} />
          <Text style={styles.text}>Please allow camera access to scan a QR code.</Text>
          {this.state.cameraAllowed === CameraPermission.PassiveDenied &&
            <Button
              title="Request Permission"
              color={colours.accent1}
              onPress={() => this.requestCamera()} />
          }
        </View>
      )
    } else {
      return (
        <View style={styles.view}>
          <StatusBar style="light" translucent={false} backgroundColor={colours.background} />
        </View>
      )
    }
  }
}

// PERMISSIONS

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colours.background,
  },
  text: {
    fontFamily: "Inter-Regular",
    color: colours.text,
    fontSize: 24,
    margin: 64,
    textAlign: "center"
  },
  scanner: {
    position: "absolute",
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").height * (9 / 16),
  }
});

export default CameraScreen;