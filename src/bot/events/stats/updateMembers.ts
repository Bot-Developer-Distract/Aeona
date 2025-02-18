import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Guild } from 'discordeno';
import Schema from '../../database/models/stats.js';

export default async (client: AmethystBot, guild: Guild) => {
	try {
		let channelName = await client.extras.getTemplate(guild.id);
		channelName = channelName.replace(`{emoji}`, '👤');
		channelName = channelName.replace(`{name}`, `Members: ${guild.memberCount.toLocaleString()}`);

		const data = await Schema.findOne({ Guild: guild.id });
		client.helpers.editChannel(data.Members, {
			name: channelName,
		});
	} catch {
		//Fix lint error
	}
};
