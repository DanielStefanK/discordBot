const { ApolloError } = require("apollo-server");
const ytdl = require("ytdl-core-discord");

let players = {};

const Player = require("../player");

const {
  mapGuild,
  mapChannel,
  channelTypes,
  mapVoiceConnection
} = require("../utils/dicordUtils");

module.exports = {
  Query: {
    guilds: (parent, args, { discord }) => {
      return discord.guilds.map(mapGuild);
    },

    voiceConnections: (parent, args, { discord }) => {
      const vM = discord.voice;

      if (!vM) throw new ApolloError("no manager");

      return vM.connections.map((c, id) => {
        return mapVoiceConnection(c, id);
      });
    }
  },

  Mutation: {
    joinChannel: async (parent, { channelId }, { discord }) => {
      const channel = await discord.channels.fetch(channelId);

      if (!channel) throw new ApolloError("channel not found");

      if (channel.type !== channelTypes.VOICE)
        throw new ApolloError("channel must be type voice");

      if (!channel.joinable) throw new ApolloError("channel is not joinable");

      if (players[channelId]) {
        players[channelId].connect();
      } else {
        let connection = await channel.join().catch(() => {
          throw new ApolloError("channel is not joinable");
        });

        players = {
          ...players,
          [channelId]: new Player(connection)
        };
      }

      return mapChannel(channel);
    },

    leaveChannel: async (parent, { channelId }, { discord }) => {
      const player = players[channelId];

      if (player) {
        player.disconnect();
      }

      players[channelId];

      return mapChannel(player.channel);
    },

    addUrlToQueue: async (parent, { channelId, url }, { discord }) => {
      const player = players[channelId];

      if (!player) throw new ApolloError("no player found");

      player.addToQueue(url);
      return mapChannel(player.channel);
    },

    skip: async (parent, { channelId }, { discord }) => {
      const player = players[channelId];

      if (!player) throw new ApolloError("no player found");

      player.skip();
      return mapChannel(player.channel);
    },

    play: async (parent, { channelId }, { discord }) => {
      const player = players[channelId];

      if (!player) throw new ApolloError("no player found");

      player.play();
      return mapChannel(player.channel);
    },

    pause: async (parent, { channelId }, { discord }) => {
      const player = players[channelId];

      if (!player) throw new ApolloError("no player found");

      player.pause();
      return mapChannel(player.channel);
    }
  },

  Guild: {
    channels: (parent, { type }, { discord }) => {
      return discord.guilds
        .get(parent._id)
        .channels.filter(c => (type ? c.type === type : true))
        .map(mapChannel);
    }
  }
};
