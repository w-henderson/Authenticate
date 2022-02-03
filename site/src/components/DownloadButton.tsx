import React, { Component } from "react";

export class DownloadButton extends Component {
  render() {
    return <img
      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
      alt="Google Play"
      title="Coming Soon"
      style={{
        width: "192px",
        margin: "-12px",
        filter: "grayscale(100%)",
        opacity: 0.5,
        cursor: "not-allowed"
      }} />;
  }
}

export default DownloadButton;