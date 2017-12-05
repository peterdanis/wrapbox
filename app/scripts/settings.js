const settings = Object.create(null);
settings.version = "0.1.0";

settings.windowButtonsPosition = "right";
settings.startMaximized = false;
settings.windowWidth = 1200;
settings.windowHeight = 700;
settings.backgroundColor = "#E0E0E0";

settings.webviews = [
  ["https://inbox.google.com/", "inbox"],
  ["https://outlook.live.com/owa/?path=/calendar/view/Month", "today"],
  ["https://feedly.com/i/latest", "rss_feed"],
  ["https://www.messenger.com", "message"],
];

module.exports = settings;
