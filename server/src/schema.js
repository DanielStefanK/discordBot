const { gql } = require("apollo-server");

module.exports = gql`
  type Query {
    guilds: [Guild]
    voiceConnections: [VoiceConnection]
  }

  type Mutation {
    joinChannel(channelId: ID!): Channel
    leaveChannel(channelId: ID!): Channel
    addUrlToQueue(channelId: ID!, url: String!): Channel
    skip(channelId: ID!): Channel
    play(channelId: ID!): Channel
    pause(channelId: ID!): Channel
  }

  type Guild {
    _id: ID!
    name: String!
    channels(type: ChannelType): [Channel!]!
  }

  type Channel {
    _id: ID!
    guild: Guild
    name: String!
    type: ChannelType!
  }

  type VoiceConnection {
    _id: ID!
    channel: Channel!
  }

  enum ChannelType {
    dm
    text
    voice
    category
    news
    store
    unknown
  }
`;
