import React, { Component } from "react";
import { Helmet } from "react-helmet";

import "../styles/base.scss";

export class Privacy extends Component {
  render() {
    return (
      <main>
        <Helmet>
          <title>Authenticate: Privacy Policy and Terms of Service</title>
          <link rel="icon" href="/static/images/favicon.png" />
        </Helmet>

        <header>
          <div>
            <img src="/static/images/favicon.png" />
            <span>Authenticate</span>
          </div>
        </header>

        <section className="privacy">
          <h1>Privacy Policy and Terms of Service</h1>
          <p>
            Effective as of February 3rd, 2022.
          </p>
          <p>
            William Henderson ("us", "we", "our") operates the Authenticate mobile application (the "Service").
          </p>
          <p>
            By using the Service, you agree to the use of your data in accordance with this policy. You also agree to be bound by the Terms of Service.
          </p>

          <h2>Privacy Policy</h2>
          The Service collects anonymous analytical and technical data to improve your experience. This includes crash logs and diagnostics. This data is collected through Google, and you may request its deletion through Google. The only data stored on your device are your two-factor authentication secrets, along with the corresponding names of the providers, user accounts, and whether you have starred the code. These are stored securely in your device's secure data storage location, and depending on your device, may be encrypted. We do not have access to any of your data.

          <h2>Terms of Service</h2>
          By using the Service, you agree to the following terms.

          <ul>
            <li>We are not liable for any loss of data caused by the malfunctioning of the application.</li>
            <li>You are responsible for the security of your two-factor authentication backup codes, which are necessary to regain access to an account if the two-factor authentication secrets were to be lost.</li>
            <li>We are not liable if you become locked out of any account.</li>
          </ul>

          <h2>Contact</h2>
          If you have any questions about this Privacy Policy or our Terms of Service, please email <a href="mailto:authenticate@whenderson.dev">authenticate@whenderson.dev</a>.
        </section>
      </main>
    );
  }
}

export default Privacy;
