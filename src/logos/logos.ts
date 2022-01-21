import images from "../images";

const ENABLE_BRANDED_LOGOS = false;

export function getLogo(issuer: string) {
  if (ENABLE_BRANDED_LOGOS) {
    switch (issuer.toLowerCase()) {
      case "google": return images.logos.branded.google;
      case "microsoft": return images.logos.branded.microsoft;
      case "paypal": return images.logos.branded.paypal;
      case "discord": return images.logos.branded.discord;
      case "github": return images.logos.branded.github;
      case "instagram": return images.logos.branded.instagram;
      case "twitter": return images.logos.branded.twitter;
      case "amazon": return images.logos.branded.amazon;
      case "facebook": return images.logos.branded.facebook;
      case "reddit": return images.logos.branded.reddit;
      case "netflix": return images.logos.branded.netflix;
      case "twitch": return images.logos.branded.twitch;
      default: return images.logos.default;
    }
  } else {
    let firstChar = issuer.toLowerCase().charAt(0);
    return (images.logos.letters as any)[firstChar] || images.logos.default;
  }
}