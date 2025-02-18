import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'xmas',
	description: 'See time to xmas',
	commandType: ['application', 'message'],
	category: 'fun',
	args: [],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const today = new Date();
		const xmas = new Date(today.getFullYear(), 11, 24);
		if (today.getMonth() == 11 && today.getDate() > 24) {
			xmas.setFullYear(xmas.getFullYear() + 1);
		}
		const one_day = 1000 * 60 * 60 * 24;
		const daysleft = Math.ceil((xmas.getTime() - today.getTime()) / one_day);
		const days = daysleft + 1;

		client.extras.embed(
			{
				title: `Christmas`,
				desc: `${days} days until Christmas`,
				type: 'editreply',
			},
			ctx,
		);
	},
};

// :copyright: Dotwood Media | All rights reserved
