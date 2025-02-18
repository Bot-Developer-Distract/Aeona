import { AmethystBot } from '@thereallonewolf/amethystframework';
import { Message } from 'discordeno';
import blacklistedWords from '../../Collection/index.js';
import BlackList from '../../database/models/blacklist.js';

export default async (client: AmethystBot) => {
	client.on('messageCreate', async (bot: AmethystBot, message: Message) => {
		try {
			BlackList.findOne({ Guild: message.guildId }, async (err: any, data: any) => {
				if (data) {
					const lowerMsg = message.content.toLowerCase();
					const splittedMsg = lowerMsg.split(' ');

					let deleting = false;

					await Promise.all(
						splittedMsg.map((content) => {
							try {
								if (blacklistedWords.get(message.guildId!)!.includes(content.toLowerCase())) deleting = true;
							} catch {
								//prevent lint error
							}
						}),
					);

					if (deleting) return client.helpers.deleteMessage(message.channelId, message.id);
				}
			});
		} catch {
			// prevent lint error
		}
	});

	client.on('messageUpdate', async (bot: AmethystBot, oldMessage: Message, newMessage: Message) => {
		if (oldMessage.content === newMessage.content) {
			return;
		}

		try {
			BlackList.findOne({ Guild: oldMessage.guildId }, async (err: any, data: any) => {
				if (data) {
					const lowerMsg = newMessage.content.toLowerCase();
					const splittedMsg = lowerMsg.split(' ');

					let deleting = false;

					await Promise.all(
						splittedMsg.map((content: string) => {
							try {
								if (blacklistedWords.get(newMessage.guildId!)!.includes(content.toLowerCase())) deleting = true;
							} catch {
								//prevent lint error
							}
						}),
					);

					if (deleting) return client.helpers.deleteMessage(newMessage.channelId, newMessage.id);
				}
			});
		} catch {
			//prevent lint error
		}
	});
};
