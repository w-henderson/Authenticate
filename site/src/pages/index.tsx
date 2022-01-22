import React, { Component } from "react";
import { Helmet } from "react-helmet";

import "../styles/base.scss";

class Index extends Component {
  render() {
    return (
      <main>
        <Helmet>
          <title>Authenticate</title>
          <link rel="icon" href="/static/images/favicon.png" />
        </Helmet>

        <header>
          <div>
            <img src="/static/images/favicon.png" />
            <span>Authenticate</span>
          </div>

          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Features</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Download</a></li>
          </ul>
        </header>

        <section className="hero">
          <div className="text">
            <h1>Secure your accounts with <span>Authenticate.</span></h1>
            <p>Open-source, easy-to-use and completely free for all your two-factor authentication needs.</p>
            <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Google Play" />
          </div>

          <div className="image">
            <img src="/static/images/mockup.png" alt="Screenshot" />
          </div>
        </section>
      </main>
    );
  }
}

export default Index;