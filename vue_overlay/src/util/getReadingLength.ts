import { READING_BASE_DURATION, READING_DURATION_MULTIPLIER } from '@/util/constants.ts';

export default function getReadingLength(text: string = '') {
  if (!text) return 0;

  return text.split(' ').length * READING_DURATION_MULTIPLIER + READING_BASE_DURATION;
}
