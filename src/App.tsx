import React from "react";
import colours from "./colours";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { Alert, BackHandler, Dimensions, LayoutAnimation, Platform, StyleSheet, UIManager, View, StatusBar as NativeStatusBar } from "react-native";
import { Provider } from "react-native-paper";
import PagerView from "react-native-pager-view";
import { loadAsync } from "expo-font";
import Clipboard from "expo-clipboard";

import Header from "./components/Header";
import CameraScreen from "./components/CameraScreen";
import Drawer from "./components/Drawer";
import Code from "./components/Code";
import Dots from "./components/Dots";

import TOTP from "./crypto/totp";
import WelcomeScreen from "./components/WelcomeScreen";

interface AppState {
  loaded: boolean,
  scanningCode: boolean,
  codes: DisplayCode[],
  currentCodeIndex: number,
  popupVisible: boolean,
  popupMessage: string,
  drawerOpen: boolean
}

export interface DisplayCode {
  label: string,
  issuer: string,
  starred: boolean,
  totp: TOTP
}

class App extends React.Component<{}, AppState> {
  popupTimeout: NodeJS.Timeout | null;
  pagerRef: React.LegacyRef<PagerView>;

  constructor(props: {}) {
    super(props);
    this.state = {
      loaded: false,
      scanningCode: false,
      codes: [],
      currentCodeIndex: 0,
      popupVisible: false,
      popupMessage: "",
      drawerOpen: false
    };

    this.popupTimeout = null;
    this.addNewCode = this.addNewCode.bind(this);
    this.addNewCodes = this.addNewCodes.bind(this);
    this.encodeSavedCodes = this.encodeSavedCodes.bind(this);
    this.deleteCode = this.deleteCode.bind(this);
    this.clearCodes = this.clearCodes.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.selectCode = this.selectCode.bind(this);
    this.toggleStarred = this.toggleStarred.bind(this);

    this.pagerRef = React.createRef();

    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    loadAsync({
      "Roboto Slab": require("../assets/fonts/RobotoSlab-Bold.ttf"),
      "Roboto": require("../assets/fonts/Roboto-Regular.ttf")
    }).then(() => {
      BackHandler.addEventListener("hardwareBackPress", () => {
        if (this.state.scanningCode) {
          this.setState({ scanningCode: false });
          return true;
        } else {
          return false;
        }
      });

      this.decodeSavedCodes().then(codes => {
        this.setState({ codes, loaded: true });
      });
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
        starred: code.starred,
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
          starred: code.starred === true,
          totp: new TOTP(code.secret),
        };
      });
    }).catch(() => []);
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
            this.setState({ codes }, this.encodeSavedCodes);
          }
        }
      ]
    );
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

  toggleDrawer() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ drawerOpen: !this.state.drawerOpen });
  }

  selectCode(index: number) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ drawerOpen: false });
    (this as any).pagerRef.current.setPage(index);
  }

  toggleStarred(index: number) {
    let codes = this.state.codes;
    codes[index].starred = !codes[index].starred;
    this.setState({ codes }, this.encodeSavedCodes);
  }

  render() {
    let codes = this.state.codes.map((code, key) => { return { code, key: key.toString() } });
    let starredCodes = codes.filter(code => code.code.starred);
    let unstarredCodes = codes.filter(code => !code.code.starred);
    codes = starredCodes.concat(unstarredCodes);

    if (this.state.loaded) {
      if (!this.state.scanningCode) {
        if (this.state.codes.length > 0) {
          return (
            <Provider>
              <View style={styles.container}>
                <StatusBar
                  style="dark"
                  translucent={true} />
                <Header
                  importCallback={() => this.setState({ scanningCode: true })}
                  removeCodesCallback={this.clearCodes} />
                <PagerView
                  initialPage={0}
                  ref={this.pagerRef}
                  onPageSelected={e => this.setState({ currentCodeIndex: e.nativeEvent.position })}
                  offscreenPageLimit={1}
                  style={styles.pager}>
                  {codes.map((code, index) =>
                    <Code code={code.code} key={index} />
                  )}
                </PagerView>
                <Dots
                  dotsCount={this.state.codes.length}
                  selectedDot={this.state.currentCodeIndex} />
                <Drawer
                  codes={this.state.codes}
                  codeIndex={this.state.currentCodeIndex}
                  drawerOpen={this.state.drawerOpen}
                  callback={this.toggleDrawer}
                  selectCode={this.selectCode}
                  deleteCode={this.deleteCode}
                  toggleStarred={this.toggleStarred} />
              </View>
            </Provider>
          );
        } else {
          return (
            <Provider>
              <View style={styles.container}>
                <StatusBar
                  style="dark"
                  translucent={true} />
                <Header
                  importCallback={() => this.setState({ scanningCode: true })}
                  removeCodesCallback={this.clearCodes} />
                <WelcomeScreen
                  scanCallback={() => this.setState({ scanningCode: true })} />
              </View>
            </Provider>
          )
        }
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
    backgroundColor: colours.background,
  },
  pager: {
    position: "absolute",
    top: 80 + (NativeStatusBar.currentHeight || 0),
    width: "100%",
    height: Dimensions.get("window").height - 220,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
});

export default App;