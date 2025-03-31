import { chatResponses } from '../chatResponses';
import { createBotCommand } from '@twurple/easy-bot';
import { getSocketServer } from '../socket';

export const projectCommand = createBotCommand(
	'project',
	async (_params, ctx) => {
		await ctx.reply(chatResponses.project);
		getSocketServer().emit('projectMessage', chatResponses.project);
	}
);
