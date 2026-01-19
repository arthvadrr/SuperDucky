import { getSocketServer } from '../socket';
import type { MessageEvent } from '@twurple/easy-bot';

export default async function messageCommand(ctx: MessageEvent): Promise<void> {
  const messageText: string = ctx.text;

  /**
   * Make sure we have a command and possibly args
   */
  if (messageText.startsWith('!')) {
    const [command] = messageText.slice(1).split(' ');

    /**
     * Check for existing commands
     */
    if (command === 'move' || command === 'walk' || command === 'go') {
      await ctx.reply('quack! 🐥');

      const io = getSocketServer();

      if (io) {
        io.emit('walkMessage', {
          message: 'move',
          username: ctx.userDisplayName,
        });
      }
    }
  }
}
