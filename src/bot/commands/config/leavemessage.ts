import inviteMessages from '../../database/models/inviteMessages.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'leavemessage',
	description: 'Set the leave message',
	commandType: ['application', 'message'],
	category: 'config',
	args: [
		{
			name: 'message',
			description: '<message>/help/default',
			required: true,
			type: 'String',
		},
	],
	userGuildPermissions: ['MANAGE_GUILD'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;

		const message = ctx.options.getLongString('message', true);
		if (!message) return;

		if (message.toLowerCase() == 'help') {
			return client.extras.embed(
				{
					title: `Welcome message options`,
					desc: `Leave message options: \n
            \`{user:username}\` - User's username
            \`{user:discriminator}\` - User's discriminator
            \`{user:tag}\` - User's tag
            \`{user:mention}\` - Mention a user

            \`{inviter:username}\` - inviter's username
            \`{inviter:discriminator}\` - inviter's discriminator
            \`{inviter:tag}\` - inviter's tag
            \`{inviter:mention}\` - inviter's mention
            \`{inviter:invites}\` - inviter's invites
            \`{inviter:invites:left}\` - inviter's left invites
            
            \`{guild:name}\` - Server name
            \`{guild:members}\` - Server members count`,
					type: 'editreply',
				},
				ctx,
			);
		}

		if (message.toUpperCase() == 'default') {
			inviteMessages.findOne({ Guild: ctx.guildId }, async (err, data) => {
				if (data) {
					data.inviteLeave = null;
					data.save();

					client.extras.succNormal(
						{
							text: `Leave message deleted!`,
							type: 'editreply',
						},
						ctx,
					);
				}
			});
		} else {
			inviteMessages.findOne({ Guild: ctx.guildId }, async (err, data) => {
				if (!ctx.guild) return;
				if (data) {
					data.inviteLeave = message;
					data.save();
				} else {
					new inviteMessages({
						Guild: ctx.guildId,
						inviteLeave: message,
					}).save();
				}

				client.extras.succNormal(
					{
						text: `The leave message has been set successfully`,
						fields: [
							{
								name: `→ Message`,
								value: `${message}`,
								inline: true,
							},
						],
						type: 'editreply',
					},
					ctx,
				);
			});
		}
	},
};
