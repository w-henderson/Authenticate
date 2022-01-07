import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
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
  callback: () => void,
  selectCode: (index: number) => void,
  deleteCode: (index: number) => void,
  toggleStarred: (index: number) => void
}

function Drawer(props: DrawerProps) {
  let modalColor = Animated.useSharedValue(0);

  const preCallback = () => {
    modalColor.value = Animated.withTiming(props.drawerOpen ? 0 : 1, { duration: 200 });
    props.callback();
  }

  const preSelectCode = (index: number) => {
    modalColor.value = Animated.withTiming(props.drawerOpen ? 0 : 1, { duration: 200 });
    props.selectCode(index);
  }

  let containerStyle = props.drawerOpen ? { top: 200, height: Dimensions.get("window").height - 200 } : { bottom: 0, height: 100 };
  let modalStyle = Animated.useAnimatedStyle(() => {
    return {
      backgroundColor: Animated.interpolateColor(
        modalColor.value,
        [0, 1],
        ["transparent", "rgba(0, 0, 0, 0.5)"]
      )
    }
  });

  let codes = props.codes.map((code, key) => { return { code, key: key.toString() } });
  let starredCodes = codes.filter(code => code.code.starred);
  let unstarredCodes = codes.filter(code => !code.code.starred);
  codes = starredCodes.concat(unstarredCodes);

  // The key field represents the index stored on disk.
  // The actual order represents the order in memory, respecting stars.

  return (
    <Animated.View
      style={[styles.modal, modalStyle]}
      pointerEvents={props.drawerOpen ? "auto" : "box-none"}>
      <View style={[styles.container, containerStyle]}>
        <TouchableWithoutFeedback onPress={preCallback}>
          <View style={[styles.header, { borderBottomWidth: props.drawerOpen ? 1 : 0 }]}>
            <Image source={getLogo(codes[props.codeIndex].code.issuer)} style={styles.logo} />
            <View style={{ flex: 1 }}>
              <Text style={styles.issuer}>{codes[props.codeIndex].code.issuer}</Text>
              <Text style={styles.label}>{codes[props.codeIndex].code.label}</Text>
            </View>
            <IconButton
              icon={props.drawerOpen ? "chevron-down" : "chevron-up"}
              size={28}
              color={colours.text}
              style={{ marginRight: -4 }}
              onPress={preCallback} />
          </View>
        </TouchableWithoutFeedback>

        {props.drawerOpen &&
          <FlatList
            data={codes}
            contentContainerStyle={styles.listContainer}
            renderItem={data => (
              <TouchableNativeFeedback onPress={() => preSelectCode(data.index)}>
                <View style={styles.code}>
                  <Image source={getLogo(data.item.code.issuer)} style={styles.logo} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.issuer}>{data.item.code.issuer}</Text>
                    <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">{data.item.code.label}</Text>
                  </View>
                  <IconButton
                    icon={"trash-can-outline"}
                    size={28}
                    color={colours.text}
                    style={{ marginRight: -4 }}
                    onPress={() => props.deleteCode(parseInt(data.item.key))} />
                  <IconButton
                    icon={data.item.code.starred ? "star" : "star-outline"}
                    size={28}
                    color={data.item.code.starred ? "gold" : colours.text}
                    style={{ marginRight: -4 }}
                    onPress={() => props.toggleStarred(parseInt(data.item.key))} />
                </View>
              </TouchableNativeFeedback>
            )} />
        }
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: "100%",
    height: "100%"
  },
  listContainer: {
    paddingVertical: 12
  },
  container: {
    position: "absolute",
    width: "100%",
    backgroundColor: colours.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32
  },
  code: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 24
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
    padding: 24,
    elevation: 4
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