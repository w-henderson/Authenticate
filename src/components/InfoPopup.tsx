import React from "react";
import { Dimensions, Modal, StyleSheet, Text, View } from "react-native";
import { IconButton } from "react-native-paper";
import colours from "../colours";

interface InfoPopupProps {
  visible: boolean,
  message: string,
  dismissCallback: () => void
}

class InfoPopup extends React.Component<InfoPopupProps> {
  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.dismissCallback} >
        <View style={styles.view}>
          <Text style={styles.text}>{this.props.message}</Text>
          <View style={styles.buttonView}>
            <IconButton
              icon="close"
              onPress={this.props.dismissCallback}
              color={colours.text}
              style={styles.button}
              size={28} />
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  view: {
    position: "absolute",
    bottom: 24,
    left: 24,
    minHeight: 72,
    width: Dimensions.get("window").width - 48,
    backgroundColor: colours.backgroundHighlight2,
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    padding: 21
  },
  text: {
    fontSize: 20,
    color: colours.text,
    fontFamily: "Roboto",
    flex: 1,
    opacity: 0.9
  },
  buttonView: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8
  },
  button: {
    margin: -6
  }
});

export default InfoPopup;