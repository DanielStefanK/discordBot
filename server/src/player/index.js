const ytdl = require("ytdl-core-discord");

const status = {
  CONNECTED: 0,
  CONNECTING: 1,
  AUTHENTICATING: 2,
  RECONNECTING: 3,
  DISCONNECTED: 4
};

class QueueItem {
  constructor(url) {
    this.url = url;
  }

  async getStream() {
    return ytdl(this.url);
  }
}

class Player {
  constructor(voiceConnection) {
    this.connection = voiceConnection;
    this.queue = [];
    this.channel = voiceConnection.channel;
    this.currently = null;
  }

  isConnected() {
    return this.connection && this.connection.status === status.CONNECTED;
  }

  disconnect() {
    if (this.isConnected) {
      this.connection.disconnect();
    }
  }

  async play() {
    if (
      this.isConnected() &&
      this.connection.dispatcher &&
      this.connection.dispatcher.paused
    ) {
      this.connection.dispatcher.resume();
    } else if (this.queue.length !== 0) {
      const [current, ...q] = this.queue;
      this.queue = q;
      this.connection.play(await current.getStream(), { type: "opus" });
    }
  }

  pause() {
    if (
      this.isConnected() &&
      this.connection.dispatcher &&
      !this.connection.dispatcher.paused
    ) {
      this.connection.dispatcher.pause();
    }
  }

  async skip() {
    if (this.queue.length !== 0) {
      const [current, ...q] = this.queue;
      this.queue = q;
      this.connection.play(await current.getStream(), { type: "opus" });
    }
  }

  addToQueue(url) {
    this.queue.push(new QueueItem(url));
  }

  async connect() {
    this.connection = await this.channel.join();
  }
}

module.exports = Player;
