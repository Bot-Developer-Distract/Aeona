import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'epicgamerrate',
	description: 'See how much of a epic gamer are you',
	commandType: ['application', 'message'],
	category: 'fun',
	args: [
		{
			name: 'user',
			description: 'The user to hack',
			required: false,
			type: 'String',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const result = Math.ceil(Math.random() * 100);

		client.extras.embed(
			{
				title: `Epic gamer rate`,
				desc: `You are ${result}% epic gamer!`,
				type: 'editreply',
			},
			ctx,
		);
	},
};
