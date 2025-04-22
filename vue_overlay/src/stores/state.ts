import { reactive } from 'vue'

/**
 * Types and interfaces
 */
export interface User {
  username: string
  color: string
  messages: string[]
}

export type SpriteStateKey = 'idle' | 'walk' | 'talk'

export interface SpriteStateAssets {
  idle: string
  walk: string
  talk: string
}

export interface Sprite {
  assets: SpriteStateAssets
  state?: SpriteStateKey
  speed?: number
  color?: string
  messages: string[]
  username: string
  size: number
  position?: {
    x: number
    y: number
  }
}

export interface Message {
  username: string
  command: string
  messageText: string
}

export interface State {
  users: User[]
  sprites: Sprite[]
  messages: Message[]
}

export const state: State = reactive({
  users: [{ username: 'foo', color: '#000000', messages: ['bar']}],
  sprites: [],
  messages: [{ username: 'foo', command: 'move', messageText: 'bar'}]
});

export default state;
