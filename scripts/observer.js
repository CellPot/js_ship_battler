class Observer {
    constructor() {
        this.subscribers = [];
    }

    subscribe(callback) {
        if (!this.subscribers.includes(callback)) {
            this.subscribers.push(callback);
        }
    }

    unsubscribe(callback) {
        this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback);
    }

    notify(data) {
        this.subscribers.forEach(subscriber => subscriber(data));
    }

    clearSubscribers() {
        this.subscribers.length = 0;
    }
}