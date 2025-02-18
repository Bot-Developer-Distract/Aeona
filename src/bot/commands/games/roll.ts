import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'roll',
	description: 'Roll a dice',
	commandType: ['application', 'message'],
	category: 'game',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const result = Math.ceil(Math.random() * 6);

		client.extras.embed(
			{
				title: `Roll`,
				desc: `You rolled ${result}`,
				type: 'editreply',
			},
			ctx,
		);
	},
};
