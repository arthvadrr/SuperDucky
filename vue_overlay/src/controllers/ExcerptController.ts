import decodeHtmlEntities from '@/util/decodeHtmlEntities.ts';
import excerpts from '@/stores/excerpts.ts';
import { socket } from '@/socket.ts';
import type { Excerpt } from '@/types/Excerpt.ts';

socket.on('excerpt', (ctx): void => {
  const excerpt: Excerpt = ctx.excerpt;

  if (excerpts.length > 30) {
    excerpts.shift();
  }

  if (
    excerpt?.id &&
    excerpt?.book_title &&
    excerpt?.book_excerpt &&
    excerpt?.book_author &&
    excerpt?.book_author_race &&
    excerpt?.book_author_role
  ) {
    const id: number = excerpt.id;
    const book_title: string = decodeHtmlEntities(excerpt.book_title);
    const book_excerpt: string = decodeHtmlEntities(excerpt.book_excerpt);
    const book_author: string = decodeHtmlEntities(excerpt.book_author);
    const book_author_race: string = decodeHtmlEntities(excerpt.book_author_race);
    const book_author_role: string = decodeHtmlEntities(excerpt.book_author_role);

    excerpts.push({
      id,
      book_title,
      book_excerpt,
      book_author,
      book_author_race,
      book_author_role,
    });
  }
});
