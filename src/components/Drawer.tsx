import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";
import Animated, { EasingNode } from "react-native-reanimated";
import { IconButton } from "react-native-paper";
import { DisplayCode } from "../App";
import colours from "../colours";
import { getLogo } from "../logos/logos";

interface DrawerProps {
  codes: DisplayCode[],
  codeIndex: number,
  drawerOpen: boolean,
  callback: () => void
}

function Drawer(props: DrawerProps) {
  let modalColor = Animated.useSharedValue(0);

  const preCallback = () => {
    modalColor.value = Animated.withTiming(props.drawerOpen ? 0 : 1, { duration: 200 });
    props.callback();
  }

  let containerStyle = props.drawerOpen ? { top: 200, height: Dimensions.get("window").height - 200 } : { bottom: 0 };
  let modalStyle = Animated.useAnimatedStyle(() => {
    return {
      backgroundColor: Animated.interpolateColor(
        modalColor.value,
        [0, 1],
        ["transparent", "rgba(0, 0, 0, 0.5)"]
      )
    }
  })

  return (
    <Animated.View
      style={[styles.modal, modalStyle]}
      pointerEvents={props.drawerOpen ? "auto" : "box-none"}>
      <View style={[styles.container, containerStyle]}>
        <TouchableWithoutFeedback onPress={preCallback}>
          <View style={styles.header}>
            <Image source={getLogo(props.codes[props.codeIndex].issuer)} style={styles.logo} />
            <View style={{ flex: 1 }}>
              <Text style={styles.issuer}>{props.codes[props.codeIndex].issuer}</Text>
              <Text style={styles.label}>{props.codes[props.codeIndex].label}</Text>
            </View>
            <IconButton
              icon={props.drawerOpen ? "chevron-down" : "chevron-up"}
              size={28}
              color={colours.text}
              style={{ marginRight: -4 }}
              onPress={preCallback} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: "100%",
    height: "100%"
  },
  container: {
    position: "absolute",
    width: "100%",
    backgroundColor: colours.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  header: {
    height: 100,
    width: "100%",
    backgroundColor: colours.backgroundHighlight,
    borderColor: colours.border,
    borderWidth: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    display: "flex",
    flexDirection: "row",
    padding: 24
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderColor: colours.border,
    borderWidth: 1,
    marginRight: 24
  },
  issuer: {
    fontFamily: "Roboto Slab",
    fontSize: 24,
    color: colours.text,
    marginTop: -2
  },
  label: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: colours.text,
    opacity: 0.5,
    overflow: "hidden",
    height: 20
  }
});

export default Drawer;