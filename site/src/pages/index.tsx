import React, { Component } from "react";
import { Helmet } from "react-helmet";

import "../styles/base.scss";

interface ScrollAnimations {
  heroAnimated: boolean,
  drawerAnimated: boolean,
  welcomeAnimated: boolean
}

class Index extends Component<{}, ScrollAnimations> {
  drawerRef: React.RefObject<HTMLImageElement>;
  welcomeRef: React.RefObject<HTMLImageElement>;

  constructor(props: {}) {
    super(props);

    this.state = {
      heroAnimated: true,
      drawerAnimated: false,
      welcomeAnimated: false
    };

    this.drawerRef = React.createRef();
    this.welcomeRef = React.createRef();

    this.handleScrollAnimation = this.handleScrollAnimation.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScrollAnimation);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScrollAnimation);
  }

  handleScrollAnimation() {
    let y: number = window.scrollY;

    let heroAnimated = true;
    let drawerAnimated = y > this.drawerRef!.current!.y || this.state.drawerAnimated;
    let welcomeAnimated = y > this.welcomeRef!.current!.y || this.state.welcomeAnimated;

    this.setState({
      heroAnimated,
      drawerAnimated,
      welcomeAnimated
    });
  }

  render() {
    let visible = {
      animation: "animateIn 0.8s ease forwards",
      transform: "translateY(50px)",
      opacity: "0",
    };

    let hidden = {
      opacity: "0",
    };

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
            <img src="/static/images/mockup.png" alt="Screenshot" style={this.state.heroAnimated ? visible : hidden} />
          </div>
        </section>

        <section>
          <div className="text">
            <h1><span>Unlimited accounts,</span> unlimited security.</h1>
            <p>
              Authenticate lets you secure as many accounts as you want, as well as keeping the most important ones at the top.
            </p>
          </div>

          <div className="image">
            <img src="/static/images/drawer.png" alt="Screenshot" ref={this.drawerRef} style={this.state.drawerAnimated ? visible : hidden} />
          </div>
        </section>

        <section>
          <div className="text">
            <h1><span>Two-factor authentication</span> shouldn't be hard.</h1>
            <p>
              That's why Authenticate is built to be easy to use and easy to understand, without compromising on functionality or security.
            </p>
          </div>

          <div className="image">
            <img src="/static/images/welcome.png" alt="Screenshot" ref={this.welcomeRef} style={this.state.welcomeAnimated ? visible : hidden} />
          </div>
        </section>
      </main>
    );
  }
}

export default Index;