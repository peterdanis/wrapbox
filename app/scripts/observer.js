class Observer {
  constructor() {
    this.subcribers = [];
  }
  subscribe(element) {
    this.subcribers.push(element)
  }
  unsubscribe() {}
  notify() {}
}

module.exports = Observer;
