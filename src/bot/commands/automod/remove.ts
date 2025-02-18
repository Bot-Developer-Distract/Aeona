import blacklistedWords from '../../Collection/index.js';
import Schema from '../../database/models/blacklist.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'remove',
	description: 'Remove a blacklisted word',
	commandType: ['application', 'message'],
	category: 'automod',
	args: [
		{
			name: 'word',
			description: 'The word to remove from the blacklist. Example: Bruh',
			required: true,
			type: 'String',
		},
	],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const word = ctx.options.getString('word', true);

		Schema.findOne({ Guild: ctx.guildId }, async (err: any, data: { Words: string[] }) => {
			if (!ctx.guild || !ctx.user || !ctx.channel) return;

			if (data) {
				if (!data.Words.includes(word)) {
					return client.extras.errNormal(
						{
							error: `That word doesn't exist in the database!`,
							type: 'editreply',
						},
						ctx,
					);
				}

				const filtered = data.Words.filter((target: string) => target !== word);

				await Schema.findOneAndUpdate(
					{ Guild: ctx.guildId },
					{
						Guild: ctx.guildId,
						Words: filtered,
					},
				);

				blacklistedWords.set(ctx.guildId!, filtered);

				client.extras.succNormal(
					{
						text: `Word is removed from the blacklist!`,
						fields: [
							{
								name: `→ Word`,
								value: `${word}`,
							},
						],
						type: 'editreply',
					},
					ctx,
				);
			} else {
				client.extras.errNormal(
					{
						error: `This guild has not data!`,
						type: 'editreply',
					},
					ctx,
				);
			}
		});
	},
};
