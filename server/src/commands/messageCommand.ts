import { getSocketServer } from '../socket';
import type { MessageEvent } from '@twurple/easy-bot';

export default function messageCommand(ctx: MessageEvent) {
  const messageText: string = ctx.text;

  /**
   * Make sure we have a command and possibly args
   * e.g. !move fast ("!" + "command" + "args");
   */
  if (messageText.startsWith('!')) {
    const [command, ...args] = messageText.slice(1).split(' ');

    /**
     * Check for existing commands
     */
    if (command === 'move' || command === 'walk' || command === 'go') {
      ctx.reply('quack! 🐥');

      getSocketServer().emit('walkMessage', {
        message: 'move',
        username: ctx.userDisplayName,
      });
    }
  }
}
