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
  const tokenPath: string = path.join(__dirname, 'tokens.json');

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

  const userId: string = await authProvider.addUserForToken(tokenData);
  authProvider.addIntentsToUser(userId, ['chat']);

  console.log('Joining channel...', process.env.VITE_TWITCH_CHANNEL);

  interface EmitDuckyBotMessageProps {
    ctx: MessageEvent;
    messageText: string;
  }

  async function emitDuckyBotMessage({
    ctx,
    messageText,
  }: EmitDuckyBotMessageProps): Promise<void> {
    await ctx.reply(messageText);

    setTimeout(() => {
      getSocketServer().emit('message', {
        color: '#FFDB50',
        messageText: messageText,
        username: 'Super_Ducky_Bot',
      });
    }, 1000);
  }

  const bot = new Bot({
    authProvider,
    channels: [process.env.VITE_TWITCH_CHANNEL ?? ''],
  });

  const apiClient = new ApiClient({ authProvider });

  bot.onMessage(async (ctx: MessageEvent): Promise<void> => {
    const messageText: string = String(ctx.text);
    const color: string = (await apiClient.chat.getColorForUser(ctx.userId)) ?? '';
    let command: string = '';

    if (messageText.startsWith('!')) {
      const [ctxCommand, ...args] = messageText.slice(1).split(' ');

      if (ctxCommand === 'color') {
        if (args.length === 1 && /^#?[0-9A-Fa-f]{6}$/.test(args[0])) {
          getSocketServer().emit('message', {
            messageText: `Updated to ${args[0]}`,
            color: args[0],
            command: ctxCommand,
            username: ctx.userDisplayName ?? '',
          });


        } else if (args[0]?.toLowerCase() === 'unset') {
          getSocketServer().emit('message', {
            messageText,
            color,
            command: ctxCommand,
            username: ctx.userDisplayName ?? '',
          });
        } else {
          await ctx.reply(`@${ctx.userDisplayName} Please provide a valid ducking hex color (e.g. #FFD94E).`)
        }
      }

      if (ctxCommand === 'commands') {
        await ctx.reply('Change ducky color with "!color {hexValue}"');
      }
    } else {
      getSocketServer().emit('message', {
        command,
        color,
        messageText,
        username: ctx.userDisplayName ?? '',
      });
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