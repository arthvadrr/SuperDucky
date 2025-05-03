import db from '../../db/sqlite';
import { Router } from 'express';
import type { Request, Response } from 'express';

const router: Router = Router();

export type Excerpt = {
  id: number
  book_title: string
  book_excerpt: string
  book_author: string
  book_author_race: string
  book_author_role: string
} | undefined;

router.get('/excerpts-count', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = (await db.prepare('SELECT COUNT(*) AS excerpt_count FROM excerpts').get()) as { excerpt_count: number } | undefined;

    if (!result) {
      res.status(404).json({ error: 'No excerpts found' });
      return;
    }

    res.status(200).json({ excerpt_count: result.excerpt_count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch count' });
  }
});

router.get('/random-excerpt', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.prepare(`
  SELECT 
    id, 
    book_title,
    book_excerpt, 
    book_author, 
    book_author_race,
    book_author_role
  FROM excerpts 
  ORDER BY RANDOM() 
  LIMIT 1
`).get() as Excerpt;

    if (!result) {
      res.status(404).json({ error: 'No excerpts found' });
      return;
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch random excerpt' });
  }
});

export default router;