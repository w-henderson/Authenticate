import React from "react";
import { View, ViewStyle } from "react-native";
import colours from "../colours";

interface CountdownAnimationProps {
  interval: number,
  calculateTimeUntilUpdate: () => number
}

interface CountdownAnimationState {
  timeUntilUpdate: number
}

class CountdownAnimation extends React.Component<CountdownAnimationProps, CountdownAnimationState> {
  updateInterval: NodeJS.Timeout | null;

  constructor(props: CountdownAnimationProps) {
    super(props);
    this.state = { timeUntilUpdate: this.props.calculateTimeUntilUpdate() };
    this.updateInterval = null;
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.updateInterval = setInterval(this.update, 1000 / 15);
  }

  update() {
    this.setState({ timeUntilUpdate: this.props.calculateTimeUntilUpdate() });
  }

  componentWillUnmount() {
    if (this.updateInterval) clearInterval(this.updateInterval);
  }

  render() {
    let remainingStyle: ViewStyle = {
      width: `${(this.state.timeUntilUpdate / this.props.interval) * 0.1}%`,
      height: 8,
      backgroundColor: colours.backgroundHighlight2,
      position: "absolute",
      bottom: 0,
      borderRadius: 16
    };

    return (<View style={remainingStyle} />);
  }
}

export default CountdownAnimation;