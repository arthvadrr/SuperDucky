import { promises as fs } from 'fs';
import { RefreshingAuthProvider, AccessToken } from '@twurple/auth';
import { getSocketServer } from './socket';
import { Bot } from '@twurple/easy-bot';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.server.local') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.shared.local') });

export async function startDucky(): Promise<void> {
  const clientId: string = process.env.CLIENT_ID ?? '';
  const clientSecret: string = process.env.CLIENT_SECRET ?? '';
  const accessToken: string = process.env.ACCESS_TOKEN ?? '';
  const refreshToken: string = process.env.REFRESH_TOKEN ?? '';
  const tokenPath = path.join(__dirname, 'tokens.json');

  if (
    !clientId ||
    !clientSecret ||
    !accessToken ||
    !refreshToken ||
    !tokenPath
  ) {
    console.error('Missing environment variables.');
    process.exit(1);
  }

  /**
   * Token init
   */
  const tokenData = {
    accessToken,
    refreshToken,
    expiresIn: 0,
    obtainmentTimestamp: Date.now(),
  };

  /**
   * Saves the initial token data to tokens.json
   */
  try {
    await fs.writeFile(tokenPath, JSON.stringify(tokenData, null, 4), 'utf-8');
  } catch (error) {
    console.error('Failed to save initial token data:', error);
    process.exit(1);
  }

  console.log('Starting SuperDucky...');

  const authProvider = new RefreshingAuthProvider({
    clientId,
    clientSecret,
  });

  /**
   * Handles writing the refreshed token to tokens.json
   */
  authProvider.onRefresh(
    async (userId: string, newTokenData: AccessToken): Promise<void> => {
      try {
        await fs.writeFile(
          tokenPath,
          JSON.stringify(newTokenData, null, 4),
          'utf-8',
        );
        console.log('Tokens refreshed successfully');
      } catch (error) {
        console.error('Failed to save refreshed tokens:', error);
      }
    },
  );

  const userId = await authProvider.addUserForToken(tokenData);
  authProvider.addIntentsToUser(userId, ['chat']);

  console.log('Joining channel...', process.env.VITE_TWITCH_CHANNEL);

  const bot = new Bot({
    authProvider,
    channels: [process.env.VITE_TWITCH_CHANNEL ?? ''],
  });

  bot.onMessage((ctx) => {
    const messageText: string = ctx.text;

    console.log('bot.onMessage!', messageText);

    if (messageText.startsWith('!')) {
      const [command, ...args] = messageText.slice(1).split(' ');

      if (command === 'walk' || command === 'move' || command === 'go') {
        ctx.reply('quack! 🐥');

        /**
         * TODO set up args
         */
        getSocketServer().emit('message', {
          command: 'walk',
          username: ctx.userDisplayName,
        });
      }
    }
  });

  /**
   * Connection logging
   */
  bot.onJoin(() => {
    console.log('Ducky bot joined the channel!');
  });

  bot.onConnect(() => {
    console.log('Connected to Twitch chat');
  });

  bot.onAuthenticationSuccess(() => {
    console.log('Authenticated with Twitch');

    bot.onDisconnect((manually, reason) => {
      console.error(`Disconnected. Manual: ${manually}. Reason: ${reason}`);
    });

    bot.onAuthenticationFailure((message, retryCount) => {
      console.error(`Auth failed: ${message}. Retry #${retryCount}`);
    });
  });
}
