import dotenv from 'dotenv';
import { Bot } from '@twurple/easy-bot';
import { StaticAuthProvider } from '@twurple/auth';

dotenv.config({ path: '.env-local' });

export async function startDucky(): Promise<void> {
	const clientId: string = process.env.CLIENT_ID ?? '';
	const accessToken: string = process.env.ACCESS_TOKEN ?? '';
	const authProvider = new StaticAuthProvider(clientId, accessToken);

	if (!clientId || !accessToken || !authProvider) {
		console.error('Missing environment variables.');
		process.exit(1);
	}

	const bot = new Bot({ authProvider, channels: [process.env.USERNAME ?? ''] });

	if (!bot) {
		console.error('No bot found.');
	}
}
