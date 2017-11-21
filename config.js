const config = Object.create(null);

config.startMaximized = false;
config.windowWidth = 1200;
config.windowHeight = 700;
config.backgroundColor = "#E0E0E0";

config.webviews = [
  ["https://inbox.google.com/", "inbox"],
  ["https://outlook.live.com/owa/?path=/calendar/view/Month", "today"],
  ["https://feedly.com/i/latest", "rss_feed"],
  ["https://www.messenger.com", "message"],
];

module.exports = config;
