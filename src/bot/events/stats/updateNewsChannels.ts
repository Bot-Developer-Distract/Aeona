import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Channel, Guild } from 'discordeno/transformers';
import { ChannelTypes } from 'discordeno/types';

import Schema from '../../database/models/stats.js';

export default async (client: AmethystBot, channel: Channel, guild: Guild) => {
	if (channel.type == ChannelTypes.GuildAnnouncement) {
		try {
			let channelName = await client.extras.getTemplate(guild.id);
			const channels = await client.helpers.getChannels(guild.id);
			channelName = channelName.replace(`{emoji}`, '📢');
			channelName = channelName.replace(
				`{name}`,
				`News Channels: ${channels.filter((channel) => channel.type === ChannelTypes.GuildAnnouncement).size || 0}`,
			);

			const data = await Schema.findOne({ Guild: guild.id });
			client.helpers.editChannel(data.NewsChannels, {
				name: channelName,
			});
		} catch {
			//Fix lint error
		}
	}
};
