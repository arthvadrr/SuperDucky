import { reactive } from 'vue';

export interface Message {
  messageText: string;
  username: string;
}

export const messages: Message[] = reactive([]);

export default messages;
