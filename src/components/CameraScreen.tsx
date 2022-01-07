import React from "react";
import { Dimensions, StyleSheet, Text, View, Button, Alert } from "react-native";
import { IconButton } from "react-native-paper";
import { BarCodeScanningResult, Camera } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { DisplayCode } from "../App";
import colours from "../colours";

import TOTP from "../crypto/totp";
import OTPAuth from "../parse/otpauth";
import OTPMigration from "../parse/migration";

interface CameraScreenState {
  cameraAllowed: CameraPermission,
  scannerActive: boolean
}

interface CameraScreenProps {
  successCallback: (code: DisplayCode) => void,
  multipleSuccessCallback: (codes: DisplayCode[]) => void,
  closeCallback: () => void
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
    this.state = { cameraAllowed: CameraPermission.Unset, scannerActive: false };
    this.requestCamera = this.requestCamera.bind(this);
    this.codeScanned = this.codeScanned.bind(this);
  }

  componentDidMount() {
    this.requestCamera();
  }

  requestCamera() {
    Camera.requestPermissionsAsync().then(response => {
      if (response.granted) {
        this.setState({ cameraAllowed: CameraPermission.Allowed, scannerActive: true });
      } else if (response.canAskAgain) {
        this.setState({ cameraAllowed: CameraPermission.PassiveDenied, scannerActive: false });
      } else {
        this.setState({ cameraAllowed: CameraPermission.Denied, scannerActive: false });
      }
    });
  }

  codeScanned(code: BarCodeScanningResult) {
    this.setState({ scannerActive: false });

    if (code.data.startsWith("otpauth://")) {
      // Decode single TOTP code
      try {
        let auth = new OTPAuth(code.data);
        this.props.successCallback({
          issuer: auth.issuer,
          label: auth.label,
          totp: new TOTP(auth.secret)
        });
      } catch (e: any) {
        Alert.alert("Error decoding migration codes", e.message, [{
          "text": "OK",
          "onPress": () => this.setState({ scannerActive: true })
        }]);
      }
    } else if (code.data.startsWith("otpauth-migration://offline")) {
      // Decode exported migration code containing multiple TOTP codes
      try {
        let migration = new OTPMigration(code.data);

        Alert.alert("Codes detected", `Detected ${migration.codes.length} codes, do you want to import them?`, [{
          "text": "Import",
          "onPress": () => this.props.multipleSuccessCallback(
            migration.codes.map((auth: OTPAuth) => {
              return {
                issuer: auth.issuer,
                label: auth.label,
                totp: new TOTP(auth.secret)
              }
            }))
        }, {
          "text": "Cancel",
          "onPress": () => this.setState({ scannerActive: true })
        }]);
      } catch (e: any) {
        this.setState({ scannerActive: false });
        Alert.alert("Error decoding migration codes", e.message, [{
          "text": "OK",
          "onPress": () => this.setState({ scannerActive: true })
        }]);
      }
    } else {
      Alert.alert("Error", "Code not recognised", [{
        "text": "OK",
        "onPress": () => this.setState({ scannerActive: true })
      }]);
    }
  }

  render() {
    if (this.state.cameraAllowed === CameraPermission.Allowed) {
      return (
        <View style={styles.view}>
          <StatusBar style="light" translucent={true} />
          <IconButton
            icon={"arrow-left-circle"}
            size={36}
            color="white"
            style={styles.icon}
            onPress={this.props.closeCallback} />
          <Camera
            ratio="16:9"
            style={styles.scanner}
            onBarCodeScanned={this.state.scannerActive ? this.codeScanned : undefined} />
        </View>
      )
    } else if (this.state.cameraAllowed !== CameraPermission.Unset) {
      return (
        <View style={styles.view}>
          <StatusBar style="light" translucent={true} />
          <IconButton
            icon={"arrow-left-circle"}
            size={36}
            color="white"
            style={styles.icon}
            onPress={this.props.closeCallback} />
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

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colours.background,
  },
  icon: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 2
  },
  text: {
    fontFamily: "Roboto",
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