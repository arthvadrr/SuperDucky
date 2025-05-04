import { reactive } from 'vue';

export interface Message {
  messageText: string;
  username?: string;
  readingLength: number;
}

export const messages: Message[] = reactive([]);

export default messages;
