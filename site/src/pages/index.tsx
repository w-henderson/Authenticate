import React, { Component } from "react";
import { Helmet } from "react-helmet";

import DownloadButton from "../components/DownloadButton";

import "../styles/base.scss";

interface ScrollAnimations {
  heroAnimated: boolean,
  drawerAnimated: boolean,
  welcomeAnimated: boolean
}

class Index extends Component<{}, ScrollAnimations> {
  drawerRef: React.RefObject<HTMLImageElement>;
  welcomeRef: React.RefObject<HTMLImageElement>;
  sectionRef: React.RefObject<HTMLElement>;
  downloadRef: React.RefObject<HTMLElement>;

  constructor(props: {}) {
    super(props);

    this.state = {
      heroAnimated: true,
      drawerAnimated: false,
      welcomeAnimated: false
    };

    this.drawerRef = React.createRef();
    this.welcomeRef = React.createRef();
    this.sectionRef = React.createRef();
    this.downloadRef = React.createRef();

    this.handleScrollAnimation = this.handleScrollAnimation.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScrollAnimation);

    switch (window.location.hash) {
      case "#features": return this.sectionRef.current!.scrollIntoView();
      case "#download": return this.downloadRef.current!.scrollIntoView();
    }
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
            <li><a href="#features" onClick={() => this.sectionRef.current!.scrollIntoView({ behavior: "smooth" })}>Features</a></li>
            <li><a href="#download" onClick={() => this.downloadRef.current!.scrollIntoView({ behavior: "smooth" })}>Download</a></li>
          </ul>
        </header>

        <section className="hero">
          <div className="text">
            <h1>Secure your accounts with <span>Authenticate.</span></h1>
            <p>Open-source, easy-to-use and completely free for all your two-factor authentication needs.</p>
            <DownloadButton />
          </div>

          <div className="image">
            <img src="/static/images/mockup.webp" alt="Screenshot" style={this.state.heroAnimated ? visible : hidden} />
          </div>
        </section>

        <section ref={this.sectionRef}>
          <div className="text">
            <h1><span>Unlimited accounts,</span> unlimited security.</h1>
            <p>
              Authenticate lets you secure as many accounts as you want, as well as keeping the most important ones at the top.
            </p>
          </div>

          <div className="image">
            <img src="/static/images/drawer.webp" alt="Screenshot" ref={this.drawerRef} style={this.state.drawerAnimated ? visible : hidden} />
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
            <img src="/static/images/welcome.webp" alt="Screenshot" ref={this.welcomeRef} style={this.state.welcomeAnimated ? visible : hidden} />
          </div>
        </section>

        <section ref={this.downloadRef}>
          <div className="text">
            <h1>Download <span>Authenticate</span> now!</h1>
            <p style={{ opacity: 1 }}>
              <DownloadButton />
            </p>
          </div>
        </section>
      </main>
    );
  }
}

export default Index;