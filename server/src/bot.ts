import { promises as fs } from 'fs';
import { ApiClient } from '@twurple/api';
import { RefreshingAuthProvider, AccessToken } from '@twurple/auth';
import { getSocketServer } from './socket';
import { MessageEvent } from '@twurple/easy-bot';
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

  function emitDuckyBotMessage(ctx: MessageEvent, messageText: string) {
    ctx.reply(messageText);

    getSocketServer().emit('message', {
      messageText: messageText,
      username: 'Super_Ducky_Bot',
      color: '#FFDB50',
    });
  }

  const bot = new Bot({
    authProvider,
    channels: [process.env.VITE_TWITCH_CHANNEL ?? ''],
  });

  const apiClient = new ApiClient({ authProvider });

  bot.onMessage(async (ctx) => {
    const messageText: string = ctx.text;
    const color = (await apiClient.chat.getColorForUser(ctx.userId)) ?? '';
    let command = '';

    if (messageText.startsWith('!')) {
      const [ctxCommand] = messageText.slice(1).split(' ');

      if (ctxCommand === 'walk' || ctxCommand === 'stop') {
        emitDuckyBotMessage(
          ctx,
          `quack! 🐥 ${ctxCommand} @${ctx.userDisplayName}`,
        );
        command = ctxCommand;
      }
    }

    if (
      typeof command === 'string' &&
      typeof color === 'string' &&
      typeof messageText === 'string' &&
      typeof ctx.userDisplayName === 'string'
    ) {
      getSocketServer().emit('message', {
        command,
        color,
        messageText,
        username: ctx.userDisplayName ?? '',
      });
    } else {
      throw new Error('ctx invalid');
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
