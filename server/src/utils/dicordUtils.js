const mapGuild = g => ({
  _id: g.id,
  name: g.name
});

const mapChannel = c => ({
  _id: c.id,
  name: c.name,
  type: c.type,
  guild: c.guild ? mapGuild(c.guild) : null
});

const mapVoiceConnection = (c, id) => ({
  channel: mapChannel(c.channel),
  _id: id
});

const joinChannel = async (channelId, discord) => {
  const channel = await discord.channels.fetch(channelId);

  if (!channel) throw new ApolloError("channel not found");

  if (channel.type !== channelTypes.VOICE)
    throw new ApolloError("channel must be type voice");

  if (!channel.joinable) throw new ApolloError("channel is not joinable");

  return channel.join();
};

const findConnection = (channelId, discord) => {
  const vM = discord.voice;

  if (!vM) throw new ApolloError("no manager");

  return vM.connections.find(c => c.channel.id === channelId);
};

const channelTypes = {
  DM: "dm",
  TEXT: "text",
  VOICE: "voice",
  CATEGORY: "category",
  NEWS: "news",
  STORE: "store",
  UNKNOWN: "unknown"
};

module.exports = {
  mapGuild,
  mapChannel,
  channelTypes,
  mapVoiceConnection,
  findConnection,
  joinChannel
};
