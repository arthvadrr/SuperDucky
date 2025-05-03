import path from 'path';
import dotenv from 'dotenv';
import { getSocketServer } from './socket';
import { promises as fs } from 'fs';
import { ApiClient } from '@twurple/api';
import { RefreshingAuthProvider, AccessToken } from '@twurple/auth';
import { MessageEvent } from '@twurple/easy-bot';
import { Bot } from '@twurple/easy-bot';
import { Excerpt } from "./api/v1/router";

dotenv.config({ path: path.resolve(__dirname, '../../.env.server.local') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.shared.local') });

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&comma;/g, ',')
    .replace(/&apos;/g, '\'')
    .replace(/&ndash;/g, '-')
}

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
    async (_: string, newTokenData: AccessToken): Promise<void> => {
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

  /**
   * Set Interval to purge users
   */
  setInterval((): void => {
    getSocketServer().emit('purge');
  }, 10000);


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

  /**
   * Handles a message from the chat
   */
  bot.onMessage(async (ctx: MessageEvent): Promise<void> => {
    const messageText: string = String(ctx.text);
    const color: string = (await apiClient.chat.getColorForUser(ctx.userId)) ?? '';
    let command: string = '';

    if (messageText.startsWith('!')) {
      const [ctxCommand, ...args] = messageText.slice(1).split(' ');

      if (ctxCommand === 'duckylore') {
        const excerpt_res: Response = await fetch(`http://${process.env.VITE_SERVER_HOST}:${process.env.VITE_SERVER_PORT}/api/v1/random-excerpt`);

        if (excerpt_res.ok) {
          const excerpt: Excerpt = await excerpt_res.json();

          const messageText: string = `
          ${decodeHtmlEntities(excerpt?.book_excerpt ?? '')}
          
          – ${excerpt?.book_title}, by ${excerpt?.book_author}, ${excerpt?.book_author_role} ${excerpt?.book_author_race}`

          await emitDuckyBotMessage({ ctx, messageText })

          console.log(`Excerpt: ${JSON.stringify(excerpt)}`);
        }
      }

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
        await ctx.reply('!color {hexValue}, !duckylore');
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