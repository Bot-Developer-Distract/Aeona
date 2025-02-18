import { AmethystBot, Context, requireGuildPermissions } from '@thereallonewolf/amethystframework';

export default {
	name: 'softban',
	description: 'Soft ban a user',
	commandType: ['application', 'message'],
	category: 'moderation',
	args: [
		{
			name: 'user',
			description: 'The user to ban.',
			required: true,
			type: 'User',
		},
		{
			name: 'reason',
			description: 'The reason for the ban.',
			required: false,
			type: 'String',
		},
	],
	userGuildPermissions: ['BAN_MEMBERS'],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const member = await client.helpers.getMember(ctx.guild.id, ctx.options.getUser('user', true).id);

		const reason = ctx.options.getString('reason') || 'Not given';

		try {
			requireGuildPermissions(client, ctx.guild, member, ['BAN_MEMBERS']);

			client.extras
				.embed(
					{
						title: `🔨 Ban`,
						desc: `You've been banned in **${ctx.guild.name}**`,
						fields: [
							{
								name: '→ Banned by',
								value: ctx.user.username + '#' + ctx.user.discriminator,
								inline: true,
							},
							{
								name: '→ Reason',
								value: reason,
								inline: true,
							},
						],
					},
					member,
				)
				.then(function () {
					client.helpers.banMember(ctx.guildId!, member.id, {
						reason: reason,
					});

					client.extras.succNormal(
						{
							text: 'The specified user has been successfully banned and successfully received a notification!',
							fields: [
								{
									name: '→ Banned user',
									value: member.user?.username + '#' + member.user?.discriminator,
									inline: true,
								},
								{
									name: '→ Reason',
									value: reason,
									inline: true,
								},
							],
							type: 'editreply',
						},
						ctx,
					);
				})
				.catch(function () {
					client.helpers.banMember(ctx.guildId!, member.id, {
						reason: reason,
					});
					client.extras.succNormal(
						{
							text: 'The given user has been successfully banned, but has not received a notification!',
							type: 'editreply',
						},
						ctx,
					);
				});

			setTimeout(() => {
				client.helpers.unbanMember(ctx.guildId!, member.id);
			}, 2000);
		} catch {
			return client.extras.errNormal(
				{
					error: "You can't ban a moderator",
					type: 'editreply',
				},
				ctx,
			);
		}
	},
};
