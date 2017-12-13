class Mediator {
  constructor() {
    this.channels = {};
  }
  subscribe(channel, element, fn) {
    this.channels.channel = this.channels.channel || [];
    this.channels.channel.push(element);
  }
  unsubscribe() {}
  send(channel, message) {
    this.channels.channel.forEach(subscriber => {
      subscriber.update()
    });
  }
}

module.exports = Mediator;
