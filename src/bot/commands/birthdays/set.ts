import Schema from '../../database/models/birthday.js';

import { AmethystBot, Context } from '@thereallonewolf/amethystframework';
export default {
	name: 'set',
	description: 'Set your birthdate.',
	commandType: ['application', 'message'],
	category: 'birthdays',
	args: [
		{
			name: 'day',
			description: 'The day of the month you where born in',
			required: true,
			type: 'String',
		},
		{
			name: 'month',
			description: 'The month you where born in',
			required: true,
			type: 'String',
		},
	],
	async execute(client: AmethystBot, ctx: Context) {
		if (!ctx.guild || !ctx.user || !ctx.channel) return;
		const months = {
			1: 'January',
			2: 'February',
			3: 'March',
			4: 'April',
			5: 'May',
			6: 'June',
			7: 'July',
			8: 'August',
			9: 'September',
			10: 'October',
			11: 'November',
			12: 'December',
		};

		const day = ctx.options.getNumber('day', true);
		const month = ctx.options.getNumber('month', true);

		if (!day || day > 31)
			return client.extras.errNormal(
				{
					error: 'Wrong day format!',
					type: 'editreply',
				},
				ctx,
			);

		if (!month || month > 12)
			return client.extras.errNormal(
				{
					error: 'Wrong month format!',
					type: 'editreply',
				},
				ctx,
			);

		const convertedDay = suffixes(day);
		const convertedMonth = months[month];
		const birthdayString = `${convertedDay} of ${convertedMonth}`;

		Schema.findOne({ Guild: ctx.guildId, User: ctx.user.id }, async (err, data) => {
			if (!ctx.guild || !ctx.user || !ctx.channel) return;

			if (data) {
				data.Birthday = birthdayString;
				data.save();
			} else {
				new Schema({
					Guild: ctx.guildId,
					User: ctx.user.id,
					Birthday: birthdayString,
				}).save();
			}
		});

		client.extras.succNormal(
			{
				text: `Birthday has been set successfully`,
				fields: [
					{
						name: `${client.extras.emotes.normal.birthday} Birthday`,
						value: `${birthdayString}`,
					},
				],
				type: 'editreply',
			},
			ctx,
		);
	},
};

function suffixes(number) {
	const converted = number.toString();

	const lastChar = converted.charAt(converted.length - 1);

	return lastChar == '1'
		? `${converted}st`
		: lastChar == '2'
		? `${converted}nd`
		: lastChar == '3'
		? `${converted}rd`
		: `${converted}th`;
}
