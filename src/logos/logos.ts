import images from "../images";

export function getLogo(issuer: string) {
  switch (issuer.toLowerCase()) {
    case "google": return images.logos.google;
    case "microsoft": return images.logos.microsoft;
    case "paypal": return images.logos.paypal;
    case "discord": return images.logos.discord;
    case "github": return images.logos.github;
    case "instagram": return images.logos.instagram;
    case "twitter": return images.logos.twitter;
    case "amazon": return images.logos.amazon;
    case "facebook": return images.logos.facebook;
    case "reddit": return images.logos.reddit;
    case "netflix": return images.logos.netflix;
    case "twitch": return images.logos.twitch;
    default: return images.logos.default;
  }
}