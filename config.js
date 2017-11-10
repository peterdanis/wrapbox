const config = Object.create(null);

config.webviews = [
  ["https://inbox.google.com/", "inbox"],
  ["https://outlook.live.com/owa/?path=/calendar/view/Month", "today"],
  ["https://feedly.com/i/latest", "rss_feed"],
  ["https://www.messenger.com", "message"],
];

module.exports = config;
