import React from "react";
import colours from "./colours";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { Alert, BackHandler, Dimensions, StyleSheet, Text, View } from "react-native";
import { Provider, FAB } from "react-native-paper";
import PagerView from "react-native-pager-view";
import { loadAsync } from "expo-font";
import Clipboard from "expo-clipboard";

import Header from "./components/Header";
import CameraScreen from "./components/CameraScreen";
import InfoPopup from "./components/InfoPopup";

import TOTP from "./crypto/totp";
import Code from "./components/Code";

interface AppState {
  loaded: boolean,
  scanningCode: boolean,
  codes: DisplayCode[],
  editing: boolean,
  popupVisible: boolean,
  popupMessage: string
}

export interface DisplayCode {
  label: string,
  issuer: string,
  totp: TOTP
}

class App extends React.Component<{}, AppState> {
  popupTimeout: NodeJS.Timeout | null;

  constructor(props: {}) {
    super(props);
    this.state = {
      loaded: false,
      scanningCode: false,
      codes: [],
      editing: false,
      popupVisible: false,
      popupMessage: ""
    };

    this.popupTimeout = null;
    this.addNewCode = this.addNewCode.bind(this);
    this.addNewCodes = this.addNewCodes.bind(this);
    this.encodeSavedCodes = this.encodeSavedCodes.bind(this);
    this.deleteCode = this.deleteCode.bind(this);
    this.shiftCode = this.shiftCode.bind(this);
    this.clearCodes = this.clearCodes.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.copyCode = this.copyCode.bind(this);
  }

  componentDidMount() {
    loadAsync({
      "Roboto Slab": require("../assets/fonts/RobotoSlab-Bold.ttf"),
      "Roboto": require("../assets/fonts/Roboto-Regular.ttf")
    }).then(() => {
      this.setState({ loaded: true });
    });

    BackHandler.addEventListener("hardwareBackPress", () => {
      if (this.state.scanningCode) {
        this.setState({ scanningCode: false });
        return true;
      } else {
        return false;
      }
    });

    this.decodeSavedCodes().then(codes => {
      this.setState({ codes });
    });
  }

  addNewCode(code: DisplayCode) {
    this.setState({ codes: this.state.codes.concat([code]) }, this.encodeSavedCodes);
    if (this.state.scanningCode) this.setState({ scanningCode: false });
  }

  addNewCodes(codes: DisplayCode[]) {
    this.setState({ codes: this.state.codes.concat(codes) }, this.encodeSavedCodes);
    if (this.state.scanningCode) this.setState({ scanningCode: false });
  }

  encodeSavedCodes() {
    let encodedArray = this.state.codes.map(code => {
      return {
        label: code.label,
        issuer: code.issuer,
        secret: code.totp.key
      };
    });

    let encodedString = JSON.stringify(encodedArray);
    SecureStore.setItemAsync("AUTHENTICATE_KEYS", encodedString);
  }

  decodeSavedCodes(): Promise<DisplayCode[]> {
    return SecureStore.getItemAsync("AUTHENTICATE_KEYS").then(encodedString => {
      if (encodedString === null) return [];
      let encodedArray: any[] = JSON.parse(encodedString);
      return encodedArray.map(code => {
        return {
          label: code.label,
          issuer: code.issuer,
          totp: new TOTP(code.secret)
        };
      });
    });
  }

  deleteCode(index: number) {
    Alert.alert(
      "Delete this code?",
      "Deleting this code is permanent. Make sure you've disabled 2FA on this account otherwise you could become permanently locked out.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Code", style: "destructive", onPress: () => {
            let codes = this.state.codes;
            codes.splice(index, 1);
            if (codes.length === 0) this.setState({ codes, editing: false }, this.encodeSavedCodes);
            else this.setState({ codes }, this.encodeSavedCodes);
          }
        }
      ]
    );
  }

  shiftCode(index: number, direction: number) {
    if (index + direction >= this.state.codes.length || index + direction < 0) return;

    let codes = this.state.codes;
    let selectedCode = codes[index];
    let swapCode = codes[index + direction];
    codes[index] = swapCode;
    codes[index + direction] = selectedCode;

    this.setState({ codes }, this.encodeSavedCodes);
  }

  clearCodes() {
    Alert.alert(
      "Clear your codes?",
      "Clearing your codes is permanent. Make sure you've disabled 2FA on every account otherwise you could become permanently locked out.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Codes", style: "destructive", onPress: () => {
            this.setState({ codes: [] }, this.encodeSavedCodes);
          }
        }
      ]
    );
  }

  showPopup(message: string) {
    if (this.popupTimeout) clearTimeout(this.popupTimeout);
    this.setState({ popupVisible: true, popupMessage: message });
    this.popupTimeout = setTimeout(() => {
      this.setState({ popupVisible: false });
    }, 5000);
  }

  copyCode(code: number) {
    Clipboard.setString(code.toString().padStart(6, "0"));
    this.showPopup("Code copied to clipboard");
  }

  render() {
    if (this.state.loaded) {
      if (!this.state.scanningCode) {
        return (
          <Provider>
            <View style={styles.container}>
              <StatusBar
                style="dark"
                translucent={false}
                backgroundColor={colours.backgroundHighlight} />
              <Header
                editing={this.state.editing}
                importCallback={() => this.setState({ scanningCode: true })}
                removeCodesCallback={this.clearCodes}
                stopEditingCallback={() => this.setState({ editing: false })} />
              <PagerView initialPage={0} style={styles.pager}>
                {this.state.codes.map((code, index) =>
                  <Code code={code} key={index} />
                )}
              </PagerView>
            </View>
          </Provider>
        );
      } else {
        return (
          <CameraScreen
            successCallback={this.addNewCode}
            multipleSuccessCallback={this.addNewCodes}
            closeCallback={() => this.setState({ scanningCode: false })} />
        )
      }
    } else {
      return <View style={styles.container} />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background
  },
  pager: {
    position: "absolute",
    top: 80,
    width: "100%",
    height: Dimensions.get("window").height - 180,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
});

export default App;