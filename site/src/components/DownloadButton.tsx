import React, { Component } from "react";

export class DownloadButton extends Component {
  render() {
    return (
      <a href="https://play.google.com/store/apps/details?id=com.whenderson.authenticate">
        <img
          src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
          alt="Google Play"
          style={{
            width: "192px",
            margin: "-12px",
          }} />
      </a>
    );
  }
}

export default DownloadButton;