const settings = Object.create(null);
settings.version = "0.1.0";

settings.windowButtonsPosition = "right";
settings.startMaximized = false;
settings.windowWidth = 1200;
settings.windowHeight = 700;
settings.backgroundColor = "#E0E0E0";

settings.webviews = [
  { url: "https://inbox.google.com/", icon: "inbox" },
  { url: "https://outlook.live.com/owa/?path=/calendar/view/Month", icon: "today" },
  { url: "https://feedly.com/i/latest", icon: "rss_feed" },
  { url: "https://www.messenger.com", icon: "message" },
];

module.exports = settings;
