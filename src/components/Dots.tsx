import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colours from "../colours";

interface DotsProps {
  dotsCount: number,
  selectedDot: number
}

class Dots extends React.Component<DotsProps> {
  render() {
    let dots = [];
    for (let i = 0; i < this.props.dotsCount; i++) {
      if (i === this.props.selectedDot) dots.push(<View style={[styles.dot, styles.selected]} key={i} />);
      else dots.push(<View style={styles.dot} key={i} />);
    }

    return (
      <View style={styles.container}>
        {dots}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 116,
    width: "100%",
    height: 8,
    display: "flex",
    justifyContent: "center",
    flexDirection: "row"
  },
  dot: {
    width: 8,
    height: 8,
    marginHorizontal: 6,
    borderRadius: 4,
    backgroundColor: colours.border
  },
  selected: {
    backgroundColor: colours.accent1
  }
});

export default Dots;