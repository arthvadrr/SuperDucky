import dotenv from 'dotenv';
import { Bot } from '@twurple/easy-bot';
import { StaticAuthProvider } from '@twurple/auth';
import { projectCommand } from './commands/project';

dotenv.config({ path: '.env-local' });

export async function startDucky(): Promise<void> {
	const clientId: string = process.env.CLIENT_ID ?? '';
	const accessToken: string = process.env.ACCESS_TOKEN ?? '';

	if (!clientId || !accessToken) {
		console.error('Missing environment variables.');
		process.exit(1);
	}

	const authProvider = new StaticAuthProvider(clientId, accessToken);
	const bot = new Bot({
		authProvider,
		channels: [process.env.CHANNEL ?? ''],
		commands: [projectCommand],
	});

	bot.onJoin(() => {
		console.log('Ducky bot joined the channel!');
	});

	bot.onConnect(() => {
		console.log('Connected to Twitch chat');
	});

	bot.onAuthenticationSuccess(() => {
		console.log('Authenticated with Twitch');
	});
}
