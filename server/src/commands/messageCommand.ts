import { getSocketServer } from '../socket';
import type { MessageEvent } from '@twurple/easy-bot';

export default async function messageCommand(ctx: MessageEvent): Promise<void> {
  const messageText: string = ctx.text;

  /**
   * Make sure we have a command and possibly args
   * ...args on line 12 to use the rest of the messageText
   */
  if (messageText.startsWith('!')) {
    const [command] = messageText.slice(1).split(' ');

    /**
     * Check for existing commands
     */
    if (command === 'move' || command === 'walk' || command === 'go') {
      await ctx.reply('quack! 🐥');

      getSocketServer().emit('walkMessage', {
        message: 'move',
        username: ctx.userDisplayName,
      });
    }
  }
}