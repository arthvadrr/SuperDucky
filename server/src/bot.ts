import path from 'path';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import { RefreshingAuthProvider, AccessToken } from '@twurple/auth';
import { MessageEvent, Bot } from '@twurple/easy-bot';
import { ApiClient } from '@twurple/api';
import { getSocketServer, setMegaDuckyCallback } from './socket';
import {
  createTask,
  completeTask,
  likeTask,
  deleteTask,
  purgeOldTasks,
  purgeCompletedTasks,
} from './db/tasks';

dotenv.config({ path: path.resolve(__dirname, '../../.env.shared.local') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.server.local') });

export async function startDucky(): Promise<void> {
  const clientId: string = process.env.CLIENT_ID ?? '';
  const clientSecret: string = process.env.CLIENT_SECRET ?? '';
  const accessToken: string = process.env.ACCESS_TOKEN ?? '';
  const refreshToken: string = process.env.REFRESH_TOKEN ?? '';
  const tokenPath: string = path.join(__dirname, 'tokens.json');

  if (!clientId || !clientSecret || !accessToken || !refreshToken || !tokenPath) {
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
  authProvider.onRefresh(async (_: string, newTokenData: AccessToken): Promise<void> => {
    try {
      await fs.writeFile(tokenPath, JSON.stringify(newTokenData, null, 4), 'utf-8');
      console.log('Tokens refreshed successfully');
    } catch (error) {
      console.error('Failed to save refreshed tokens:', error);
    }
  });

  const userId: string = await authProvider.addUserForToken(tokenData);
  authProvider.addIntentsToUser(userId, ['chat']);

  console.log('Joining channel...', process.env.VITE_TWITCH_CHANNEL);

  interface EmitDuckyBotMessageProps {
    ctx: MessageEvent;
    messageText: string;
  }

  /**
   * Set Interval to purge users and old tasks
   */
  setInterval((): void => {
    getSocketServer().emit('purge');

    const purgedUsers = purgeOldTasks();
    purgedUsers.forEach((username) => {
      getSocketServer().emit('tasks:deleted', { username });
    });

    const purgedCompleted = purgeCompletedTasks();
    purgedCompleted.forEach((username) => {
      getSocketServer().emit('tasks:deleted', { username });
    });
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

  setMegaDuckyCallback(async (username: string) => {
    await bot.say(
      process.env.VITE_TWITCH_CHANNEL ?? '',
      `🌟 QUAAACK!!! 🌟 ${username} has evolved into a MEGA DUCKY! Bow before their glorious waddle! 🦆👑✨`,
    );
  });

  /**
   * Handles a message from the chat
   */
  bot.onMessage(async (ctx: MessageEvent): Promise<void> => {
    const messageText: string = String(ctx.text);
    const color: string = (await apiClient.chat.getColorForUser(ctx.userId)) ?? '';
    let command: string = '';

    if (messageText.startsWith('!')) {
      const [ctxCommand, ...args] = messageText.slice(1).split(' ');

      if (ctxCommand === 'task') {
        const taskName = args.join(' ').trim();

        if (!taskName) {
          await ctx.reply(`Give your task a name like: !task Learn the Saxophone 🐥`);

          return;
        }

        const task = createTask(ctx.userDisplayName ?? '', taskName);

        if (task) {
          getSocketServer().emit('tasks:created', task);
          await ctx.reply(`Quack quack! Your task "${taskName}" is now on the board! 🐥✨`);
        } else {
          await ctx.reply(`You already have a task waddle-ing! Finish it first with !done 🐥`);
        }

        return;
      }

      if (ctxCommand === 'done') {
        const task = completeTask(ctx.userDisplayName ?? '');

        if (task) {
          getSocketServer().emit('tasks:completed', task);
          await ctx.reply(`QUAAACK! 🎉 You crushed "${task.task_name}"! Proud duck moment! 🐥💪`);
        } else {
          await ctx.reply(`No task to complete! Create one with !task 🐥`);
        }

        return;
      }

      if (ctxCommand === 'like') {
        const targetUser = args[0]?.replace('@', '').trim();

        if (!targetUser) {
          await ctx.reply(`Quack! Tell me who to cheer for: !like username 🐥`);

          return;
        }

        const task = likeTask(targetUser);

        if (task) {
          getSocketServer().emit('tasks:liked', { username: targetUser, likes: task.likes });
          await ctx.reply(`Sent love to @${targetUser}'s task! 🐥❤️`);
        } else {
          await ctx.reply(`Couldn't find a task for @${targetUser}! 🐥`);
        }

        return;
      }

      if (ctxCommand === 'delete') {
        const mods = await apiClient.moderation.getModerators(ctx.broadcasterId);
        const modIds = mods.data.map((m) => m.userId);
        const isMod = modIds.includes(ctx.userId) || ctx.userId === ctx.broadcasterId;

        if (!isMod) {
          await ctx.reply(`Only mods can delete tasks! 🐥🔒`);

          return;
        }

        const targetUser = args[0]?.replace('@', '').trim();

        if (!targetUser) {
          await ctx.reply(`Quack! Specify who: !delete username 🐥`);

          return;
        }

        const task = deleteTask(targetUser);

        if (task) {
          getSocketServer().emit('tasks:deleted', { username: targetUser });
          await ctx.reply(`Removed @${targetUser}'s task! 🐥🗑️`);
        } else {
          await ctx.reply(`No task found for @${targetUser}! 🐥`);
        }

        return;
      }

      if (ctxCommand === 'color') {
        if (args.length === 1 && /^#?[0-9A-Fa-f]{6}$/.test(args[0])) {
          getSocketServer().emit('message', {
            messageText: `Updated to ${args[0]}`,
            color: args[0].startsWith('#') ? args[0] : `#${args[0]}`,
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
          await ctx.reply(
            `@${ctx.userDisplayName} Provide a valid hex color like duck yellow #FFD94E.`,
          );
        }
      }

      if (ctxCommand === 'hug') {
        const targetUser = args[0]?.replace('@', '');

        if (!targetUser) {
          await ctx.reply(`Quack! Who do you want to hug? Try !hug @username 🐥💜`);

          return;
        }

        getSocketServer().emit('hug', {
          fromUser: ctx.userDisplayName ?? '',
          toUser: targetUser,
        });
        await ctx.reply(`${ctx.userDisplayName} sends a big ducky hug to @${targetUser}! 🐥💜`);

        return;
      }

      if (ctxCommand === 'move') {
        getSocketServer().emit('move', {
          username: ctx.userDisplayName ?? '',
        });

        return;
      }

      if (ctxCommand === 'commands') {
        await ctx.reply('!color {hex}, !task {name}, !done, !like {user}, !hug @user, !move');
      }
    } else {
      getSocketServer().emit('message', {
        command,
        color,
        messageText,
        username: ctx.userDisplayName ?? '',
      });

      const mentionMatch = messageText.match(/@(\w+)/);

      if (mentionMatch) {
        const mentionedUser = mentionMatch[1];
        getSocketServer().emit('mention', {
          fromUser: ctx.userDisplayName ?? '',
          toUser: mentionedUser,
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
