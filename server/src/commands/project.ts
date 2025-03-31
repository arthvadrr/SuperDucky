import { chatResponses } from '../chatResponses';
import { createBotCommand } from '@twurple/easy-bot';

export const projectCommand = createBotCommand(
	'project',
	async (_params, ctx) => {
		await ctx.reply(chatResponses.project);
	}
);
